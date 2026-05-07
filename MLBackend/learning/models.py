from django.conf import settings
from django.db import models
from courses.models import Lesson, Course


class Enrollment(models.Model):
    """Inscription d'un étudiant à un cours."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="enrollments", verbose_name="Étudiant"
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE,
        related_name="enrollments", verbose_name="Cours"
    )
    enrolled_at = models.DateTimeField(auto_now_add=True, verbose_name="Date d'inscription")
    progress_percentage = models.PositiveIntegerField(default=0, verbose_name="Progression (%)")
    is_completed = models.BooleanField(default=False, verbose_name="Cours terminé")
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name="Date de complétion")

    class Meta:
        verbose_name = "Inscription"
        verbose_name_plural = "Inscriptions"
        unique_together = [["user", "course"]]
        ordering = ["-enrolled_at"]

    def __str__(self):
        return f"{self.user.email} → {self.course.title} ({self.progress_percentage}%)"

    def update_progress(self):
        """Recalcule la progression en fonction des leçons terminées."""
        total = Lesson.objects.filter(module__course=self.course).count()
        if total == 0:
            return
        completed = UserLessonProgress.objects.filter(
            user=self.user,
            lesson__module__course=self.course,
            is_completed=True
        ).count()
        self.progress_percentage = int((completed / total) * 100)
        self.is_completed = self.progress_percentage == 100
        if self.is_completed and not self.completed_at:
            from django.utils import timezone
            self.completed_at = timezone.now()
        self.save(update_fields=["progress_percentage", "is_completed", "completed_at"])


class UserLessonProgress(models.Model):
    """F-05 : Suivi de progression pour une leçon."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="lesson_progress")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="user_progress")
    is_completed = models.BooleanField(default=False, verbose_name="Terminée")
    last_watched_position = models.PositiveIntegerField(default=0, verbose_name="Position vidéo (secondes)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Progression Leçon"
        verbose_name_plural = "Progressions Leçons"
        unique_together = [["user", "lesson"]]

    def __str__(self):
        return f"{self.user} - {self.lesson.title} ({'Terminée' if self.is_completed else 'En cours'})"


class UserNote(models.Model):
    """F-05 : Notes de cours synchronisées avec le timecode vidéo."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notes")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="notes")
    content = models.TextField(verbose_name="Contenu de la note")
    video_timecode = models.PositiveIntegerField(default=0, verbose_name="Timecode vidéo (secondes)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Note"
        verbose_name_plural = "Notes"
        ordering = ["lesson", "video_timecode"]

    def __str__(self):
        return f"Note de {self.user} sur {self.lesson.title} à {self.video_timecode}s"


class QuizQuestion(models.Model):
    """F-07 : Question d'un quiz associé à une leçon."""
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="quiz_questions")
    text = models.TextField(verbose_name="Intitulé de la question")
    explanation = models.TextField(blank=True, verbose_name="Explication (affichée après réponse)")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre")

    class Meta:
        verbose_name = "Question de Quiz"
        verbose_name_plural = "Questions de Quiz"
        ordering = ["order"]

    def __str__(self):
        return f"Q: {self.text[:50]}"


class QuizChoice(models.Model):
    """F-07 : Choix de réponse pour une question de quiz."""
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name="choices")
    text = models.CharField(max_length=255, verbose_name="Texte du choix")
    is_correct = models.BooleanField(default=False, verbose_name="Est la bonne réponse")

    class Meta:
        verbose_name = "Choix de Quiz"
        verbose_name_plural = "Choix de Quiz"

    def __str__(self):
        return f"{self.text} ({'Correct' if self.is_correct else 'Faux'})"


class UserQuizAttempt(models.Model):
    """F-07 : Tentative de quiz par un apprenant."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="quiz_attempts")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="quiz_attempts")
    score = models.PositiveIntegerField(verbose_name="Score obtenu (%)")
    passed = models.BooleanField(verbose_name="Réussi")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Tentative de Quiz"
        verbose_name_plural = "Tentatives de Quiz"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Tentative de {self.user} sur {self.lesson.title} - Score: {self.score}%"


class UserCodeSubmission(models.Model):
    """F-06 : Enregistrement du code soumis dans le notebook/éditeur."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="code_submissions")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="code_submissions")
    code = models.TextField(verbose_name="Code soumis")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Soumission de Code"
        verbose_name_plural = "Soumissions de Code"
        unique_together = [["user", "lesson"]]

    def __str__(self):
        return f"Code de {self.user} pour {self.lesson.title}"


# ─────────────────────────────────────────────
#  PEER REVIEW (F-06 / F-04)
# ─────────────────────────────────────────────
from courses.models import Project

class ProjectSubmission(models.Model):
    """Soumission d'un projet par un étudiant, prêt à être évalué."""
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('pending', 'En attente de correction'),
        ('approved', 'Validé'),
        ('rejected', 'Rejeté'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="project_submissions")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="submissions")
    repo_url = models.URLField(blank=True, verbose_name="URL du dépôt (ex: GitHub)")
    code_content = models.TextField(blank=True, verbose_name="Contenu du code soumis")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Statut")
    submitted_at = models.DateTimeField(null=True, blank=True, verbose_name="Date de soumission")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Soumission de Projet"
        verbose_name_plural = "Soumissions de Projets"
        # On peut soumettre plusieurs fois le même projet (par ex si rejeté), 
        # donc pas d'unique_together strict sans logique supplémentaire.

    def __str__(self):
        return f"Soumission de {self.user} pour {self.project.title} ({self.get_status_display()})"


class ProjectPeerReview(models.Model):
    """Évaluation d'une soumission par un pair."""
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews_given")
    submission = models.ForeignKey(ProjectSubmission, on_delete=models.CASCADE, related_name="peer_reviews")
    score = models.PositiveIntegerField(verbose_name="Note (sur 100)")
    feedback = models.TextField(verbose_name="Commentaires constructifs")
    is_approved = models.BooleanField(default=False, verbose_name="Projet validé")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Correction par les pairs"
        verbose_name_plural = "Corrections par les pairs"
        unique_together = [["reviewer", "submission"]]  # Un pair ne corrige qu'une fois une même soumission

    def __str__(self):
        return f"Évaluation de {self.reviewer} pour la soumission {self.submission.id}"


class Certificate(models.Model):
    """Certificat de complétion d'un cours (UE)."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="certificates")
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name="certificates")
    issued_at = models.DateTimeField(auto_now_add=True)
    certificate_id = models.CharField(max_length=100, unique=True, blank=True)
    final_score = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Certificat"
        verbose_name_plural = "Certificats"
        unique_together = [["user", "course"]]

    def save(self, *args, **kwargs):
        if not self.certificate_id:
            import uuid
            self.certificate_id = str(uuid.uuid4())[:12].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Certificat {self.certificate_id} - {self.user.email} - {self.course.title}"
