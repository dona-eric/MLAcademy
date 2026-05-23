from rest_framework import serializers
from .models import (
    Enrollment, PathEnrollment, UserLessonProgress, UserNote,
    QuizQuestion, QuizChoice, UserQuizAttempt, UserCodeSubmission,
    ProjectSubmission, Review, CertificationExamAttempt, Certificate,
    SkillBadge, UserBadge
)
from users.models import Notification


# ═════════════════════════════════════════════
#  ENROLLMENT (Inscriptions)
# ═════════════════════════════════════════════

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


class PathEnrollmentSerializer(serializers.ModelSerializer):
    path_title = serializers.CharField(source='learning_path.title', read_only=True)
    path_slug = serializers.CharField(source='learning_path.slug', read_only=True)
    path_level = serializers.CharField(source='learning_path.level', read_only=True)
    path_thumbnail = serializers.SerializerMethodField(read_only=True)
    can_take_exam = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PathEnrollment
        fields = [
            'id', 'learning_path', 'path_title', 'path_slug', 'path_level',
            'path_thumbnail', 'enrolled_at', 'progress_percentage',
            'is_completed', 'is_certified', 'completed_at', 'can_take_exam'
        ]
        read_only_fields = ['enrolled_at', 'progress_percentage', 'is_completed', 'is_certified', 'completed_at']

    def get_path_thumbnail(self, obj):
        request = self.context.get('request')
        if obj.learning_path.thumbnail and request:
            return request.build_absolute_uri(obj.learning_path.thumbnail.url)
        return None

    def get_can_take_exam(self, obj):
        return obj.can_take_certification_exam()


# ═════════════════════════════════════════════
#  PROGRESSION & NOTES (Suivi Éléments)
# ═════════════════════════════════════════════

class UserLessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLessonProgress
        fields = ['id', 'lesson', 'is_completed', 'last_watched_position', 'updated_at']
        read_only_fields = ['lesson']  # Injecté généralement par l'URL de la vue


class UserNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNote
        fields = ['id', 'lesson', 'content', 'video_timecode', 'created_at', 'updated_at']
        read_only_fields = ['lesson']


# ═════════════════════════════════════════════
#  QUIZ MANAGEMENT
# ═════════════════════════════════════════════

class QuizChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizChoice
        fields = ['id', 'text']  # Sécurité : masquage de 'is_correct'


class QuizQuestionSerializer(serializers.ModelSerializer):
    choices = QuizChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = QuizQuestion
        fields = ['id', 'text', 'choices', 'order']


class QuizSubmissionSerializer(serializers.Serializer):
    """Payload de validation pour la soumission d'un Quiz entier."""
    answers = serializers.DictField(
        child=serializers.IntegerField(),
        help_text="Format attendu : {'question_id': choice_id}"
    )


class UserQuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserQuizAttempt
        fields = ['id', 'lesson', 'score', 'passed', 'created_at']
        read_only_fields = ['lesson', 'score', 'passed']


# ═════════════════════════════════════════════
#  CODE INTERACTIF
# ═════════════════════════════════════════════

class UserCodeSubmissionSerializer(serializers.ModelSerializer):
    starter_code = serializers.CharField(source='lesson.starter_code', read_only=True)
    solution_code = serializers.CharField(source='lesson.solution_code', read_only=True)

    class Meta:
        model = UserCodeSubmission
        fields = ['id', 'lesson', 'code', 'last_result', 'starter_code', 'solution_code', 'updated_at']
        read_only_fields = ['lesson', 'last_result']


# ═════════════════════════════════════════════
#  PEER REVIEW & PROJECT SUBMISSION
# ═════════════════════════════════════════════

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.get_full_name', read_only=True)
    total_score = serializers.IntegerField(source='get_total_score', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'submission', 'reviewer_name', 'scores', 'total_score', 'feedback', 'review_type', 'created_at']
        read_only_fields = ['reviewer_name', 'total_score']

    def validate(self, data):
        # Récupération de la soumission (en création ou mise à jour partielle)
        submission = data.get('submission') or (self.instance.submission if self.instance else None)
        
        if not submission:
            raise serializers.ValidationError("La soumission de projet est requise.")
            
        submitted_scores = data.get('scores', self.instance.scores if self.instance else {})
        
        # Delegation propre de la validation de conformité à la méthode native du modèle
        is_valid, error_msg = submission.project.validate_submission_data(submitted_scores)
        if not is_valid:
            raise serializers.ValidationError({"scores": f"Grille d'évaluation invalide : {error_msg}"})
                
        return data


class ProjectSubmissionSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    certificate_id = serializers.SerializerMethodField()

    class Meta:
        model = ProjectSubmission
        fields = [
            'id', 'project', 'repo_url', 'code_content', 'status', 
            'submitted_at', 'reviews', 'final_grade', 'certificate_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'submitted_at', 'final_grade']

    def get_certificate_id(self, obj):
        if obj.status == 'approved' and obj.project.is_final:
            cert = Certificate.objects.filter(user=obj.user, course=obj.project.module.course).first()
            if cert:
                return cert.certificate_id
        return None


class ProjectPeerReviewSerializer(serializers.ModelSerializer):
    """Serializer plat dédié aux interfaces de modération et vues d'ensemble."""
    reviewer_name = serializers.CharField(source='reviewer.get_full_name', read_only=True)
    student_name = serializers.CharField(source='submission.user.get_full_name', read_only=True)
    project_title = serializers.CharField(source='submission.project.title', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'submission', 'project_title', 'student_name', 
            'reviewer', 'reviewer_name', 'scores', 'feedback', 
            'review_type', 'status', 'created_at'
        ]
        read_only_fields = ['reviewer_name', 'student_name', 'project_title']


# ═════════════════════════════════════════════
#  EXAMS, CERTIFICATES & GAMIFICATION
# ═════════════════════════════════════════════

class CertificationExamAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificationExamAttempt
        fields = ['id', 'exam', 'score', 'passed', 'started_at', 'completed_at']
        read_only_fields = ['score', 'passed']


class CertificateSerializer(serializers.ModelSerializer):
    target_name = serializers.SerializerMethodField()

    class Meta:
        model = Certificate
        fields = ['id', 'certificate_id', 'cert_type', 'target_name', 'final_score', 'issued_at', 'pdf_file']
        read_only_fields = ['certificate_id', 'issued_at', 'pdf_file']

    def get_target_name(self, obj):
        if obj.learning_path:
            return obj.learning_path.title
        if obj.course:
            return obj.course.title
        return "—"


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'type', 'title', 'content', 'link', 'is_read', 'created_at']
        read_only_fields = ['id', 'type', 'title', 'content', 'link', 'created_at']


class SkillBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillBadge
        fields = ['id', 'name', 'icon', 'badge_type', 'description']


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = SkillBadgeSerializer(read_only=True)
    
    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'granted_at']