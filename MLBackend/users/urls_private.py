from django.urls import path

from .views import (
    DeleteAccountView,
    Enable2FAView,
    ExportUserDataView,
    LogoutView,
    ProfileView,
    SocialJWTCompleteView,
    Verify2FAView,
    ApplyInstructorView,
    InstructorApplicationStatusView,
    ChangePasswordView,
    SaveFCMTokenView,
)

urlpatterns = [
    path("logout/", LogoutView.as_view(), name="logout"),
    path("social/complete/", SocialJWTCompleteView.as_view(), name="social-jwt-complete"),
    path("2fa/enable/", Enable2FAView.as_view(), name="2fa-enable"),
    path("2fa/verify/", Verify2FAView.as_view(), name="2fa-verify"),
    path("me/", ProfileView.as_view(), name="profile-me"),
    path("me/delete/", DeleteAccountView.as_view(), name="account-delete"),
    path("me/export/", ExportUserDataView.as_view(), name="account-export"),
    path("me/change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("save-fcm-token/", SaveFCMTokenView.as_view(), name="save-fcm-token"),
    path("apply-instructeur/", ApplyInstructorView.as_view(), name="apply-instructor"),
    path("instructeur-application/status/", InstructorApplicationStatusView.as_view(), name="instructor-status"),
]
