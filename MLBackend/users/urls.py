from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)   
from .views import (
    CookieTokenRefreshView,
    CustomTokenObtainPairView,
    DeleteAccountView,
    Enable2FAView,
    ExportUserDataView,
    LogoutView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    ProfileView,
    PublicProfileView,
    RegisterView,
    SocialJWTCompleteView,
    Verify2FAView,
    VerifyEmailView, ApplyInstructorView,
    CheckEmailView,
)

urlpatterns = [
    # Inscription & Auth Check
    path("check-email/", CheckEmailView.as_view(), name="check-email"),
    path("register/", RegisterView.as_view(), name="user-register"),
    path("verify-email/<uuid:token>/", VerifyEmailView.as_view(), name="verify-email"),
    # Connexion JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("logout/", LogoutView.as_view(), name="logout"),
    # OAuth social: completion de la session allauth vers les cookies JWT
    path("social/complete/", SocialJWTCompleteView.as_view(), name="social-jwt-complete"),
    # Reset mot de passe
    path("password-reset/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    # 2FA
    path("2fa/enable/", Enable2FAView.as_view(), name="2fa-enable"),
    path("2fa/verify/", Verify2FAView.as_view(), name="2fa-verify"),
    # Profil Apprenant
    path("me/", ProfileView.as_view(), name="profile-me"),
    path("profile/<str:username>/", PublicProfileView.as_view(), name="profile-public"),
    # Compte (RGPD)
    path("me/delete/", DeleteAccountView.as_view(), name="account-delete"),
    path("me/export/", ExportUserDataView.as_view(), name="account-export"),
    # Candidature Instructeur
    path("apply-instructeur/", ApplyInstructorView.as_view(), name="apply-instructor"),
]
