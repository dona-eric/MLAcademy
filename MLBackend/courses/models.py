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


#  LEARNING PATH (Parcours / Certification)

class LearningPath(models.Model):
    """
    Parcours certifiant regroupant plusieurs cours ordonnés.
    Ex: "Professional Machine Learning Engineer"
    C'est le conteneur de haut niveau que l'étudiant suit pour obtenir une certification.
    """
    DIFFICULTY_CHOICES = [
        ("beginner", "Débutant"),
        ("intermediate", "Intermédiaire"),
        ("advanced", "Avancé"),
        ("professional", "Professionnel"),
    ]

    title = models.CharField(max_length=250, verbose_name="Titre du Parcours")
    slug = models.SlugField(max_length=270, unique=True, blank=True)
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
        verbose_name="Prix (FCFA)", help_text="0 = gratuit. L'instructeur décide."
    )

    # Champs dénormalisés pour les performances
    enrolled_count = models.PositiveIntegerField(default=0, verbose_name="Nombre d'inscrits")
    avg_rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0.00,
        verbose_name="Note moyenne"
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
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        cert = "🎓" if self.is_certifying else "📘"
        return f"{cert} {self.title}"

    def update_courses_count(self):
        """Met à jour le nombre de cours dans le parcours."""
        self.courses_count = self.path_courses.count()
        self.save(update_fields=["courses_count"])


class LearningPathCourse(models.Model):
    """
    Table de jonction ordonnée : associe un Cours à un Parcours.
    Permet d'ordonner les cours dans le parcours et de les marquer comme obligatoires/optionnels.
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
        unique_together = [["learning_path", "course"], ["learning_path", "order"]]

    def __str__(self):
        req = "★" if self.is_required else "○"
        return f"{req} #{self.order} {self.course.title} → {self.learning_path.title}"


# ─────────────────────────────────────────────
#  COURSE (Cours — unité que l'étudiant rejoint)
# ─────────────────────────────────────────────

class Course(models.Model):
    """
    Cours individuel. Peut être standalone (ex: "Prompt Engineering") 
    ou partie d'un LearningPath (ex: "Python pour la Data Science" dans le parcours ML Engineer).
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
    prerequisites_text = models.TextField(
        blank=True, verbose_name="Prérequis (texte affiché)",
        help_text="Description textuelle des prérequis pour l'affichage. La logique métier utilise CoursePrerequisite."
    )
    syllabus = models.TextField(
        blank=True, verbose_name="Syllabus (plan du cours)"
    )
    is_published = models.BooleanField(default=False, verbose_name="Publié")
    is_free = models.BooleanField(default=False, verbose_name="Cours gratuit")
    is_standalone = models.BooleanField(
        default=False, verbose_name="Cours autonome",
        help_text="True = accessible en dehors d'un parcours."
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00,
        verbose_name="Prix standalone (FCFA)",
        help_text="Prix si le cours est acheté individuellement."
    )

    # Champs dénormalisés pour les performances
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
        verbose_name = "Cours"
        verbose_name_plural = "Cours"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def check_prerequisites(self, user):
        """
        Vérifie si l'utilisateur a terminé tous les prérequis de ce cours.
        Retourne (bool, list_of_missing_courses).
        """
        from learning.models import Enrollment
        required = self.prerequisites_set.all()
        missing = []
        for prereq in required:
            enrollment = Enrollment.objects.filter(
                user=user, course=prereq.required_course, is_completed=True
            ).first()
            if not enrollment:
                missing.append(prereq.required_course)
        return (len(missing) == 0, missing)


class CoursePrerequisite(models.Model):
    """
    Prérequis entre cours.
    "Pour accéder au Cours B, l'utilisateur doit avoir terminé le Cours A."
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
        unique_together = [["course", "required_course"]]

    def __str__(self):
        return f"{self.required_course.title} → requis pour → {self.course.title}"


#  MODULE & LESSON (Chapitres & Contenus atomiques)

class Module(models.Model):
    """
    Chapitre / unité thématique regroupant plusieurs leçons.
    """
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="modules",
        verbose_name="Cours"
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
    Application pratique clôturant chaque module.
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


#  CERTIFICATION EXAM (Examen final du parcours)

class CertificationExam(models.Model):
    """
    Examen final d'un parcours certifiant.
    Conditions strictes : durée limitée, tentatives limitées.
    L'étudiant doit avoir terminé tous les cours obligatoires du parcours pour y accéder.
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
    is_published = models.BooleanField(default=False, verbose_name="Publié")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Examen de Certification"
        verbose_name_plural = "Examens de Certification"

    def __str__(self):
        return f"🏆 Examen : {self.title} ({self.learning_path.title})"


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
        unique_together = [["course", "user"]]  # Un avis par utilisateur par cours
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} — {self.course.title} ({self.rating}/5)"
