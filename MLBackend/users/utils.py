import threading
import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)

def send_mail_async(subject, message, recipient_list, from_email=None, html_message=None, fail_silently=False):
    """
    Envoie un email en arrière-plan (non-bloquant) pour que les réponses HTTP
    soient instantanées (< 50ms) sans suspendre l'utilisateur.
    """
    from_email = from_email or getattr(settings, "DEFAULT_FROM_EMAIL", "dtech.afrik@gmail.com")

    def _send():
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=recipient_list,
                html_message=html_message,
                fail_silently=False,
            )
            logger.info(f"Email envoyé avec succès en arrière-plan à {recipient_list}")
        except Exception as e:
            logger.error(f"Erreur d'envoi d'email en arrière-plan pour {recipient_list}: {e}")

    thread = threading.Thread(target=_send, daemon=True)
    thread.start()
