from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LessonProgressView, LessonNoteViewSet, LessonQuizView, LessonCodeSubmissionView,
    ProjectSubmissionViewSet, PeerReviewViewSet, EnrollView, MyCoursesView
)

router = DefaultRouter()
# /api/learning/lessons/{id}/notes/
router.register(r'lessons/(?P<lesson_id>\d+)/notes', LessonNoteViewSet, basename='lesson-note')
# Peer Review
router.register(r'submissions', ProjectSubmissionViewSet, basename='submission')
router.register(r'peer-reviews', PeerReviewViewSet, basename='peer-review')

urlpatterns = [
    # --- Enrollment ---
    path('enroll/<slug:course_slug>/', EnrollView.as_view(), name='enroll'),
    path('my-courses/', MyCoursesView.as_view(), name='my-courses'),

    # --- F-05: Progression ---
    path('lessons/<int:lesson_id>/progress/', LessonProgressView.as_view(), name='lesson-progress'),
    
    # --- F-05: Notes (géré par le router) ---
    path('', include(router.urls)),

    # --- F-07: Quiz ---
    path('lessons/<int:lesson_id>/quiz/', LessonQuizView.as_view(), name='lesson-quiz'),
    
    # --- F-06: Code Submission ---
    path('lessons/<int:lesson_id>/code/', LessonCodeSubmissionView.as_view(), name='lesson-code'),
]
