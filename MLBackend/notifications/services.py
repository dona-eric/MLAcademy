import os
from svix.api import Svix
from django.conf import settings

# This wrapper allows sending webhooks using Svix
class WebhookService:
    @staticmethod
    def send_webhook(app_id: str, event_type: str, payload: dict):
        """
        Send a webhook via Svix.
        Requires SVIX_API_KEY in the environment variables.
        """
        api_key = os.environ.get("SVIX_API_KEY")
        if not api_key:
            # We fail silently or log in development if Svix is not configured
            print(f"[Webhook] {event_type} not sent because SVIX_API_KEY is missing.")
            return False

        try:
            svix = Svix(api_key)
            svix.message.create(
                app_id,
                {
                    "eventType": event_type,
                    "payload": payload
                }
            )
            return True
        except Exception as e:
            print(f"[Webhook] Error sending to Svix: {e}")
            return False
