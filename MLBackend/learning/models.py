from django.conf import settings
from django.db import models
from courses.models import Lesson, Course, LearningPath, LearningPathCourse, CertificationExam


# 
#  ENROLLMENT (Inscription à un Cours)
# ─────────────────────────────────────────────

class Enrollment(models.Model):
    """Inscription d'un étudiant à un cours individuel."""
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
        verbose_name = "Inscription Cours"
        verbose_name_plural = "Inscriptions Cours"
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

        # Si le cours est dans un parcours, mettre à jour la progression du parcours
        path_courses = LearningPathCourse.objects.filter(course=self.course)
        for pc in path_courses:
            path_enrollment = PathEnrollment.objects.filter(
                user=self.user, learning_path=pc.learning_path
            ).first()
            if path_enrollment:
                path_enrollment.update_progress()


# ─────────────────────────────────────────────
#  PATH ENROLLMENT (Inscription à un Parcours)
# ─────────────────────────────────────────────

class PathEnrollment(models.Model):
    """
    Inscription d'un étudiant à un parcours complet (certification).
    Gère la progression globale à travers tous les cours du parcours.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="path_enrollments", verbose_name="Étudiant"
    )
    learning_path = models.ForeignKey(
        LearningPath, on_delete=models.CASCADE,
        related_name="enrollments", verbose_name="Parcours"
    )
    enrolled_at = models.DateTimeField(auto_now_add=True, verbose_name="Date d'inscription")
    progress_percentage = models.PositiveIntegerField(default=0, verbose_name="Progression (%)")
    is_completed = models.BooleanField(default=False, verbose_name="Parcours terminé")
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name="Date de complétion")
    is_certified = models.BooleanField(default=False, verbose_name="Certifié")

    class Meta:
        verbose_name = "Inscription Parcours"
        verbose_name_plural = "Inscriptions Parcours"
        unique_together = [["user", "learning_path"]]
        ordering = ["-enrolled_at"]

    def __str__(self):
        status = "🎓 Certifié" if self.is_certified else f"{self.progress_percentage}%"
        return f"{self.user.email} → {self.learning_path.title} ({status})"

    def update_progress(self):
        """
        Recalcule la progression basée sur les cours OBLIGATOIRES terminés.
        """
        required_courses = LearningPathCourse.objects.filter(
            learning_path=self.learning_path, is_required=True
        )
        total = required_courses.count()
        if total == 0:
            return
        completed = Enrollment.objects.filter(
            user=self.user,
            course__in=required_courses.values('course'),
            is_completed=True
        ).count()
        self.progress_percentage = int((completed / total) * 100)
        self.is_completed = self.progress_percentage == 100
        if self.is_completed and not self.completed_at:
            from django.utils import timezone
            self.completed_at = timezone.now()
        self.save(update_fields=["progress_percentage", "is_completed", "completed_at"])

    def can_take_certification_exam(self):
        """
        Vérifie si l'étudiant peut passer l'examen de certification.
        Tous les cours obligatoires doivent être terminés.
        """
        required_courses = LearningPathCourse.objects.filter(
            learning_path=self.learning_path, is_required=True
        )
        for pc in required_courses:
            enrollment = Enrollment.objects.filter(
                user=self.user, course=pc.course, is_completed=True
            ).first()
            if not enrollment:
                return False
        return True

    def auto_enroll_courses(self):
        """
        Inscrit automatiquement l'étudiant à tous les cours du parcours.
        """
        path_courses = LearningPathCourse.objects.filter(
            learning_path=self.learning_path
        ).select_related('course')
        for pc in path_courses:
            Enrollment.objects.get_or_create(
                user=self.user, course=pc.course
            )


# ─────────────────────────────────────────────
#  LESSON PROGRESS & NOTES (F-05)
# ─────────────────────────────────────────────

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


# ─────────────────────────────────────────────
#  QUIZ (F-07)
# ─────────────────────────────────────────────

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


#  CODE SUBMISSION (F-06)

class UserCodeSubmission(models.Model):
    """F-06 : Enregistrement du code soumis dans le notebook/éditeur."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="code_submissions")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="code_submissions")
    code = models.TextField(verbose_name="Code soumis")
    last_result = models.JSONField(null=True, blank=True, verbose_name="Dernier résultat d'exécution")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Soumission de Code"
        verbose_name_plural = "Soumissions de Code"
        unique_together = [["user", "lesson"]]

    def __str__(self):
        return f"Code de {self.user} pour {self.lesson.title}"


#  PEER REVIEW (F-04)

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
        unique_together = [["reviewer", "submission"]]

    def __str__(self):
        return f"Évaluation de {self.reviewer} pour la soumission {self.submission.id}"


#  CERTIFICATION (Exam Attempts & Certificates)

class CertificationExamAttempt(models.Model):
    """Tentative d'examen de certification."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="exam_attempts"
    )
    exam = models.ForeignKey(
        CertificationExam, on_delete=models.CASCADE,
        related_name="attempts"
    )
    score = models.PositiveIntegerField(verbose_name="Score obtenu (%)")
    passed = models.BooleanField(verbose_name="Réussi")
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Tentative d'Examen"
        verbose_name_plural = "Tentatives d'Examen"
        ordering = ["-started_at"]

    def __str__(self):
        status = "✅ Réussi" if self.passed else "❌ Échoué"
        return f"{self.user.email} - {self.exam.title} ({self.score}%) {status}"


class Certificate(models.Model):
    """
    Certificat délivré à un étudiant.
    Peut être :
    - Un certificat de suivi de cours (attestation) → course renseigné
    - Un certificat de parcours certifiant (certification pro) → learning_path renseigné
    """
    CERT_TYPE_CHOICES = [
        ('course_completion', "Attestation de suivi de cours"),
        ('path_certification', "Certification professionnelle"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="certificates"
    )
    course = models.ForeignKey(
        'courses.Course', on_delete=models.CASCADE,
        related_name="certificates", null=True, blank=True,
        verbose_name="Cours (si attestation)"
    )
    learning_path = models.ForeignKey(
        LearningPath, on_delete=models.CASCADE,
        related_name="certificates", null=True, blank=True,
        verbose_name="Parcours (si certification)"
    )
    cert_type = models.CharField(
        max_length=25, choices=CERT_TYPE_CHOICES,
        default='course_completion', verbose_name="Type"
    )
    issued_at = models.DateTimeField(auto_now_add=True)
    certificate_id = models.CharField(max_length=100, unique=True, blank=True)
    final_score = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Certificat"
        verbose_name_plural = "Certificats"

    def save(self, *args, **kwargs):
        if not self.certificate_id:
            import uuid
            prefix = "CERT" if self.cert_type == "path_certification" else "ATT"
            self.certificate_id = f"{prefix}-{str(uuid.uuid4())[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        target = self.learning_path.title if self.learning_path else self.course.title
        return f"{self.get_cert_type_display()} {self.certificate_id} - {self.user.email} - {target}"
