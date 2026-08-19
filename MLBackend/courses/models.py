from django.apps import apps
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """
    Thématique de cours (ex: Machine Learning, Data Engineering, NLP).
    """
    name = models.CharField(max_length=100, unique=True, verbose_name="Nom")
    slug = models.SlugField(max_length=220, unique=True, null=True, blank=True)
    icon = models.CharField(max_length=50, blank=True, verbose_name="Icône (emoji ou classe CSS)")
    description = models.TextField(blank=True, verbose_name="Description")

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            original_slug = slugify(self.name)
            slug = original_slug
            num = 1
            while Category.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{original_slug}-{num}"
                num += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# ═════════════════════════════════════════════
#  MODULE LIBRARY
# ═════════════════════════════════════════════

class Module(models.Model):
    """
    Unité thématique RÉUTILISABLE regroupant plusieurs leçons.
    """
    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=220, unique=True, null=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Description")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="modules", verbose_name="Catégorie",
        help_text="Catégorie thématique pour faciliter la recherche."
    )
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
        related_name="modules_authored", verbose_name="Auteur"
    )
    estimated_hours = models.DecimalField(
        max_digits=4, decimal_places=1, default=1.0,
        verbose_name="Durée estimée (heures)"
    )
    is_published = models.BooleanField(default=False, verbose_name="Publié")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Module"
        verbose_name_plural = "Modules"
        ordering = ["title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            original_slug = slugify(self.title)
            slug = original_slug
            num = 1
            while Module.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{original_slug}-{num}"
                num += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def usage_count(self):
        return self.course_modules.count()


class Lesson(models.Model):
    """
    Unité atomique d'apprentissage (vidéo + texte + exercice + quiz).
    """
    LESSON_TYPE_CHOICES = [
        ("video", "Vidéo"),
        ("text", "Texte / Lecture"),
        ("notebook", "Notebook Interactif"),
        ("quiz", "Quiz"),
        ("exercise", "Exercice de code"),
    ]

    module = models.ForeignKey(
        Module, on_delete=models.CASCADE, related_name="lessons",
        verbose_name="Module"
    )
    title = models.CharField(max_length=200, verbose_name="Titre")
    lesson_type = models.CharField(
        max_length=20, choices=LESSON_TYPE_CHOICES, default="video",
        verbose_name="Type de leçon"
    )
    content = models.TextField(blank=True, verbose_name="Contenu (Markdown)")
    video_url = models.URLField(blank=True, verbose_name="URL de la vidéo (Mux)")
    duration_minutes = models.PositiveIntegerField(
        default=0, verbose_name="Durée (minutes)"
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre")
    is_free_preview = models.BooleanField(
        default=False, verbose_name="Aperçu gratuit"
    )
    starter_code = models.TextField(blank=True, verbose_name="Code de démarrage")
    solution_code = models.TextField(blank=True, verbose_name="Solution (instructeur)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Leçon"
        verbose_name_plural = "Leçons"
        ordering = ["order"]

    def __str__(self):
        return f"[{self.module.title}] Leçon {self.order} — {self.title}"


class Project(models.Model):
    """
    Application pratique clôturant un module.
    """
    module = models.OneToOneField(
        Module, on_delete=models.CASCADE, related_name="project",
        verbose_name="Module"
    )
    title = models.CharField(max_length=200, verbose_name="Titre")
    description = models.TextField(verbose_name="Description")
    instructions = models.TextField(verbose_name="Instructions détaillées")
    starter_code = models.TextField(blank=True, verbose_name="Code de démarrage")
    solution_code = models.TextField(blank=True, verbose_name="Solution (instructeur)")
    is_final = models.BooleanField(
        default=False, verbose_name="Projet de fin de cours (Certifiant)"
    )
    is_capstone = models.BooleanField(
        default=False, verbose_name="Capstone (Projet certifiant du parcours)",
        help_text="Si True, la validation de ce projet peut déclencher la certification."
    )
    passing_score = models.PositiveIntegerField(
        default=80, verbose_name="Score minimum pour validation (%)",
        validators=[MinValueValidator(1), MaxValueValidator(100)]
    )
    required_review_count = models.PositiveIntegerField(
        default=2,
        verbose_name="Nombre de correcteurs requis",
        help_text="Nombre d'évaluations nécessaires avant la décision finale (pair review ou instructeur)."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Projet"
        verbose_name_plural = "Projets"

    def __str__(self):
        label = "Capstone" if self.is_capstone else "Projet"
        return f"{label} : {self.title}"


# ═════════════════════════════════════════════
#  LEARNING PATH (Parcours / Certification)
# ═════════════════════════════════════════════

class LearningPath(models.Model):
    """
    Parcours certifiant regroupant plusieurs cours ordonnés.
    """
    DIFFICULTY_CHOICES = [
        ("beginner", "Débutant"),
        ("intermediate", "Intermédiaire"),
        ("advanced", "Avancé"),
        ("professional", "Professionnel"),
    ]

    title = models.CharField(max_length=250, verbose_name="Titre du Parcours")
    slug = models.SlugField(max_length=220, unique=True, null=True, blank=True)
    short_description = models.CharField(max_length=400, verbose_name="Résumé court")
    description = models.TextField(verbose_name="Description complète")
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True,
        related_name="learning_paths", verbose_name="Catégorie"
    )
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
        related_name="paths_created", verbose_name="Créateur / Instructeur principal"
    )
    level = models.CharField(
        max_length=20, choices=DIFFICULTY_CHOICES, default="beginner",
        verbose_name="Niveau"
    )
    thumbnail = models.ImageField(
        upload_to="paths/thumbnails/", blank=True, null=True,
        verbose_name="Image de couverture"
    )
    estimated_weeks = models.PositiveIntegerField(
        default=12, verbose_name="Durée estimée (semaines)"
    )
    is_published = models.BooleanField(default=False, verbose_name="Publié")
    is_certifying = models.BooleanField(
        default=True, verbose_name="Parcours certifiant"
    )
    is_free = models.BooleanField(default=False, verbose_name="Accès libre")
    price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00,
        verbose_name="Prix (FCFA)"
    )
    enrolled_count = models.PositiveIntegerField(default=0, verbose_name="Nombre d'inscrits")
    avg_rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0.00, verbose_name="Note moyenne"
    )
    courses_count = models.PositiveIntegerField(default=0, verbose_name="Nombre de cours")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Parcours"
        verbose_name_plural = "Parcours"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            original_slug = slugify(self.title)
            slug = original_slug
            num = 1
            while LearningPath.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{original_slug}-{num}"
                num += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        cert = "🎓" if self.is_certifying else "📘"
        return f"{cert} {self.title}"

    def update_courses_count(self):
        self.courses_count = self.path_courses.count()
        self.save(update_fields=["courses_count"])


class LearningPathCourse(models.Model):
    """
    Table de jonction : associe un Cours à un Parcours (ordonné).
    """
    learning_path = models.ForeignKey(
        LearningPath, on_delete=models.CASCADE,
        related_name="path_courses", verbose_name="Parcours"
    )
    course = models.ForeignKey(
        'Course', on_delete=models.CASCADE,
        related_name="in_paths", verbose_name="Cours"
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre dans le parcours")
    is_required = models.BooleanField(
        default=True, verbose_name="Obligatoire",
        help_text="Si False, le cours est optionnel pour la certification."
    )

    class Meta:
        verbose_name = "Cours du Parcours"
        verbose_name_plural = "Cours du Parcours"
        ordering = ["order"]
        # 💡 Remplacement de unique_together obsolète par la nouvelle API de contraintes
        constraints = [
            models.UniqueConstraint(fields=['learning_path', 'course'], name='unique_path_course'),
            models.UniqueConstraint(fields=['learning_path', 'order'], name='unique_path_order_position')
        ]

    def __str__(self):
        req = "★" if self.is_required else "○"
        return f"{req} #{self.order} {self.course.title} → {self.learning_path.title}"


# ═════════════════════════════════════════════
#  COURSE (l'unité de base)
# ═════════════════════════════════════════════

class Course(models.Model):
    """
    Cours individuel. composé de Modules réutilisables.
    """
    LEVEL_CHOICES = [
        ("beginner", "Débutant"),
        ("intermediate", "Intermédiaire"),
        ("advanced", "Avancé"),
    ]

    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=220, unique=True, null=True, blank=True)
    short_description = models.CharField(max_length=300, verbose_name="Résumé court")
    description = models.TextField(verbose_name="Description complète")
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name="courses",
        verbose_name="Catégorie"
    )
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
        related_name="courses_taught", verbose_name="Instructeur"
    )
    level = models.CharField(
        max_length=20, choices=LEVEL_CHOICES, default="beginner",
        verbose_name="Niveau"
    )
    duration_hours = models.PositiveIntegerField(
        default=0, verbose_name="Durée estimée (heures)"
    )
    thumbnail = models.ImageField(
        upload_to="courses/thumbnails/", blank=True, null=True,
        verbose_name="Image de couverture"
    )
    preview_url = models.URLField(
        blank=True, verbose_name="URL d'aperçu gratuit (vidéo)"
    )
    prerequisites_text = models.TextField(
        blank=True, verbose_name="Prérequis (texte affiché)"
    )
    syllabus = models.TextField(blank=True, verbose_name="Syllabus")
    is_published = models.BooleanField(default=False, verbose_name="Publié")
    is_free = models.BooleanField(default=False, verbose_name="Cours gratuit")
    is_standalone = models.BooleanField(
        default=False, verbose_name="Cours autonome"
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00,
        verbose_name="Prix standalone (FCFA)"
    )
    avg_rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0.00, verbose_name="Note moyenne"
    )
    enrolled_count = models.PositiveIntegerField(default=0, verbose_name="Nombre d'inscrits")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Cours"
        verbose_name_plural = "Cours"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            original_slug = slugify(self.title)
            slug = original_slug
            num = 1
            while Course.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{original_slug}-{num}"
                num += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def check_prerequisites(self, user):
        """Vérifie si l'utilisateur a terminé les prérequis."""
        # 💡 Récupération dynamique du modèle pour éliminer l'import circulaire au niveau du fichier
        Enrollment = apps.get_model('learning', 'Enrollment')
        required = self.prerequisites_set.all()
        missing = []
        for prereq in required:
            enrollment = Enrollment.objects.filter(
                user=user, course=prereq.required_course, is_completed=True
            ).exists()
            if not enrollment:
                missing.append(prereq.required_course)
        return (len(missing) == 0, missing)

    def get_ordered_modules(self):
        return Module.objects.filter(
            course_modules__course=self
        ).order_by('course_modules__order')


class CourseModule(models.Model):
    """
    Table de jonction : associe un Module à un Cours.
    """
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE,
        related_name="course_modules", verbose_name="Cours"
    )
    module = models.ForeignKey(
        Module, on_delete=models.CASCADE,
        related_name="course_modules", verbose_name="Module"
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre dans le cours")

    class Meta:
        verbose_name = "Module du Cours"
        verbose_name_plural = "Modules du Cours"
        ordering = ["order"]
        #  Modernisation des contraintes
        constraints = [
            models.UniqueConstraint(fields=['course', 'module'], name='unique_course_module_link'),
            models.UniqueConstraint(fields=['course', 'order'], name='unique_course_module_position')
        ]

    def __str__(self):
        return f"#{self.order} {self.module.title} → {self.course.title}"


class CoursePrerequisite(models.Model):
    """
    Prérequis entre cours.
    """
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE,
        related_name="prerequisites_set", verbose_name="Cours"
    )
    required_course = models.ForeignKey(
        Course, on_delete=models.CASCADE,
        related_name="is_prerequisite_for", verbose_name="Prérequis"
    )

    class Meta:
        verbose_name = "Prérequis de Cours"
        verbose_name_plural = "Prérequis de Cours"
        constraints = [
            models.UniqueConstraint(fields=['course', 'required_course'], name='unique_course_prerequisite_link')
        ]

    def clean(self):
        # 💡 CORRECTION : Empêche qu'un cours soit le prérequis de lui-même
        if self.course == self.required_course:
            raise ValidationError("Un cours ne peut pas être son propre prérequis.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.required_course.title} → requis pour → {self.course.title}"


# ═════════════════════════════════════════════
#  CERTIFICATION EXAM
# ═════════════════════════════════════════════

class CertificationExam(models.Model):
    """
    Examen final d'un parcours certifiant.
    """
    learning_path = models.OneToOneField(
        LearningPath, on_delete=models.CASCADE,
        related_name="certification_exam", verbose_name="Parcours"
    )
    title = models.CharField(max_length=200, verbose_name="Titre de l'examen")
    instructions = models.TextField(verbose_name="Instructions & règles")
    duration_minutes = models.PositiveIntegerField(
        default=120, verbose_name="Durée (minutes)"
    )
    passing_score = models.PositiveIntegerField(
        default=70, verbose_name="Score minimum (%)",
        validators=[MinValueValidator(1), MaxValueValidator(100)]
    )
    max_attempts_per_week = models.PositiveIntegerField(
        default=1, verbose_name="Tentatives par semaine"
    )
    capstone_project = models.ForeignKey(
        Project, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="certification_exam",
        verbose_name="Projet Capstone (alternatif à l'examen)"
    )
    is_published = models.BooleanField(default=False, verbose_name="Publié")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Examen de Certification"
        verbose_name_plural = "Examens de Certification"

    def __str__(self):
        return f"Examen : {self.title} ({self.learning_path.title})"


# ═════════════════════════════════════════════
#  REVIEWS & RATING METRICS
# ═════════════════════════════════════════════

class CourseReview(models.Model):
    """
    Avis et notation d'un cours par un apprenant.
    """
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="reviews",
        verbose_name="Cours"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="reviews", verbose_name="Apprenant"
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Note (1-5)"
    )
    comment = models.TextField(blank=True, verbose_name="Commentaire")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Avis"
        verbose_name_plural = "Avis"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=['course', 'user'], name='unique_course_user_review_link')
        ]

    def __str__(self):
        return f"{self.user.email} — {self.course.title} ({self.rating}/5)"

    def update_course_avg_rating(self):
        """Recalcule et dénormalise la note moyenne du cours associé."""
        stats = CourseReview.objects.filter(course=self.course).aggregate(avg=models.Avg('rating'))
        self.course.avg_rating = stats['avg'] or 0.00
        self.course.save(update_fields=['avg_rating'])

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # 💡 CORRECTION : Met à jour la note moyenne du cours dès qu'un avis est créé ou modifié
        self.update_course_avg_rating()

    def delete(self, *args, **kwargs):
        course = self.course
        super().delete(*args, **kwargs)
        # 💡 CORRECTION : Met à jour la note moyenne du cours dès qu'un avis est supprimé
        stats = CourseReview.objects.filter(course=course).aggregate(avg=models.Avg('rating'))
        course.avg_rating = stats['avg'] or 0.00
        course.save(update_fields=['avg_rating'])