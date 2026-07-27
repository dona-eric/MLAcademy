import os
import sys
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "MLBackend.settings")
django.setup()

from django.core.mail import send_mail
from django.conf import settings

target_email = sys.argv[1] if len(sys.argv) > 1 else "donaerickoulodji@gmail.com"

print("--- DIAGNOSTIC SMTP BREVO DIRECT ---")
print("EMAIL_BACKEND:", settings.EMAIL_BACKEND)
print("EMAIL_HOST:", settings.EMAIL_HOST)
print("EMAIL_PORT:", settings.EMAIL_PORT)
print("EMAIL_USE_TLS:", settings.EMAIL_USE_TLS)
print("EMAIL_HOST_USER:", settings.EMAIL_HOST_USER)
print("EMAIL_HOST_PASSWORD:", "FURNISHED (Length: %d)" % len(settings.EMAIL_HOST_PASSWORD) if settings.EMAIL_HOST_PASSWORD else "(NOT SET)")
print("DEFAULT_FROM_EMAIL:", settings.DEFAULT_FROM_EMAIL)
print("DESTINATAIRE:", target_email)
print("-------------------------------------")

try:
    print("Tentative d'envoi en cours...")
    res = send_mail(
        subject="[MLAcademy] Test Brevo SMTP Direct",
        message="Bonjour ! Si vous recevez ce message, la configuration Brevo Direct SMTP sur MLAcademy fonctionne parfaitement.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[target_email],
        fail_silently=False,
    )
    print("🎉 SUCCÈS ! Nombre d'emails envoyés :", res)
except Exception as e:
        print("❌ ERREUR LORS DE L'ENVOI SMTP :", type(e).__name__, "-", e)

