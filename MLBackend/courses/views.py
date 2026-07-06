from django_filters import rest_framework as filters
from rest_framework import viewsets, permissions, status, filters as drf_filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, Course, CourseReview, LearningPath
from .serializers import (
    CategorySerializer, CourseListSerializer, CourseDetailSerializer,
    CourseReviewSerializer, LearningPathListSerializer, LearningPathDetailSerializer
)


# ═════════════════════════════════════════════
#  CATEGORY VIEWSET
# ═════════════════════════════════════════════

from rest_framework.exceptions import PermissionDenied

class CategoryViewSet(viewsets.ModelViewSet):
    """
    Débit public en lecture seule pour l'exploration des catégories, 
    création autorisée pour les instructeurs.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        if not self.request.user.is_instructor and not self.request.user.is_staff:
            raise PermissionDenied("Seuls les instructeurs peuvent créer des catégories.")
        serializer.save()


# ═════════════════════════════════════════════
#  LEARNING PATH CATALOG (Parcours / Certification)
# ═════════════════════════════════════════════

class LearningPathFilter(filters.FilterSet):
    category_slug = filters.CharFilter(field_name="category__slug")

    class Meta:
        model = LearningPath
        fields = ['level', 'is_free', 'is_certifying', 'category_slug']


class LearningPathViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Catalogue public des parcours certifiants (Learning Paths).
    
    GET /api/courses/paths/ -> Liste filtrée des parcours publiés
    GET /api/courses/paths/{slug}/ -> Détail complet incluant les cours ordonnés
    """
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.DjangoFilterBackend, drf_filters.SearchFilter, drf_filters.OrderingFilter]
    filterset_class = LearningPathFilter
    search_fields = ['title', 'description', 'short_description']
    ordering_fields = ['avg_rating', 'enrolled_count', 'created_at', 'estimated_weeks']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_queryset(self):
        """
        💡 OPTIMISATION N+1 : Charge les relations critiques à la volée 
        uniquement lorsque l'utilisateur demande la fiche détaillée d'un parcours.
        """
        queryset = LearningPath.objects.filter(is_published=True).select_related('category', 'creator')
        if self.action == 'retrieve':
            return queryset.prefetch_related('path_courses__course', 'certification_exam')
        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LearningPathDetailSerializer
        return LearningPathListSerializer


# ═════════════════════════════════════════════
#  COURSE CATALOG (Cours individuels)
# ═════════════════════════════════════════════

class CourseFilter(filters.FilterSet):
    min_duration = filters.NumberFilter(field_name="duration_hours", lookup_expr='gte')
    max_duration = filters.NumberFilter(field_name="duration_hours", lookup_expr='lte')
    category_slug = filters.CharFilter(field_name="category__slug")

    class Meta:
        model = Course
        fields = ['level', 'is_free', 'is_standalone', 'category_slug']


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Catalogue public des cours individuels.
    
    GET /api/courses/ -> Liste filtrée des cours publiés
    GET /api/courses/{slug}/ -> Fiche détaillée (avec modules chaînés, avis et prérequis)
    """
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.DjangoFilterBackend, drf_filters.SearchFilter, drf_filters.OrderingFilter]
    filterset_class = CourseFilter
    search_fields = ['title', 'description', 'short_description', 'syllabus']
    ordering_fields = ['avg_rating', 'enrolled_count', 'created_at']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_queryset(self):
        """
        Prévient l'explosion des requêtes SQL SQL lors du chargement 
        complet de l'arborescence imbriquée d'un cours (Modules -> Leçons -> Projets).
        """
        queryset = Course.objects.filter(is_published=True).select_related('category', 'instructor')
        if self.action == 'retrieve':
            return queryset.prefetch_related(
                'course_modules__module__lessons',
                'course_modules__module__project',
                'reviews__user',
                'prerequisites_set__required_course'
            )
        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseListSerializer

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def review(self, request, slug=None):
        """
        POST /api/courses/{slug}/review/
        Permet à un étudiant connecté de noter et d'évaluer un cours.
        """
        course = self.get_object()
        
        # 💡 CORRECTIF : On clone les données pour injecter l'id du cours ciblé
        # afin de nourrir proprement le système anti-collision du sérialiseur.
        data = request.data.copy()
        data['course'] = course.id
        
        serializer = CourseReviewSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def check_prerequisites(self, request, slug=None):
        """
        GET /api/courses/{slug}/check_prerequisites/
        Vérifie si l'étudiant dispose des validations nécessaires pour débloquer ce cours.
        """
        # 💡 OPTIMISATION : Inclusion accélérée des prérequis en mémoire
        course = Course.objects.prefetch_related('prerequisites_set__required_course').get(slug=slug)
        
        can_access, missing = course.check_prerequisites(request.user)
        return Response({
            "can_access": can_access,
            "missing_courses": [
                {"id": c.id, "title": c.title, "slug": c.slug}
                for c in missing
            ]
        })