from django_filters import rest_framework as filters
from rest_framework import viewsets, permissions, filters as drf_filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Course, CourseReview, LearningPath
from .serializers import (
    CategorySerializer, CourseListSerializer, CourseDetailSerializer,
    CourseReviewSerializer, LearningPathListSerializer, LearningPathDetailSerializer
)


#  CATEGORY

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None # Liste brute pour les sélecteurs du studio


#  LEARNING PATH (Parcours / Certification)

class LearningPathFilter(filters.FilterSet):
    category_slug = filters.CharFilter(field_name="category__slug")

    class Meta:
        model = LearningPath
        fields = ['level', 'is_free', 'is_certifying', 'category_slug']


class LearningPathViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Catalogue de parcours certifiants.
    GET /api/courses/paths/ → Liste
    GET /api/courses/paths/{slug}/ → Détail avec cours ordonnés
    """
    queryset = LearningPath.objects.filter(is_published=True).select_related('category', 'creator')
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.DjangoFilterBackend, drf_filters.SearchFilter, drf_filters.OrderingFilter]
    filterset_class = LearningPathFilter
    search_fields = ['title', 'description', 'short_description']
    ordering_fields = ['avg_rating', 'enrolled_count', 'created_at', 'estimated_weeks']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LearningPathDetailSerializer
        return LearningPathListSerializer


#  COURSE

class CourseFilter(filters.FilterSet):
    min_duration = filters.NumberFilter(field_name="duration_hours", lookup_expr='gte')
    max_duration = filters.NumberFilter(field_name="duration_hours", lookup_expr='lte')
    category_slug = filters.CharFilter(field_name="category__slug")

    class Meta:
        model = Course
        fields = ['level', 'is_free', 'is_standalone', 'category_slug']


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Catalogue de cours (filtrage, recherche, détails).
    GET /api/courses/ → Liste (cours publiés)
    GET /api/courses/{slug}/ → Détail avec modules, prérequis, reviews
    """
    queryset = Course.objects.filter(is_published=True).select_related('category', 'instructor')
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.DjangoFilterBackend, drf_filters.SearchFilter, drf_filters.OrderingFilter]
    filterset_class = CourseFilter
    search_fields = ['title', 'description', 'short_description', 'syllabus']
    ordering_fields = ['avg_rating', 'enrolled_count', 'created_at']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseListSerializer

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def review(self, request, slug=None):
        course = self.get_object()
        serializer = CourseReviewSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(course=course)
        return Response(serializer.data, status=201)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def check_prerequisites(self, request, slug=None):
        """
        GET /api/courses/{slug}/check_prerequisites/
        Vérifie si l'utilisateur peut accéder à ce cours.
        """
        course = self.get_object()
        can_access, missing = course.check_prerequisites(request.user)
        return Response({
            "can_access": can_access,
            "missing_courses": [
                {"id": c.id, "title": c.title, "slug": c.slug}
                for c in missing
            ]
        })
