import sys
import os
import django

sys.path.append('/home/donerick/MLAcademy/MLBackend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MLBackend.settings')
django.setup()

from users.models import CustomUser

email = sys.argv[1]
try:
    user = CustomUser.objects.get(email=email)
    user.email_verified = True
    user.is_active = True
    if len(sys.argv) > 2 and sys.argv[2] == 'instructor':
        user.is_instructor = True
        user.instructor_application_status = 'approved'
    user.save()
    print(f"User {email} verified.")
except Exception as e:
    print(f"Error: {e}")
