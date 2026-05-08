from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """
    Thématique de cours (ex: Machine Learning, Data Engineering, NLP).
    """
    name = models.CharField(max_length=100, unique=True, verbose_name="Nom")
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    icon = models.CharField(max_length=50, blank=True, verbose_name="Icône (emoji ou classe CSS)")
    description = models.TextField(blank=True, verbose_name="Description")

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Course(models.Model):
    """
    Ex : "Parcours Data Science Complet".
    """
    LEVEL_CHOICES = [
        ("beginner", "Débutant"),
        ("intermediate", "Intermédiaire"),
        ("advanced", "Avancé"),
    ]

    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=220, unique=True, blank=True)
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
    prerequisites = models.TextField(
        blank=True, verbose_name="Prérequis"
    )
    syllabus = models.TextField(
        blank=True, verbose_name="Syllabus (plan du cours)"
    )
    is_published = models.BooleanField(default=False, verbose_name="Publié")
    is_free = models.BooleanField(default=False, verbose_name="Cours gratuit")

    # Champs calculés / dénormalisés pour les performances
    avg_rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0.00,
        verbose_name="Note moyenne"
    )
    enrolled_count = models.PositiveIntegerField(
        default=0, verbose_name="Nombre d'inscrits"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Parcours"
        verbose_name_plural = "Parcours"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Module(models.Model):
    """
     unité thématique regroupant plusieurs leçons.
    """
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="modules",
        verbose_name="Parcours"
    )
    title = models.CharField(max_length=200, verbose_name="Titre")
    description = models.TextField(blank=True, verbose_name="Description")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Module"
        verbose_name_plural = "Modules"
        ordering = ["order"]
        unique_together = [["course", "order"]]

    def __str__(self):
        return f"[{self.course.title}] Module {self.order} — {self.title}"


class Lesson(models.Model):
    """
     unité atomique (vidéo + texte + exercice + quiz).
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
    application pratique clôturant chaque module.
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
    is_final = models.BooleanField(default=False, verbose_name="Projet de fin de cours (Certifiant)")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Projet"
        verbose_name_plural = "Projets"

    def __str__(self):
        return f"Projet : {self.title}"


class CourseReview(models.Model):
    """
        0Avis et notation d'un cours par un apprenant.
    """
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="reviews",
        verbose_name="Parcours"
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
        unique_together = [["course", "user"]]  # Un avis par utilisateur par cours
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} — {self.course.title} ({self.rating}/5)"
