from django.db import models
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

from .models import UserQuizAttempt, Enrollment, Certificate, Review, ProjectSubmission, UserLessonProgress
from .services.review_service import ReviewService
from .tasks import send_submission_received_email, send_new_feedback_email
from users.models import Notification, Message, CustomUser


# ═════════════════════════════════════════════
#  STATE TRACKERS (Anti-surcharge DB & Doublons)
# ═════════════════════════════════════════════

@receiver(pre_save, sender=UserLessonProgress)
@receiver(pre_save, sender=Enrollment)
@receiver(pre_save, sender=Review)
def track_instance_initial_state(sender, instance, **kwargs):
    """Mémorise dynamiquement l'état initial des champs clés pour éviter les calculs et requêtes inutiles."""
    instance._initial_state = {}
    if instance.pk:
        try:
            old_obj = sender.objects.get(pk=instance.pk)
            if sender == Review:
                instance._initial_state['status'] = old_obj.status
            else:
                instance._initial_state['is_completed'] = old_obj.is_completed
        except sender.DoesNotExist:
            pass


# ═════════════════════════════════════════════
#  NOTIFICATIONS & WORKFLOWS
# ═════════════════════════════════════════════

@receiver(post_save, sender=CustomUser)
def notify_welcome_new_user(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance,
            type='system',
            title="Bienvenue sur MLAcademy ! 🚀",
            content="Nous sommes ravis de vous compter parmi nous. Explorez le catalogue pour commencer votre voyage dans l'IA.",
            link="/parcours"
        )

@receiver(post_save, sender=Enrollment)
def notify_course_enrollment(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user,
            type='system',
            title=f"Inscription : {instance.course.title}",
            content="Vous venez de rejoindre ce cours. Bonne chance pour votre apprentissage !",
            link=f"/learning/{instance.course.slug}/lesson/"
        )

@receiver(post_save, sender=UserQuizAttempt)
def notify_quiz_result(sender, instance, created, **kwargs):
    if created:
        status_str = "Réussi" if instance.passed else "Échoué"
        Notification.objects.create(
            user=instance.user,
            type='grade',
            title=f"Quiz {status_str} : {instance.lesson.title}",
            content=f"Vous avez obtenu {instance.score}%.",
            link="/dashboard/grades"
        )

@receiver(post_save, sender=Review)
def notify_and_finalize_peer_review(sender, instance, created, **kwargs):
    """Gère l'envoi de feedbacks et boucle le statut du projet lors de la complétion d'une Review."""
    was_completed = getattr(instance, '_initial_state', {}).get('status') == 'completed'
    
    if instance.status == 'completed' and not was_completed:
        # 1. Notifier l'auteur du projet
        Notification.objects.create(
            user=instance.submission.user,
            type='grade',
            title="Nouvelle évaluation reçue",
            content=f"Un {instance.get_review_type_display().lower()} a évalué votre projet '{instance.submission.project.title}'. Score : {instance.get_total_score()}.",
            link="/dashboard/grades"
        )
        
        send_new_feedback_email.delay(
            user_email=instance.submission.user.email,
            student_name=instance.submission.user.get_full_name() or instance.submission.user.username,
            project_title=instance.submission.project.title,
            review_url="dashboard/grades"
        )
        
        # 2. Clôturer et statuer sur la soumission globale
        instance.submission.check_and_finalize()

@receiver(post_save, sender=ProjectSubmission)
def trigger_review_workflow(sender, instance, created, **kwargs):
    if instance.status == 'pending':
        if not instance.reviews.exists():
            ReviewService.assign_automated_reviews(instance)
            
            send_submission_received_email.delay(
                user_email=instance.user.email,
                student_name=instance.user.get_full_name() or instance.user.username,
                project_title=instance.project.title,
                dashboard_url="dashboard/grades"
            )

@receiver(post_save, sender=Certificate)
def notify_certificate_issued(sender, instance, created, **kwargs):
    if created:
        target_name = instance.learning_path.title if instance.learning_path else (instance.course.title if instance.course else "Formation")
        Notification.objects.create(
            user=instance.user,
            type='system',
            title="Félicitations ! 🎓",
            content=f"Votre certificat pour '{target_name}' est disponible.",
            link="/dashboard/certifications"
        )

@receiver(post_save, sender=Enrollment)
def notify_course_completion(sender, instance, created, **kwargs):
    """Déclenche la notification de fin de cours uniquement lors de la transition réelle du statut."""
    if not created and instance.is_completed:
        was_completed = getattr(instance, '_initial_state', {}).get('is_completed', False)
        
        if not was_completed:
            Notification.objects.create(
                user=instance.user,
                type='system',
                title=f"Félicitations : {instance.course.title} terminé ! 🎉",
                content="Vous avez complété 100% du cours. Votre attestation de suivi est en cours de génération.",
                link="/dashboard/grades"
            )

@receiver(post_save, sender=Message)
def notify_new_message(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.recipient,
            type='message',
            title=f"Message de {instance.sender.get_full_name() or instance.sender.username}",
            content=instance.subject,
            link="/dashboard/messages"
        )


# ═════════════════════════════════════════════
#  GAMIFICATION ATOMIC XP SIGNALS (Post-Save)
# ═════════════════════════════════════════════

@receiver(post_save, sender=UserLessonProgress)
def award_xp_for_lesson(sender, instance, created, **kwargs):
    """Octroie +50 XP de manière atomique lors de la première complétion d'une leçon."""
    if instance.is_completed:
        was_completed = getattr(instance, '_initial_state', {}).get('is_completed', False)
        if created or not was_completed:
            CustomUser.objects.filter(pk=instance.user.pk).update(xp_points=models.F('xp_points') + 50)


@receiver(post_save, sender=UserQuizAttempt)
def award_xp_for_quiz(sender, instance, created, **kwargs):
    """Octroie +100 XP de manière atomique lors du premier succès à un questionnaire."""
    if created and instance.passed:
        already_passed = UserQuizAttempt.objects.filter(
            user=instance.user, lesson=instance.lesson, passed=True
        ).exclude(pk=instance.pk).exists()

        if not already_passed:
            CustomUser.objects.filter(pk=instance.user.pk).update(xp_points=models.F('xp_points') + 100)


@receiver(post_save, sender=Certificate)
def award_xp_for_certificate(sender, instance, created, **kwargs):
    """Octroie +500 XP de manière atomique lors du décaissement d'une certification."""
    if created:
        CustomUser.objects.filter(pk=instance.user.pk).update(xp_points=models.F('xp_points') + 500)