import threading
import logging
import traceback
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)

def send_mail_async(subject, message, recipient_list, from_email=None, html_message=None, fail_silently=False):
    """
    Envoie un email de manière asynchrone (thread d'arrière-plan)
    pour offrir des réponses HTTP instantanées tout en assurant l'envoi SMTP.
    """
    clean_from_email = (from_email or getattr(settings, "DEFAULT_FROM_EMAIL", "MLAcademy <dtech.afrik@gmail.com>")).strip("'\" ")
    clean_recipients = [r.strip("'\" ") for r in recipient_list if r]

    def _send():
        try:
            res = send_mail(
                subject=subject,
                message=message,
                from_email=clean_from_email,
                recipient_list=clean_recipients,
                html_message=html_message,
                fail_silently=fail_silently,
            )
            logger.info(f"✅ Email envoyé avec succès ({res}) à {clean_recipients}")
        except Exception as e:
            logger.error(f"❌ ÉCHEC ENVOI EMAIL à {clean_recipients} : {type(e).__name__} - {e}\n{traceback.format_exc()}")

    thread = threading.Thread(target=_send, daemon=False)
    thread.start()
