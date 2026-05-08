from django.contrib import admin
from .models import (
    Category, LearningPath, LearningPathCourse, Course,
    CoursePrerequisite, Module, Lesson, Project,
    CertificationExam, CourseReview
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


# ─────────────────────────────────────────────
#  LEARNING PATH (Parcours)
# ─────────────────────────────────────────────

class LearningPathCourseInline(admin.TabularInline):
    model = LearningPathCourse
    extra = 1
    autocomplete_fields = ['course']
    ordering = ['order']


class CertificationExamInline(admin.StackedInline):
    model = CertificationExam
    extra = 0
    max_num = 1


@admin.register(LearningPath)
class LearningPathAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'level', 'is_published', 'is_certifying', 'is_free', 'price', 'courses_count', 'enrolled_count')
    list_filter = ('is_published', 'is_certifying', 'is_free', 'level', 'category')
    search_fields = ('title', 'short_description', 'description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [LearningPathCourseInline, CertificationExamInline]
    readonly_fields = ('enrolled_count', 'avg_rating', 'courses_count')


# ─────────────────────────────────────────────
#  COURSE
# ─────────────────────────────────────────────

class ModuleInline(admin.TabularInline):
    model = Module
    extra = 1


class CoursePrerequisiteInline(admin.TabularInline):
    model = CoursePrerequisite
    fk_name = 'course'
    extra = 0
    autocomplete_fields = ['required_course']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'instructor', 'level', 'is_published', 'is_free', 'is_standalone', 'price', 'avg_rating')
    list_filter = ('is_published', 'is_free', 'is_standalone', 'level', 'category')
    search_fields = ('title', 'short_description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [CoursePrerequisiteInline, ModuleInline]


# ─────────────────────────────────────────────
#  MODULE & LESSON
# ─────────────────────────────────────────────

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    list_filter = ('course',)
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'lesson_type', 'order', 'duration_minutes', 'is_free_preview')
    list_filter = ('lesson_type', 'is_free_preview', 'module__course')
    search_fields = ('title',)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'is_final')
    list_filter = ('is_final',)


@admin.register(CourseReview)
class CourseReviewAdmin(admin.ModelAdmin):
    list_display = ('course', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
