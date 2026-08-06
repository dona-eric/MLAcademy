from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LessonProgressView, LessonNoteViewSet, LessonQuizView, LessonCodeSubmissionView,
    ProjectSubmissionViewSet, PeerReviewViewSet, NotificationViewSet, SubmitReviewView,
    EnrollView, MyCoursesView, PathEnrollView, MyPathsView, MyCertificatesView,
    CertificateViewSet, DashboardSummaryView, AiTutorChatView, UserBadgesView
)

router = DefaultRouter()
router.register(r'lessons/(?P<lesson_id>\d+)/notes', LessonNoteViewSet, basename='lesson-note')
router.register(r'submissions', ProjectSubmissionViewSet, basename='submission')
router.register(r'peer-reviews', PeerReviewViewSet, basename='peer-review')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'certificates', CertificateViewSet, basename='certificate')

urlpatterns = [
    path('reviews/submit/', SubmitReviewView.as_view(), name='submit-review'),
    path('enroll/<slug:course_slug>/', EnrollView.as_view(), name='enroll'),
    path('my-courses/', MyCoursesView.as_view(), name='my-courses'),
    path('enroll-path/<slug:path_slug>/', PathEnrollView.as_view(), name='enroll-path'),
    path('my-paths/', MyPathsView.as_view(), name='my-paths'),
    path('my-certificates/', MyCertificatesView.as_view(), name='my-certificates'),
    path('lessons/<int:lesson_id>/progress/', LessonProgressView.as_view(), name='lesson-progress'),
    path('lessons/<int:lesson_id>/quiz/', LessonQuizView.as_view(), name='lesson-quiz'),
    path('lessons/<int:lesson_id>/code/', LessonCodeSubmissionView.as_view(), name='lesson-code'),
    path('dashboard-summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('tutor/chat/', AiTutorChatView.as_view(), name='tutor-chat'),
    path('badges/', UserBadgesView.as_view(), name='user-badges'),
    path('', include(router.urls)),
]