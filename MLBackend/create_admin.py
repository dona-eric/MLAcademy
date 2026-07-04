import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MLBackend.settings')
django.setup()

from users.models import CustomUser

email = 'admin@mlacademy.com'
password = 'AdminPassword123@@'

if not CustomUser.objects.filter(email=email).exists():
    CustomUser.objects.create_superuser(
        username='dona',
        email=email,
        password=password,
        first_name='Admin',
        last_name='data',
        email_verified=True # Important pour le login
    )
    print(f"Superuser created successfully: {email}")
else:
    # Ensure existing user has staff privileges and verified email
    user = CustomUser.objects.get(email=email)
    user.set_password(password) # Force le mot de passe
    user.is_staff = True
    user.is_superuser = True
    user.email_verified = True
    user.save()
    print(f"User {email} updated to Superuser and Verified.")
