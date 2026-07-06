from django.contrib import admin
from .models import (
    Category, LearningPath, LearningPathCourse, Course, CourseModule,
    CoursePrerequisite, Module, Lesson, Project,
    CertificationExam, CourseReview
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    ordering = ['order']


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'estimated_hours', 'is_published', 'get_usage_count')
    list_filter = ('is_published', 'category')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    # 💡 OPTIMISATION : Évite le N+1 lors du rendu de la liste des modules
    list_select_related = ('category', 'author')
    inlines = [LessonInline]

    def get_usage_count(self, obj):
        # Utilisation de la property native définie dans le modèle
        return obj.usage_count
    get_usage_count.short_description = "Utilisé dans (Cours)"


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'lesson_type', 'order', 'duration_minutes', 'is_free_preview')
    list_filter = ('lesson_type', 'is_free_preview')
    search_fields = ('title', 'module__title')
    list_select_related = ('module',)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'is_final', 'is_capstone', 'passing_score')
    list_filter = ('is_final', 'is_capstone')
    search_fields = ('title', 'module__title')
    list_select_related = ('module',)


# ─────────────────────────────────────────────
#  LEARNING PATH CONFIGURATION
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
    list_select_related = ('category', 'creator')
    inlines = [LearningPathCourseInline, CertificationExamInline]
    # 💡 SÉCURITÉ : Protection des champs calculés automatiquement
    readonly_fields = ('enrolled_count', 'avg_rating', 'courses_count')


# ─────────────────────────────────────────────
#  COURSE CONFIGURATION
# ─────────────────────────────────────────────

class CourseModuleInline(admin.TabularInline):
    model = CourseModule
    extra = 1
    autocomplete_fields = ['module']
    ordering = ['order']


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
    list_select_related = ('category', 'instructor')
    inlines = [CourseModuleInline, CoursePrerequisiteInline]
    # 💡 SÉCURITÉ : Verrouillage des métriques pour empêcher l'altération humaine
    readonly_fields = ('enrolled_count', 'avg_rating')


@admin.register(CourseReview)
class CourseReviewAdmin(admin.ModelAdmin):
    list_display = ('course', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('course__title', 'user__email', 'user__first_name', 'user__last_name')
    list_select_related = ('course', 'user')