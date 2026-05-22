from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views_instructor import (InstructorCourseViewSet,InstructorLearningPathViewSet, InstructorLessonViewSet, 
InstructorModuleViewSet, InstructorPeerReviewViewSet, InstructorProjectViewSet, InstructorStatsView,
InstructorQuizQuestionViewSet, InstructorQuizChoiceViewSet, InstructorLessonAttachmentViewSet)

router = DefaultRouter()
router.register(r"courses", InstructorCourseViewSet, basename="instructor-course")
router.register(r"learning-paths", InstructorLearningPathViewSet, basename="instructor-learning-path")
router.register(r"modules", InstructorModuleViewSet, basename="instructor-module")
router.register(r"lessons", InstructorLessonViewSet, basename="instructor-lesson")
router.register(r"projects", InstructorProjectViewSet, basename="instructor-project")
router.register(r"peer-reviews", InstructorPeerReviewViewSet, basename="instructor-peer-review")
router.register(r"quiz-questions", InstructorQuizQuestionViewSet, basename="instructor-quiz-question")
router.register(r"quiz-choices", InstructorQuizChoiceViewSet, basename="instructor-quiz-choice")
router.register(r"lesson-attachments", InstructorLessonAttachmentViewSet, basename="instructor-lesson-attachment")

urlpatterns = [
    path("", include(router.urls)),
    path("stats/", InstructorStatsView.as_view(), name="instructor-stats"),
]
