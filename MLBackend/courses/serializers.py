from rest_framework import serializers
from .models import (
    Category, Course, CourseReview, Lesson, Module, Project,
    LearningPath, LearningPathCourse, CoursePrerequisite, CertificationExam, CourseModule
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "icon", "description"]


# ═════════════════════════════════════════════
#  LESSON / MODULE / PROJECT
# ═════════════════════════════════════════════

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            "id", "module", "title", "lesson_type", "content",
            "video_url", "duration_minutes", "order", "is_free_preview"
        ]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id", "module", "title", "description", "instructions", 
            "starter_code", "solution_code", "is_final", "is_capstone", "passing_score"
        ]


class ModuleSerializer(serializers.ModelSerializer):
    """
    Serializer global pour la gestion de la bibliothèque de modules (Vue Instructeur / Admin).
    """
    lessons = LessonSerializer(many=True, read_only=True)
    project = ProjectSerializer(read_only=True)
    usage_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Module
        fields = [
            "id", "title", "slug", "description", "category", 
            "author", "estimated_hours", "is_published", "lessons", "project", "usage_count"
        ]


class CourseModuleInsideCourseSerializer(serializers.ModelSerializer):
    """
    💡 CORRECTIF CRITIQUE : Cette classe fait la passerelle avec la table de jonction.
    Elle permet au frontend de recevoir les modules d'un cours avec leur bon ordonnancement,
    tout en préservant exactement la structure JSON attendue.
    """
    id = serializers.IntegerField(source="module.id", read_only=True)
    title = serializers.CharField(source="module.title", read_only=True)
    slug = serializers.CharField(source="module.slug", read_only=True)
    description = serializers.CharField(source="module.description", read_only=True)
    estimated_hours = serializers.DecimalField(source="module.estimated_hours", max_digits=4, decimal_places=1, read_only=True)
    lessons = LessonSerializer(source="module.lessons", many=True, read_only=True)
    project = ProjectSerializer(source="module.project", read_only=True)

    class Meta:
        model = CourseModule
        fields = ["id", "title", "slug", "description", "estimated_hours", "order", "lessons", "project"]


# ═════════════════════════════════════════════
#  COURSE REVIEWS & PREREQUISITES
# ═════════════════════════════════════════════

class CourseReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = CourseReview
        fields = ["id", "course", "user_name", "rating", "comment", "created_at"]
        read_only_fields = ["user"]

    def validate(self, attrs):
        """
        💡 OPTIMISATION : Évite un crash 500 en bdd si l'étudiant tente de soumettre un deuxième avis.
        """
        request = self.context.get("request")
        if request and request.user:
            course = attrs.get("course")
            user = request.user
            
            # En cas de mise à jour (PUT/PATCH), on exclut l'instance actuelle de la vérification
            existing_review = CourseReview.objects.filter(user=user, course=course)
            if self.instance:
                existing_review = existing_review.exclude(pk=self.instance.pk)
                
            if existing_review.exists():
                raise serializers.ValidationError("Vous avez déjà publié un avis sur ce cours.")
        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class CoursePrerequisiteSerializer(serializers.ModelSerializer):
    required_course_title = serializers.CharField(source="required_course.title", read_only=True)
    required_course_slug = serializers.CharField(source="required_course.slug", read_only=True)

    class Meta:
        model = CoursePrerequisite
        fields = ["id", "required_course", "required_course_title", "required_course_slug"]


# ═════════════════════════════════════════════
#  COURSE READ-ONLY READERS
# ═════════════════════════════════════════════

class CourseListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    instructor_name = serializers.CharField(source="instructor.get_full_name", read_only=True)
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id", "title", "slug", "short_description", "category", "category_name", 
            "instructor_name", "level", "duration_hours", "thumbnail", "avg_rating", 
            "enrolled_count", "is_published", "is_free", "is_standalone", "price", "is_enrolled"
        ]

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            from learning.models import Enrollment
            return Enrollment.objects.filter(user=request.user, course=obj).exists()
        return False


class CourseDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    instructor_name = serializers.CharField(source="instructor.get_full_name", read_only=True)
    # 💡 CORRECTION : Utilisation du serializer de jonction pour récupérer les modules ordonnés
    modules = CourseModuleInsideCourseSerializer(source="course_modules", many=True, read_only=True)
    reviews = CourseReviewSerializer(many=True, read_only=True)
    prerequisites = CoursePrerequisiteSerializer(source="prerequisites_set", many=True, read_only=True)
    in_paths = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id", "title", "slug", "short_description", "description", "category", 
            "instructor_name", "level", "duration_hours", "thumbnail", "preview_url", 
            "prerequisites_text", "prerequisites", "syllabus", "avg_rating", "enrolled_count",
            "is_free", "is_standalone", "price", "modules", "reviews", "in_paths", "is_enrolled", "created_at", "updated_at"
        ]

    def get_in_paths(self, obj):
        """Retourne les parcours dans lesquels ce cours apparaît."""
        path_courses = LearningPathCourse.objects.filter(course=obj).select_related('learning_path')
        return [
            {
                "path_id": pc.learning_path.id,
                "path_title": pc.learning_path.title,
                "path_slug": pc.learning_path.slug,
                "order": pc.order,
            }
            for pc in path_courses
        ]

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            from learning.models import Enrollment
            return Enrollment.objects.filter(user=request.user, course=obj).exists()
        return False


# ═════════════════════════════════════════════
#  LEARNING PATH (Parcours)
# ═════════════════════════════════════════════

class LearningPathCourseSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    course_slug = serializers.CharField(source="course.slug", read_only=True)
    course_level = serializers.CharField(source="course.level", read_only=True)
    course_duration = serializers.IntegerField(source="course.duration_hours", read_only=True)
    # 💡 OPTIMISATION : DRF gère automatiquement l'URL absolue des ImageField si le context contient la request.
    course_thumbnail = serializers.ImageField(source="course.thumbnail", read_only=True)

    class Meta:
        model = LearningPathCourse
        fields = [
            "id", "course", "course_title", "course_slug",
            "course_level", "course_duration", "course_thumbnail", "order", "is_required"
        ]


class CertificationExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificationExam
        fields = ["id", "title", "instructions", "duration_minutes", "passing_score", "max_attempts_per_week"]


class LearningPathListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    creator_name = serializers.CharField(source="creator.get_full_name", read_only=True)

    class Meta:
        model = LearningPath
        fields = [
            "id", "title", "slug", "short_description", "category", "creator_name", "level",
            "thumbnail", "estimated_weeks", "is_certifying", "is_free", "price", "enrolled_count",
            "avg_rating", "courses_count"
        ]


class LearningPathDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    creator_name = serializers.CharField(source="creator.get_full_name", read_only=True)
    courses = LearningPathCourseSerializer(source="path_courses", many=True, read_only=True)
    certification_exam = CertificationExamSerializer(read_only=True)

    class Meta:
        model = LearningPath
        fields = [
            "id", "title", "slug", "short_description", "description", "category", "creator_name", "level",
            "thumbnail", "estimated_weeks", "is_published", "is_certifying", "is_free", "price",
            "enrolled_count", "avg_rating", "courses_count", "courses", "certification_exam", "created_at", "updated_at"
        ]


# ═════════════════════════════════════════════
#  INSTRUCTOR EDITION WRITERS
# ═════════════════════════════════════════════

class InstructorCourseEditSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), allow_null=True, required=False
    )
    category_name = serializers.CharField(source="category.name", read_only=True)
    instructor_name = serializers.CharField(source="instructor.get_full_name", read_only=True)
    modules = CourseModuleInsideCourseSerializer(source="course_modules", many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            "id", "title", "slug", "short_description", "description", "category", "category_name", "instructor_name",
            "level", "duration_hours", "thumbnail", "preview_url", "prerequisites_text", "syllabus", "is_published",
            "is_free", "is_standalone", "price", "avg_rating", "enrolled_count", "modules", "created_at", "updated_at"
        ]
        # 💡 SÉCURITÉ : Le slug est généré automatiquement par le modèle, on le passe en read_only.
        read_only_fields = [
            "id", "slug", "instructor_name", "avg_rating", "enrolled_count", "created_at", "updated_at"
        ]


class InstructorLearningPathEditSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), allow_null=True, required=False
    )
    category_name = serializers.CharField(source="category.name", read_only=True)
    creator_name = serializers.CharField(source="creator.get_full_name", read_only=True)
    courses = LearningPathCourseSerializer(source="path_courses", many=True, read_only=True)

    class Meta:
        model = LearningPath
        fields = [
            "id", "title", "slug", "short_description", "description", "category", "category_name", "creator_name",
            "level", "thumbnail", "estimated_weeks", "is_published", "is_certifying", "is_free", "price",
            "courses_count", "enrolled_count", "avg_rating", "courses", "created_at", "updated_at"
        ]
        read_only_fields = [
            "id", "slug", "creator_name", "courses_count", "enrolled_count", "avg_rating", "created_at", "updated_at"
        ]