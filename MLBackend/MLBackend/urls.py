from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    # API Utilisateurs (Inscription, Connexion, 2FA, Profil, RGPD)
    path("api/users/", include("users.urls")),
    # API Cours (Catalogue, Modules, Leçons)
    path("api/courses/", include("courses.urls")),
    # API Apprentissage (Progression, Quiz, Code, Notes)
    path("api/learning/", include("learning.urls")),
    # API Instructeur
    path("api/instructor/", include("courses.instructor_urls")),
    # OAuth Social (Google, GitHub, LinkedIn via allauth)
    path("api/auth/", include("allauth.urls")),
]

# Servir les fichiers media en développement (avatars, etc.)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
