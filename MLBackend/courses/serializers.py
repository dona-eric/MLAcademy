from rest_framework import serializers

from .models import Category, Course, CourseReview, Lesson, Module, Project


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "icon", "description"]


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            "id",
            "module",
            "title",
            "lesson_type",
            "content",
            "video_url",
            "duration_minutes",
            "order",
            "is_free_preview",
        ]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "module", "title", "description", "instructions", "starter_code", "is_final"]


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    project = ProjectSerializer(read_only=True)

    class Meta:
        model = Module
        fields = ["id", "course", "title", "description", "order", "lessons", "project"]


class CourseReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = CourseReview
        fields = ["id", "user_name", "rating", "comment", "created_at"]
        read_only_fields = ["user"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class CourseListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    instructor_name = serializers.CharField(
        source="instructor.get_full_name", read_only=True
    )

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "category",
            "category_name",
            "instructor_name",
            "level",
            "duration_hours",
            "thumbnail",
            "avg_rating",
            "enrolled_count",
            "is_published",
            "is_free",
        ]


class CourseDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    instructor_name = serializers.CharField(
        source="instructor.get_full_name", read_only=True
    )
    modules = ModuleSerializer(many=True, read_only=True)
    reviews = CourseReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "description",
            "category",
            "instructor_name",
            "level",
            "duration_hours",
            "thumbnail",
            "preview_url",
            "prerequisites",
            "syllabus",
            "avg_rating",
            "enrolled_count",
            "is_free",
            "modules",
            "reviews",
            "created_at",
            "updated_at",
        ]


class InstructorCourseEditSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), allow_null=True, required=False
    )
    category_name = serializers.CharField(source="category.name", read_only=True)
    instructor_name = serializers.CharField(
        source="instructor.get_full_name", read_only=True
    )
    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "description",
            "category",
            "category_name",
            "instructor_name",
            "level",
            "duration_hours",
            "thumbnail",
            "preview_url",
            "prerequisites",
            "syllabus",
            "is_published",
            "is_free",
            "avg_rating",
            "enrolled_count",
            "modules",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "instructor_name",
            "avg_rating",
            "enrolled_count",
            "created_at",
            "updated_at",
        ]
