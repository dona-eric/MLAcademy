from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views_instructor import (
    InstructorCourseViewSet,
    InstructorLessonViewSet,
    InstructorModuleViewSet,
    InstructorPeerReviewViewSet,
    InstructorProjectViewSet,
)

router = DefaultRouter()
router.register(r"courses", InstructorCourseViewSet, basename="instructor-course")
router.register(r"modules", InstructorModuleViewSet, basename="instructor-module")
router.register(r"lessons", InstructorLessonViewSet, basename="instructor-lesson")
router.register(r"projects", InstructorProjectViewSet, basename="instructor-project")
router.register(
    r"peer-reviews", InstructorPeerReviewViewSet, basename="instructor-peer-review"
)

urlpatterns = [
    path("", include(router.urls)),
]
