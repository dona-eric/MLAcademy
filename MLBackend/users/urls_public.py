from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    PublicProfileView,
    RegisterView,
    VerifyEmailView,
    CheckEmailView,
    ApplyInstructorView,
    PublicInstructorStatusView,
    InstructorAccountActivateView,
)

urlpatterns = [
    path("check-email/", CheckEmailView.as_view(), name="check-email"),
    path("register/", RegisterView.as_view(), name="user-register"),
    path("verify-email/<uuid:token>/", VerifyEmailView.as_view(), name="verify-email"),
    path("token/", CustomTokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path(
        "password-reset/",
        PasswordResetRequestView.as_view(),
        name="password-reset-request",
    ),
    path(
        "password-reset/confirm/",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),
    path("profile/<str:username>/", PublicProfileView.as_view(), name="profile-public"),
    path("apply-instructor/", ApplyInstructorView.as_view(), name="apply-instructor"),
    path("instructor-status/", PublicInstructorStatusView.as_view(), name="instructor-status-public"),
    path("instructor-activate/", InstructorAccountActivateView.as_view(), name="instructor-activate"),
]
