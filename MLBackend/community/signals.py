import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from community.models import ChallengeSubmission
from community.gamification import evaluate_user_gamification

logger = logging.getLogger(__name__)

@receiver(post_save, sender=ChallengeSubmission)
def trigger_gamification_on_challenge(sender, instance, created, **kwargs):
    """
    Déclenche l'évaluation de la gamification lors de la soumission d'un challenge.
    """
    if created and instance.user:
        try:
            evaluate_user_gamification(
                user=instance.user,
                event_type="challenge_submitted",
                extra_data={"challenge_id": instance.challenge.id}
            )
        except Exception as e:
            logger.error(f"Erreur lors du déclenchement du signal de gamification pour challenge: {e}")
