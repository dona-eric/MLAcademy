from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import UserQuizAttempt, Enrollment, Certificate, Review, ProjectSubmission, UserLessonProgress
from .services.review_service import ReviewService
from .tasks import send_submission_received_email, send_new_feedback_email
from users.models import Notification, Message, CustomUser

@receiver(post_save, sender=CustomUser)
def notify_welcome_new_user(sender, instance, created, **kwargs):
    """Notifie un nouvel utilisateur lors de son inscription."""
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
    """Notifie l'utilisateur lors de son inscription à un cours."""
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
    """Notifie l'utilisateur du résultat de son quiz."""
    if created:
        status = "Réussi" if instance.passed else "Échoué "
        Notification.objects.create(
            user=instance.user,
            type='grade',
            title=f"Quiz {status} : {instance.lesson.title}",
            content=f"Vous avez obtenu {instance.score}%.",
            link=f"/dashboard/grades"
        )

@receiver(post_save, sender=Review)
def notify_peer_review(sender, instance, created, **kwargs):
    """Notifie l'auteur d'un projet qu'il a reçu une évaluation."""
    if instance.status == 'completed':
        Notification.objects.create(
            user=instance.submission.user,
            type='grade',
            title="Nouvelle évaluation reçue",
            content=f"Un {instance.get_review_type_display().lower()} a évalué votre projet '{instance.submission.project.title}'. Score : {instance.get_total_score()}.",
            link=f"/dashboard/grades"
        )
        # Envoi de l'e-mail asynchrone
        send_new_feedback_email.delay(
            user_email=instance.submission.user.email,
            student_name=instance.submission.user.get_full_name() or instance.submission.user.username,
            project_title=instance.submission.project.title,
            review_url="http://localhost:3000/dashboard/grades"
        )

@receiver(post_save, sender=Review)
def handle_review_completion(sender, instance, **kwargs):
    """Déclenche check_and_finalize quand une Review passe en 'completed'."""
    if instance.status == 'completed':
        instance.submission.check_and_finalize()

@receiver(post_save, sender=ProjectSubmission)
def trigger_review_workflow(sender, instance, created, **kwargs):
    """Déclenche le workflow d'assignation des revues quand le statut passe à pending."""
    # On vérifie seulement si des updates sont faites ou si la soumission est créée directement en pending
    if instance.status == 'pending':
        if not instance.reviews.exists():
            ReviewService.assign_automated_reviews(instance)
            
            # Envoi de l'accusé de réception (on le fait ici pour s'assurer que c'est une soumission initiale/nouvelle)
            send_submission_received_email.delay(
                user_email=instance.user.email,
                student_name=instance.user.get_full_name() or instance.user.username,
                project_title=instance.project.title,
                dashboard_url="http://localhost:3000/dashboard/grades"
            )

@receiver(post_save, sender=Certificate)
def notify_certificate_issued(sender, instance, created, **kwargs):
    """Notifie l'utilisateur de l'obtention d'un certificat."""
    if created:
        Notification.objects.create(
            user=instance.user,
            type='system',
            title="Félicitations ! 🎓",
            content=f"Votre certificat pour '{instance.target_name}' est disponible.",
            link="/dashboard/certifications"
        )

@receiver(post_save, sender=Enrollment)
def notify_course_completion(sender, instance, created, **kwargs):
    """Notifie l'utilisateur lorsqu'il termine un cours."""
    # On ne fait rien à la création (déjà géré par notify_course_enrollment)
    if not created and instance.is_completed:
        # On vérifie si une notification de complétion existe déjà pour éviter les doublons
        exists = Notification.objects.filter(
            user=instance.user, 
            type='system', 
            title__icontains=f"Félicitations : {instance.course.title}"
        ).exists()
        
        if not exists:
            Notification.objects.create(
                user=instance.user,
                type='system',
                title=f"Félicitations : {instance.course.title} terminé ! 🎉",
                content="Vous avez complété 100% du cours. Votre attestation de suivi est en cours de génération.",
                link="/dashboard/grades"
            )

@receiver(post_save, sender=Message)
def notify_new_message(sender, instance, created, **kwargs):
    """Notifie le destinataire d'un nouveau message."""
    if created:
        Notification.objects.create(
            user=instance.recipient,
            type='message',
            title=f"Message de {instance.sender.get_full_name()}",
            content=instance.subject,
            link="/dashboard/messages"
        )

# --- GAMIFICATION XP SIGNALS ---

@receiver(pre_save, sender=UserLessonProgress)
def award_xp_for_lesson(sender, instance, **kwargs):
    """F-10 : +50 XP lorsque la leçon est marquée comme terminée pour la première fois."""
    if instance.pk:
        try:
            old_instance = UserLessonProgress.objects.get(pk=instance.pk)
            if not old_instance.is_completed and instance.is_completed:
                instance.user.xp_points += 50
                instance.user.save(update_fields=['xp_points'])
        except UserLessonProgress.DoesNotExist:
            pass
    else:
        if instance.is_completed:
            instance.user.xp_points += 50
            instance.user.save(update_fields=['xp_points'])


@receiver(pre_save, sender=UserQuizAttempt)
def award_xp_for_quiz(sender, instance, **kwargs):
    """F-10 : +100 XP lors de la première réussite d'un quiz."""
    if instance.passed:
        already_passed = UserQuizAttempt.objects.filter(
            user=instance.user, 
            lesson=instance.lesson, 
            passed=True
        ).exclude(pk=instance.pk).exists()

        if not already_passed:
            if instance.pk:
                try:
                    old_instance = UserQuizAttempt.objects.get(pk=instance.pk)
                    if not old_instance.passed:
                        instance.user.xp_points += 100
                        instance.user.save(update_fields=['xp_points'])
                except UserQuizAttempt.DoesNotExist:
                    pass
            else:
                instance.user.xp_points += 100
                instance.user.save(update_fields=['xp_points'])


@receiver(post_save, sender=Certificate)
def award_xp_for_certificate(sender, instance, created, **kwargs):
    """F-10 : +500 XP lors de l'obtention d'une certification."""
    if created:
        instance.user.xp_points += 500
        instance.user.save(update_fields=['xp_points'])
