from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, CourseViewSet, LearningPathViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'paths', LearningPathViewSet, basename='learning-path')
router.register(r'', CourseViewSet, basename='course')

urlpatterns = [
    path('', include(router.urls)),
]
