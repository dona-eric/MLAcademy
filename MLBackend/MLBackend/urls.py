from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from users.views import SocialView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


urlpatterns = [
    path("admin/", admin.site.urls),
    path('i18n/', include('django.conf.urls.i18n')),
    # API PUBLIQUE
    path("api/public/users/", include("users.urls_public")),
    path("api/public/courses/", include("courses.urls")), # Catalogue public
    path("api/public/certificates/", include("learning.urls_public")),
    
    # - API PRIVÉE ---
    path("api/private/users/", include("users.urls_private")),
    path("api/private/learning/", include("learning.urls")), # Progression, Enrôlement, Quiz

    
    # AUTRES 
    path("api/admin/management/", include("management.urls")),
    # API Studio (Privé par nature via IsInstructor)
    path("api/studio/", include("courses.instructor_urls")),
    path("api/private/studio/", include("courses.instructor_urls")),
    # OAuth Social Hybrid (Better-Auth Bridge)
    path("api/auth/social/", SocialView.as_view(), name="social-auth-exchange"),
    # OAuth Social Legacy/Allauth
    path("api/auth/", include("allauth.urls")),
    # Talent Hub & Community
    path("api/community/", include("community.urls")),

    # Téléchargement du schéma au format YAML/JSON
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    
    # Interface Swagger UI (Interactive, permet de tester)
    path('api/docs/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # Interface ReDoc (Très propre et lisible, style 3 colonnes)
    path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Servir les fichiers media en développement (avatars, etc.)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
