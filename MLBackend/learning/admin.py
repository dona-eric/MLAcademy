from django.contrib import admin
from .models import (
    Enrollment, PathEnrollment, UserLessonProgress, UserNote,
    QuizQuestion, QuizChoice, UserQuizAttempt, UserCodeSubmission,
    ProjectSubmission, Review, CertificationExamAttempt, Certificate
)

#  ENROLLMENT
@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'progress_percentage', 'is_completed', 'enrolled_at')
    list_filter = ('is_completed', 'course')
    search_fields = ('user__email', 'course__title')


@admin.register(PathEnrollment)
class PathEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'learning_path', 'progress_percentage', 'is_completed', 'is_certified', 'enrolled_at')
    list_filter = ('is_completed', 'is_certified', 'learning_path')
    search_fields = ('user__email', 'learning_path__title')


#  PROGRESSION & NOTES

@admin.register(UserLessonProgress)
class UserLessonProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'is_completed', 'last_watched_position', 'updated_at')
    list_filter = ('is_completed',)
    search_fields = ('user__username', 'lesson__title')


@admin.register(UserNote)
class UserNoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'video_timecode', 'created_at')
    search_fields = ('user__username', 'lesson__title', 'content')


#  QUIZ

class QuizChoiceInline(admin.TabularInline):
    model = QuizChoice
    extra = 3

@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ('lesson', 'text', 'order')
    list_filter = ('lesson',)
    search_fields = ('text', 'lesson__title')
    inlines = [QuizChoiceInline]


@admin.register(UserQuizAttempt)
class UserQuizAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'score', 'passed', 'created_at')
    list_filter = ('passed', 'created_at')
    search_fields = ('user__username', 'lesson__title')

#  CODE SUBMISSION

@admin.register(UserCodeSubmission)
class UserCodeSubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'updated_at')
    search_fields = ('user__username', 'lesson__title')


#  REVIEW

class ReviewInline(admin.TabularInline):
    model = Review
    extra = 1

@admin.register(ProjectSubmission)
class ProjectSubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'project', 'status', 'submitted_at')
    list_filter = ('status', 'project')
    search_fields = ('user__username', 'project__title')
    inlines = [ReviewInline]

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('reviewer', 'submission', 'review_type')
    list_filter = ('review_type',)


#  CERTIFICATION

@admin.register(CertificationExamAttempt)
class CertificationExamAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'exam', 'score', 'passed', 'started_at')
    list_filter = ('passed',)
    search_fields = ('user__email', 'exam__title')


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('certificate_id', 'user', 'cert_type', 'course', 'learning_path', 'final_score', 'issued_at')
    list_filter = ('cert_type',)
    search_fields = ('certificate_id', 'user__email')
