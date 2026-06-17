from django.urls import include, path
from rest_framework.routers import DefaultRouter
from users.views import InstructorProfileView

from .views_instructor import (
    InstructorCourseViewSet, InstructorLearningPathViewSet, InstructorLessonViewSet, 
    InstructorModuleViewSet, InstructorPeerReviewViewSet, InstructorProjectViewSet, 
    InstructorStatsView
)

router = DefaultRouter()
router.register(r"courses", InstructorCourseViewSet, basename="instructor-course")
router.register(r"learning-paths", InstructorLearningPathViewSet, basename="instructor-learning-path")
router.register(r"modules", InstructorModuleViewSet, basename="instructor-module")
router.register(r"lessons", InstructorLessonViewSet, basename="instructor-lesson")
router.register(r"projects", InstructorProjectViewSet, basename="instructor-project")
router.register(r"peer-reviews", InstructorPeerReviewViewSet, basename="instructor-peer-review")

urlpatterns = [
    # 💡 SÉCURITÉ : La route fixe est placée en premier pour garantir son exécution prioritaire
    path("stats/", InstructorStatsView.as_view(), name="instructor-stats"),
    path("profile/", InstructorProfileView.as_view(), name="instructor-profile-detail"),
    path("", include(router.urls)),
]