from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminStatsView, 
    AdminInstructorApplicationViewSet, 
    AdminEnrollmentViewSet,
    AdminCommunicationView,
    PlatformSettingsView,
    AuditLogView,
    TransactionViewSet,
    AdminTeamViewSet
)

router = DefaultRouter()
router.register(r'instructor-applications', AdminInstructorApplicationViewSet, basename='admin-instructor-apps')
router.register(r'enrollments', AdminEnrollmentViewSet, basename='admin-enrollments')
router.register(r'transactions', TransactionViewSet, basename='admin-transactions')
router.register(r'team', AdminTeamViewSet, basename='admin-team')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('communication/', AdminCommunicationView.as_view(), name='admin-comm'),
    path('settings/', PlatformSettingsView.as_view(), name='platform-settings'),
    path('audit/', AuditLogView.as_view(), name='admin-audit'),
]
