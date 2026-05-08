from rest_framework import serializers
from .models import UserLessonProgress, UserNote, QuizQuestion, QuizChoice, UserQuizAttempt, UserCodeSubmission, Enrollment
from .models import ProjectSubmission, ProjectPeerReview


class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_slug = serializers.CharField(source='course.slug', read_only=True)
    course_level = serializers.CharField(source='course.level', read_only=True)
    course_thumbnail = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            'id', 'course', 'course_title', 'course_slug', 'course_level',
            'course_thumbnail', 'enrolled_at', 'progress_percentage',
            'is_completed', 'completed_at'
        ]
        read_only_fields = ['enrolled_at', 'progress_percentage', 'is_completed', 'completed_at']

    def get_course_thumbnail(self, obj):
        request = self.context.get('request')
        if obj.course.thumbnail and request:
            return request.build_absolute_uri(obj.course.thumbnail.url)
        return None


class UserLessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLessonProgress
        fields = ['id', 'lesson', 'is_completed', 'last_watched_position', 'updated_at']
        read_only_fields = ['lesson']


class UserNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNote
        fields = ['id', 'lesson', 'content', 'video_timecode', 'created_at', 'updated_at']
        read_only_fields = ['lesson']


class QuizChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizChoice
        fields = ['id', 'text']  # Ne pas exposer is_correct ici pour la sécurité


class QuizQuestionSerializer(serializers.ModelSerializer):
    choices = QuizChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = QuizQuestion
        fields = ['id', 'text', 'choices', 'order']


class QuizSubmissionSerializer(serializers.Serializer):
    # Dictionnaire de forme {question_id: choice_id}
    answers = serializers.DictField(
        child=serializers.IntegerField(),
        help_text="Format: {'question_id': choice_id}"
    )


class UserQuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserQuizAttempt
        fields = ['id', 'lesson', 'score', 'passed', 'created_at']
        read_only_fields = ['lesson', 'score', 'passed']


class UserCodeSubmissionSerializer(serializers.ModelSerializer):
    starter_code = serializers.CharField(source='lesson.starter_code', read_only=True)
    solution_code = serializers.CharField(source='lesson.solution_code', read_only=True)

    class Meta:
        model = UserCodeSubmission
        fields = ['id', 'lesson', 'code', 'last_result', 'starter_code', 'solution_code', 'updated_at']
        read_only_fields = ['lesson', 'last_result']



#  PEER REVIEW SERIALIZERS


class ProjectPeerReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.get_full_name', read_only=True)

    class Meta:
        model = ProjectPeerReview
        fields = ['id', 'reviewer_name', 'score', 'feedback', 'is_approved', 'created_at']


class ProjectSubmissionSerializer(serializers.ModelSerializer):
    peer_reviews = ProjectPeerReviewSerializer(many=True, read_only=True)

    class Meta:
        model = ProjectSubmission
        fields = [
            'id', 'project', 'repo_url', 'code_content', 
            'status', 'submitted_at', 'peer_reviews', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'submitted_at']
