from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """
    Thématique de cours (ex: Machine Learning, Data Engineering, NLP).
    """
    name = models.CharField(max_length=100, unique=True, verbose_name="Nom")
    slug = models.SlugField(max_length=220, null=True, blank=True)
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


# ═════════════════════════════════════════════
#  MODULE LIBRARY (Bibliothèque de Modules réutilisables)
# ═════════════════════════════════════════════

class Module(models.Model):
    """
    Unité thématique RÉUTILISABLE regroupant plusieurs leçons.
    Un même module peut apparaître dans plusieurs cours.
    Ex: "Introduction à Python" utilisé dans "Data Scientist" ET "Développeur Web".
    
    Avantage : Si on met à jour une vidéo du module, elle se met à jour 
    dans TOUS les cours qui l'utilisent.
    """
    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=220, null=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Description")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="modules", verbose_name="Catégorie",
        help_text="Catégorie thématique pour faciliter la recherche dans la bibliothèque."
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
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def usage_count(self):
        """Nombre de cours utilisant ce module."""
        return self.course_modules.count()


class Lesson(models.Model):
    """
    Unité atomique d'apprentissage (vidéo + texte + exercice + quiz).
    Appartient à un Module (qui est réutilisable).
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
    Peut être un Capstone (projet certifiant) pour un parcours.
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
        validators=[MinValueValidator(1), MaxValueValidator(100)])
    required_review_count = models.PositiveIntegerField(
        default=1, help_text="Nombre de revues nécessaires pour finaliser"
    )
    rubric = models.ForeignKey(
        'Rubric', on_delete=models.SET_NULL, null=True, blank=True,
        related_name="projects", verbose_name="Grille d'évaluation"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now =  True)

    class Meta:
        verbose_name = "Projet"
        verbose_name_plural = "Projets"

    def __str__(self):
        label = "Capstone" if self.is_capstone else "Projet"
        return f"{label} : {self.title}"

    def validate_submission_data(self, scores_data):
        """Vérifie que les scores soumis correspondent aux critères de la rubric."""
        if not self.rubric:
            return (True, "")
        expected_keys = set(self.rubric.criteria_definition.keys())
        submitted_keys = set(scores_data.keys())
        if expected_keys != submitted_keys:
            missing = expected_keys - submitted_keys
            extra = submitted_keys - expected_keys
            return (False, f"Clés manquantes: {missing}, Clés inconnues: {extra}")
        return (True, "")


class Rubric(models.Model):
    """
    Grille d'évaluation dynamique pour les projets.
    Définit les critères de notation de manière dynamique.
    """
    title = models.CharField(max_length=200, verbose_name="Titre de la grille")
    criteria_definition = models.JSONField(
        default=dict,
        help_text='Ex: {"clarté": {"max_points": 3}, "technique": {"max_points": 2}}'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Grille d'évaluation"
        verbose_name_plural = "Grilles d'évaluation"

    def __str__(self):
        return self.title


class LessonAttachment(models.Model):
    """Pièce jointe associée à une leçon."""
    lesson = models.ForeignKey(
        Lesson, on_delete=models.CASCADE, related_name="attachments",
        verbose_name="Leçon"
    )
    title = models.CharField(max_length=200, verbose_name="Titre de la ressource")
    file = models.FileField(upload_to="lessons/attachments/", verbose_name="Fichier")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Pièce jointe"
        verbose_name_plural = "Pièces jointes"

    def __str__(self):
        return f"{self.title} ({self.lesson.title})"


#  LEARNING PATH (Parcours / Certification)

class LearningPath(models.Model):
    """
    Parcours certifiant regroupant plusieurs cours ordonnés.
    Ex: "Professional Machine Learning Engineer"
    """
    DIFFICULTY_CHOICES = [
        ("beginner", "Débutant"),
        ("intermediate", "Intermédiaire"),
        ("advanced", "Avancé"),
        ("professional", "Professionnel"),
    ]

    title = models.CharField(max_length=250, verbose_name="Titre du Parcours")
    slug = models.SlugField(max_length=220, null=True, blank=True)
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

    # Champs dénormalisés
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
            self.slug = slugify(self.title)
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
        unique_together = [["learning_path", "course"], ["learning_path", "order"]]

    def __str__(self):
        req = "★" if self.is_required else "○"
        return f"{req} #{self.order} {self.course.title} → {self.learning_path.title}"


#  COURSE (Cours — l'unité que l'étudiant rejoint)

class Course(models.Model):
    """
    Cours individuel. Utilise des Modules de la bibliothèque via CourseModule.
    Peut être standalone ou partie d'un LearningPath.
    """
    LEVEL_CHOICES = [
        ("beginner", "Débutant"),
        ("intermediate", "Intermédiaire"),
        ("advanced", "Avancé"),
    ]

    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=220, null=True, blank=True)
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
        help_text="Description textuelle. La logique métier utilise CoursePrerequisite."
    )
    syllabus = models.TextField(blank=True, verbose_name="Syllabus")
    is_published = models.BooleanField(default=False, verbose_name="Publié")
    is_free = models.BooleanField(default=False, verbose_name="Cours gratuit")
    is_standalone = models.BooleanField(
        default=False, verbose_name="Cours autonome",
        help_text="True = accessible en dehors d'un parcours."
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00,
        verbose_name="Prix standalone (FCFA)"
    )
    # Dénormalisés
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
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def check_prerequisites(self, user):
        """Vérifie si l'utilisateur a terminé les prérequis."""
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

    def get_ordered_modules(self):
        """Retourne les modules de ce cours dans l'ordre défini par CourseModule."""
        return Module.objects.filter(
            course_modules__course=self
        ).order_by('course_modules__order')


class CourseModule(models.Model):
    """
    Table de jonction : associe un Module (de la bibliothèque) à un Cours.
    Permet de RÉUTILISER un même module dans plusieurs cours.
    
    Ex: Le module "Introduction à Python" peut être dans :
    - Cours "Data Scientist" (order=1)
    - Cours "Développeur Web" (order=3)
    
    Si on met à jour une vidéo du module, elle se met à jour
    dans TOUS les cours qui l'utilisent.
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
        unique_together = [["course", "module"], ["course", "order"]]

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
        unique_together = [["course", "required_course"]]

    def __str__(self):
        return f"{self.required_course.title} → requis pour → {self.course.title}"


#  CERTIFICATION EXAM & CAPSTONE

class CertificationExam(models.Model):
    """
    Examen final d'un parcours certifiant.
    La certification N'EST PAS un simple PDF. C'est un objet de validation :
    - L'étudiant doit avoir terminé tous les cours obligatoires
    - Il doit atteindre un score minimum à cet examen OU valider le Capstone
    - Seulement alors le Certificate est créé.
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
    # Le Capstone comme alternative à l'examen QCM
    capstone_project = models.ForeignKey(
        Project, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="certification_exam",
        verbose_name="Projet Capstone (alternatif à l'examen)",
        help_text="Si défini, la validation de ce projet vaut aussi certification."
    )
    is_published = models.BooleanField(default=False, verbose_name="Publié")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Examen de Certification"
        verbose_name_plural = "Examens de Certification"

    def __str__(self):
        return f" Examen : {self.title} ({self.learning_path.title})"


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
        unique_together = [["course", "user"]]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} — {self.course.title} ({self.rating}/5)"
