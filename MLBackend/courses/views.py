from django_filters import rest_framework as filters
from rest_framework import viewsets, permissions, filters as drf_filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Course, CourseReview
from .serializers import (
    CategorySerializer, CourseListSerializer, CourseDetailSerializer, CourseReviewSerializer
)


class CourseFilter(filters.FilterSet):
    min_duration = filters.NumberFilter(field_name="duration_hours", lookup_expr='gte')
    max_duration = filters.NumberFilter(field_name="duration_hours", lookup_expr='lte')
    category_slug = filters.CharFilter(field_name="category__slug")

    class Meta:
        model = Course
        fields = ['level', 'is_free', 'category_slug']


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Catalogue de cours (filtrage, recherche, détails).
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
    def review(self, request, pk=None):
        course = self.get_object()
        serializer = CourseReviewSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(course=course)
        return Response(serializer.data, status=201)
