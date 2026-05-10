from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    
    # --- API PUBLIQUE ---
    path("api/public/users/", include("users.urls_public")),
    path("api/public/courses/", include("courses.urls")), # Catalogue public
    
    # --- API PRIVÉE ---
    path("api/private/users/", include("users.urls_private")),
    path("api/private/learning/", include("learning.urls")), # Progression, Enrôlement, Quiz
    
    # --- AUTRES ---
    # API Instructeur (Privé par nature via IsInstructor)
    path("api/instructor/", include("courses.instructor_urls")),
    # OAuth Social
    path("api/auth/", include("allauth.urls")),
]

# Servir les fichiers media en développement (avatars, etc.)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
