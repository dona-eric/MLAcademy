from django.contrib import admin
from .models import (
    UserLessonProgress, UserNote, QuizQuestion, QuizChoice,
    UserQuizAttempt, UserCodeSubmission, ProjectSubmission, ProjectPeerReview
)


@admin.register(UserLessonProgress)
class UserLessonProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'is_completed', 'last_watched_position', 'updated_at')
    list_filter = ('is_completed',)
    search_fields = ('user__username', 'lesson__title')


@admin.register(UserNote)
class UserNoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'video_timecode', 'created_at')
    search_fields = ('user__username', 'lesson__title', 'content')


class QuizChoiceInline(admin.TabularInline):
    model = QuizChoice
    extra = 2


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


@admin.register(UserCodeSubmission)
class UserCodeSubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'updated_at')
    search_fields = ('user__username', 'lesson__title')


class ProjectPeerReviewInline(admin.TabularInline):
    model = ProjectPeerReview
    extra = 1

@admin.register(ProjectSubmission)
class ProjectSubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'project', 'status', 'submitted_at')
    list_filter = ('status', 'project')
    search_fields = ('user__username', 'project__title')
    inlines = [ProjectPeerReviewInline]

@admin.register(ProjectPeerReview)
class ProjectPeerReviewAdmin(admin.ModelAdmin):
    list_display = ('reviewer', 'submission', 'score', 'is_approved')
    list_filter = ('is_approved',)

