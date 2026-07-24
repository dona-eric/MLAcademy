import json
import logging
import urllib.request
import urllib.error
from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend
from django.core.mail.backends.smtp import EmailBackend as SmtpEmailBackend

logger = logging.getLogger(__name__)

class BrevoEmailBackend(BaseEmailBackend):
    """
    Custom Django Email Backend for Brevo (Sendinblue) Transactional REST API v3.
    Fallback to standard SMTP if Brevo API is unavailable or returns an IP authorization error.
    """

    def __init__(self, fail_silently=False, **kwargs):
        super().__init__(fail_silently=fail_silently, **kwargs)
        self.api_key = getattr(settings, "BREVO_API_KEY", None)
        self.from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "dtech.afrik@gmail.com")

    def send_messages(self, email_messages):
        if not email_messages:
            return 0

        sent_count = 0
        for message in email_messages:
            if self._send_via_brevo_api(message):
                sent_count += 1
            else:
                # Fallback to standard SMTP (Gmail / SMTP relay) if Brevo REST API fails
                logger.warning(f"Fallback vers SMTP classique pour l'email à {message.to}")
                if self._send_via_smtp_fallback(message):
                    sent_count += 1

        return sent_count

    def _send_via_brevo_api(self, message):
        api_key = getattr(settings, "BREVO_API_KEY", None)
        if not api_key:
            return False

        url = "https://api.brevo.com/v3/smtp/email"
        sender_email = message.from_email or self.from_email
        
        payload = {
            "sender": {"name": "MLAcademy", "email": sender_email},
            "to": [{"email": to_email} for to_email in message.to],
            "subject": message.subject,
            "textContent": message.body,
        }

        # If message has HTML content
        if getattr(message, "html_message", None):
            payload["htmlContent"] = message.html_message
        else:
            payload["htmlContent"] = f"<p style='font-family: sans-serif; line-height: 1.6;'>{message.body.replace('\n', '<br>')}</p>"

        headers = {
            "accept": "application/json",
            "api-key": api_key,
            "content-type": "application/json",
        }

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=8) as response:
                if response.getcode() in [200, 201, 202]:
                    logger.info(f"E-mail Brevo API envoyé avec succès à {message.to}")
                    return True
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8", errors="ignore")
            logger.error(f"Erreur API Brevo (HTTP {e.code}): {error_body}")
            if "unrecognised IP address" in error_body or "authorised_ips" in error_body:
                logger.error("🚨 ATTENTION: Brevo exige d'autoriser l'IP dans https://app.brevo.com/security/authorised_ips")
        except Exception as e:
            logger.error(f"Erreur réseau/API Brevo: {e}")

        return False

    def _send_via_smtp_fallback(self, message):
        try:
            smtp_backend = SmtpEmailBackend(
                host=getattr(settings, "EMAIL_HOST", "smtp.gmail.com"),
                port=getattr(settings, "EMAIL_PORT", 587),
                username=getattr(settings, "EMAIL_HOST_USER", None),
                password=getattr(settings, "EMAIL_HOST_PASSWORD", None),
                use_tls=getattr(settings, "EMAIL_USE_TLS", True),
                use_ssl=getattr(settings, "EMAIL_USE_SSL", False),
                timeout=getattr(settings, "EMAIL_TIMEOUT", 5),
                fail_silently=self.fail_silently,
            )
            return smtp_backend.send_messages([message]) > 0
        except Exception as e:
            logger.error(f"Erreur SMTP Fallback: {e}")
            return False
