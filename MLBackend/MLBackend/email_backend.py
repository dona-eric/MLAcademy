import os
import resend
from django.core.mail.backends.base import BaseEmailBackend
from django.conf import settings

class ResendEmailBackend(BaseEmailBackend):
    """
    Un backend d'email Django personnalisé pour envoyer des emails via l'API Resend.
    """

    def __init__(self, fail_silently=False, **kwargs):
        super().__init__(fail_silently=fail_silently)
        self.api_key = getattr(settings, 'RESEND_API_KEY', os.getenv('RESEND_API_KEY'))
        if self.api_key:
            resend.api_key = self.api_key

    def send_messages(self, email_messages):
        if not email_messages:
            return 0
            
        if not resend.api_key:
            if not self.fail_silently:
                raise ValueError("RESEND_API_KEY n'est pas configuré.")
            return 0

        sent_count = 0
        for message in email_messages:
            try:
                # Récupérer le contenu HTML s'il existe
                html_body = None
                if hasattr(message, 'alternatives'):
                    for alt in message.alternatives:
                        if alt[1] == 'text/html':
                            html_body = alt[0]
                            break

                # S'assurer que le from_email est valide (sinon utiliser la valeur par défaut)
                from_address = message.from_email or getattr(settings, 'DEFAULT_FROM_EMAIL', 'onboarding@resend.dev')
                # Si le from_email de base est "noreply@mlacademy.io" mais que le domaine n'est pas vérifié,
                # Resend bloquera. Pour les tests, on force le DEFAULT_FROM_EMAIL.
                from_address = getattr(settings, 'DEFAULT_FROM_EMAIL', from_address)

                payload = {
                    "from": from_address,
                    "to": list(message.to), # S'assurer que c'est bien une liste
                    "subject": message.subject,
                }
                
                # S'assurer qu'il n'y a pas d'adresse vide
                payload["to"] = [email for email in payload["to"] if email]
                
                # Resend accepte soit 'text', soit 'html', ou les deux.
                if html_body:
                    payload["html"] = html_body
                    payload["text"] = message.body
                else:
                    payload["text"] = message.body

                # Envoi via l'API Resend
                resend.Emails.send(payload)
                sent_count += 1
            except Exception as e:
                if not self.fail_silently:
                    raise e

        return sent_count
