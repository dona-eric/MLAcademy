import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "MLBackend.settings")
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print("EMAIL_BACKEND:", settings.EMAIL_BACKEND)
print("EMAIL_HOST:", settings.EMAIL_HOST)
print("EMAIL_PORT:", settings.EMAIL_PORT)
print("EMAIL_HOST_USER:", settings.EMAIL_HOST_USER)
print("EMAIL_HOST_PASSWORD:", "SET" if settings.EMAIL_HOST_PASSWORD else "NOT SET")

try:
    send_mail(
        'Subject here',
        'Here is the message.',
        settings.EMAIL_HOST_USER,
        ['[EMAIL_ADDRESS]'],
        fail_silently=False,     
    )
    print("Email sent successfully!")
except Exception as e:
    print("Error sending email:", e)
