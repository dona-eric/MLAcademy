from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserQuizAttempt, Enrollment, Certificate, ProjectPeerReview, ProjectSubmission
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

@receiver(post_save, sender=ProjectPeerReview)
def notify_peer_review(sender, instance, created, **kwargs):
    """Notifie l'auteur d'un projet qu'il a reçu une correction."""
    if created:
        Notification.objects.create(
            user=instance.submission.user,
            type='grade',
            title="Nouvelle correction reçue",
            content=f"Un pair a évalué votre projet '{instance.submission.project.title}'. Score : {instance.score}/100.",
            link=f"/dashboard/grades"
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
