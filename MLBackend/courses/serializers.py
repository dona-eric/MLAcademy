from rest_framework import serializers
from .models import (
    Category, Course, CourseReview, Lesson, Module, Project,
    LearningPath, LearningPathCourse, CoursePrerequisite, CertificationExam, LessonAttachment
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "icon", "description"]


#  LESSON / MODULE / PROJECT

class LessonAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonAttachment
        fields = ["id", "lesson", "title", "file", "created_at"]


class LessonSerializer(serializers.ModelSerializer):
    attachments = LessonAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ["id", "module", "title", "lesson_type", "content",
                  "video_url", "duration_minutes", "order", "is_free_preview", "attachments"
                  ]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "module", "title", "description", "instructions", 
                  "starter_code", "solution_code", "is_final", "is_capstone", "passing_score"]

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    project = ProjectSerializer(read_only=True)

    class Meta:
        model = Module
        fields = ["id", "course", "title", "description", "order", "lessons", "project"]

#  COURSE

class CourseReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = CourseReview
        fields = ["id", "user_name", "rating", "comment", "created_at"]
        read_only_fields = ["user"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

class CoursePrerequisiteSerializer(serializers.ModelSerializer):
    required_course_title = serializers.CharField(source="required_course.title", read_only=True)
    required_course_slug = serializers.CharField(source="required_course.slug", read_only=True)

    class Meta:
        model = CoursePrerequisite
        fields = ["id", "required_course", "required_course_title", "required_course_slug"]

class CourseListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    instructor_name = serializers.CharField(source="instructor.get_full_name", read_only=True)

    class Meta:
        model = Course
        fields = ["id", "title", "slug", "short_description", "category", "category_name", "instructor_name",
            "level", "duration_hours", "thumbnail","avg_rating", "enrolled_count","is_published", "is_free", 
            "is_standalone", "price", "learning_objectives"]


class CourseDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    instructor_name = serializers.CharField(source="instructor.get_full_name", read_only=True)
    modules = ModuleSerializer(many=True, read_only=True)
    reviews = CourseReviewSerializer(many=True, read_only=True)
    prerequisites = CoursePrerequisiteSerializer(source="prerequisites_set", many=True, read_only=True)
    in_paths = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ["id", "title", "slug", "short_description", "description","category", "instructor_name", "level", "duration_hours",
            "thumbnail", "preview_url", "prerequisites_text", "prerequisites", "learning_objectives", "syllabus", "avg_rating", 
            "enrolled_count","is_free", "is_standalone", "price","modules", "reviews", "in_paths", "created_at", "updated_at"
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


#  LEARNING PATH (Parcours)

class LearningPathCourseSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    course_slug = serializers.CharField(source="course.slug", read_only=True)
    course_level = serializers.CharField(source="course.level", read_only=True)
    course_duration = serializers.IntegerField(source="course.duration_hours", read_only=True)
    course_thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = LearningPathCourse
        fields = [
            "id", "course", "course_title", "course_slug","course_level", 
            "course_duration", "course_thumbnail","order", "is_required"]

    def get_course_thumbnail(self, obj):
        request = self.context.get('request')
        if obj.course.thumbnail and request:
            return request.build_absolute_uri(obj.course.thumbnail.url)
        return None


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
            "thumbnail", "estimated_weeks", "is_certifying", "is_free", "price","enrolled_count",
            "avg_rating", "courses_count",]

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
            "enrolled_count", "avg_rating", "courses_count", "courses", "certification_exam","created_at", "updated_at",
        ]

#  INSTRUCTOR (édition)

class InstructorCourseEditSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), allow_null=True, required=False
    )
    category_name = serializers.CharField(source="category.name", read_only=True)
    instructor_name = serializers.CharField(source="instructor.get_full_name", read_only=True)
    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            "id", "title", "slug", "short_description", "description", "category", "category_name", "instructor_name",
            "level", "duration_hours", "thumbnail", "preview_url", "prerequisites_text", "learning_objectives", "syllabus", "is_published",
             "is_free", "is_standalone", "price", "avg_rating", "enrolled_count", "modules", "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "instructor_name", "avg_rating", "enrolled_count","created_at", "updated_at"]


class InstructorLearningPathEditSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), allow_null=True, required=False
    )
    category_name = serializers.CharField(source="category.name", read_only=True)
    creator_name = serializers.CharField(source="creator.get_full_name", read_only=True)
    courses = LearningPathCourseSerializer(source="path_courses", many=True, read_only=True)
    certification_exam = CertificationExamSerializer(required=False, allow_null=True)

    class Meta:
        model = LearningPath
        fields = [
            "id", "title", "slug", "short_description", "description", "category", "category_name", "creator_name",
            "level", "thumbnail", "estimated_weeks", "is_published", "is_certifying", "is_free", "price",
            "courses_count", "enrolled_count", "avg_rating", "courses", "certification_exam", "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "creator_name", "courses_count", "enrolled_count", "avg_rating", "created_at", "updated_at",
        ]

    def update(self, instance, validated_data):
        exam_data = validated_data.pop('certification_exam', None)
        if exam_data:
            if instance.certification_exam:
                for attr, value in exam_data.items():
                    setattr(instance.certification_exam, attr, value)
                instance.certification_exam.save()
            else:
                instance.certification_exam = CertificationExam.objects.create(**exam_data)
        
        return super().update(instance, validated_data)
