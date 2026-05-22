from django.conf import settings
from django.db import models
from courses.models import Lesson, LearningPathCourse, LearningPath


#  ENROLLMENT (Inscription à un Cours)

class Enrollment(models.Model):
    """Inscription d'un étudiant à un cours individuel."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
    related_name="enrollments", verbose_name="Étudiant")

    course = models.ForeignKey(
        "courses.Course", on_delete=models.CASCADE,
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
        """
        Recalcule la progression.
        Un cours est 'is_completed' si :
        1. 100% des leçons sont terminées.
        2. TOUS les projets (mini-projets) du cours sont 'approved'.
        """
        total_lessons = Lesson.objects.filter(module__course=self.course).count()
        if total_lessons == 0:
            return

        completed_lessons = UserLessonProgress.objects.filter(
            user=self.user,
            lesson__module__course=self.course,
            is_completed=True
        ).count()

        # Progression basée sur les leçons
        self.progress_percentage = int((completed_lessons / total_lessons) * 100)

        # Vérification des projets du cours
        course_projects = Project.objects.filter(module__course=self.course)
        projects_count = course_projects.count()
        approved_projects = ProjectSubmission.objects.filter(
            user=self.user,
            project__in=course_projects,
            status='approved'
        ).count()

        all_projects_done = (projects_count == approved_projects)
        
        # Le cours est terminé seulement si leçons à 100% ET projets validés
        was_completed = self.is_completed
        self.is_completed = (self.progress_percentage == 100) and all_projects_done

        if self.is_completed and not was_completed:
            from django.utils import timezone
            self.completed_at = timezone.now()
            # On pourrait auto-générer l'attestation ici si besoin
            
        self.save(update_fields=["progress_percentage", "is_completed", "completed_at"])

        # Update parent path progress
        path_courses = LearningPathCourse.objects.filter(course=self.course)
        for pc in path_courses:
            path_enr = PathEnrollment.objects.filter(user=self.user, learning_path=pc.learning_path).first()
            if path_enr:
                path_enr.update_progress()


#  PATH ENROLLMENT (Inscription à un Parcours)

class PathEnrollment(models.Model):
    """
    Inscription d'un étudiant à un parcours complet (certification).
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="path_enrollments")
    learning_path = models.ForeignKey("courses.LearningPath", on_delete=models.CASCADE, related_name="enrollments")
    enrolled_at = models.DateTimeField(auto_now_add=True)
    progress_percentage = models.PositiveIntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_certified = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Inscription Parcours"
        verbose_name_plural = "Inscriptions Parcours"
        unique_together = [["user", "learning_path"]]

    def update_progress(self):
        """
        Progression globale : ratio des cours OBLIGATOIRES terminés.
        """
        required_lp_courses = LearningPathCourse.objects.filter(
            learning_path=self.learning_path, is_required=True
        )
        total = required_lp_courses.count()
        if total == 0: return

        completed = Enrollment.objects.filter(
            user=self.user,
            course__in=required_lp_courses.values('course'),
            is_completed=True
        ).count()

        self.progress_percentage = int((completed / total) * 100)
        self.is_completed = (self.progress_percentage == 100)
        
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


#   LESSON PROGRESS & NOTES (F-05)


class UserLessonProgress(models.Model):
    """F-05 : Suivi de progression pour une leçon."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="lesson_progress")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="user_progress")
    is_completed = models.BooleanField(default=False, verbose_name="Terminée")
    last_watched_position = models.PositiveIntegerField(default=0, verbose_name="Position vidéo (secondes)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_featured_in_portfolio = models.BooleanField(default=False, verbose_name="Afficher dans le portfolio public")

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
    is_featured_in_portfolio = models.BooleanField(default=False, verbose_name="Afficher dans le portfolio public")

    class Meta:
        verbose_name = "Note"
        verbose_name_plural = "Notes"
        ordering = ["lesson", "video_timecode"]

    def __str__(self):
        return f"Note de {self.user} sur {self.lesson.title} à {self.video_timecode}s"


#  QUIZ (F-07)

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
    """Tentative de quiz par un apprenant."""
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
    is_featured_in_portfolio = models.BooleanField(default=False, verbose_name="Afficher dans le portfolio public")

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
        ('in_review', 'En cours d\'évaluation'),
        ('graded', 'Noté'),
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
    is_featured_in_portfolio = models.BooleanField(default=False, verbose_name="Afficher dans le portfolio public")

    class Meta:
        verbose_name = "Soumission de Projet"
        verbose_name_plural = "Soumissions de Projets"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        old_status = None
        if not is_new:
            try:
                old_status = ProjectSubmission.objects.get(pk=self.pk).status
            except ProjectSubmission.DoesNotExist:
                pass
            
        super().save(*args, **kwargs)
        
        # Trigger progression update when a project is approved
        if self.status == 'approved' and old_status != 'approved':
            self._update_enrollment_progress()
            self.trigger_certification_success()

    def _update_enrollment_progress(self):
        """Met à jour la progression de l'enrollment."""
        enrollments = Enrollment.objects.filter(
            user=self.user, 
            course__course_modules__module=self.project.module
        )
        for enr in enrollments:
            enr.update_progress()

    def check_and_finalize(self):
        """
        Vérifie si le projet doit passer en statut 'graded'.
        Appelé automatiquement par le signal post_save sur Review.
        """
        if self.status not in ['pending', 'in_review']:
            return False

        required = self.project.required_review_count
        completed_count = self.reviews.filter(status='completed').count()

        if completed_count < required:
            # Pas encore assez de reviews, mais au moins 1 → in_review
            if completed_count > 0 and self.status == 'pending':
                self.status = 'in_review'
                self.save(update_fields=['status'])
            return False

        # Quota atteint → évaluation finale
        grade = self.final_grade
        self.status = 'graded'

        if grade >= self.project.passing_score:
            self.status = 'approved'
        else:
            self.status = 'rejected'
            
        self.save(update_fields=['status'])
        
        if self.status == 'rejected':
            self.trigger_certification_failure()
            
        return True

    def trigger_certification_success(self):
        """Déclenche la certification lors de la réussite."""
        # Certificat de cours (projet final)
        if self.project.is_final:
            Certificate.objects.get_or_create(
                user=self.user,
                course=self.project.module.course,
                defaults={
                    'cert_type': 'course_completion',
                    'final_score': int(self.final_grade)
                }
            )

        # Certificat de parcours (capstone)
        if self.project.is_capstone:
            from courses.models import CertificationExam
            exams = CertificationExam.objects.filter(capstone_project=self.project)
            for exam in exams:
                path_enr = PathEnrollment.objects.filter(
                    user=self.user, 
                    learning_path=exam.learning_path
                ).first()
                if path_enr:
                    path_enr.is_certified = True
                    path_enr.save(update_fields=['is_certified'])
                    
                    Certificate.objects.get_or_create(
                        user=self.user,
                        learning_path=exam.learning_path,
                        defaults={
                            'cert_type': 'path_certification',
                            'final_score': int(self.final_grade)
                        }
                    )
                    
        # Envoi de l'e-mail de succès (Asynchrone)
        from .tasks import send_certification_success_email
        send_certification_success_email.delay(
            user_email=self.user.email,
            student_name=self.user.get_full_name() or self.user.username,
            project_title=self.project.title,
            final_score=int(self.final_grade),
            linkedin_url="https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME",
            certificate_url="http://localhost:3000/dashboard/certifications"
        )

    def trigger_certification_failure(self):
        """Actions lors de l'échec (notification d'encouragement)."""
        from users.models import Notification
        Notification.objects.create(
            user=self.user,
            type='grade',
            title=f"Projet à améliorer : {self.project.title}",
            content=(
                f"Votre projet nécessite des ajustements pour atteindre le niveau requis "
                f"({self.project.passing_score}%). Score actuel : {self.final_grade:.0f}%. "
                f"Consultez les retours de vos évaluateurs et soumettez une nouvelle version."
            ),
            link="/dashboard/grades"
        )
        
        # Envoi de l'e-mail d'encouragement (Growth Mindset)
        from .tasks import send_growth_mindset_email
        send_growth_mindset_email.delay(
            user_email=self.user.email,
            student_name=self.user.get_full_name() or self.user.username,
            project_title=self.project.title,
            review_url="http://localhost:3000/dashboard/grades"
        )

    @property
    def final_grade(self):
        reviews = self.reviews.filter(status='completed')
        if not reviews.exists():
            return 0.0
        total = sum(r.get_total_score() for r in reviews)
        return total / reviews.count()

    def __str__(self):
        return f"Soumission de {self.user} pour {self.project.title} ({self.get_status_display()})"


from django.core.exceptions import ValidationError

class Review(models.Model):
    """Évaluation d'une soumission par un pair ou un instructeur."""
    REVIEW_TYPES = (
        ('instructor', 'Instructeur'),
        ('peer', 'Pair')
    )
    STATUS_CHOICES = (
        ('assigned', 'Assigné'),
        ('completed', 'Terminé')
    )

    submission = models.ForeignKey(ProjectSubmission, on_delete=models.CASCADE, related_name="reviews")
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews_given")
    scores = models.JSONField(default=dict, verbose_name="Scores par critère")
    feedback = models.TextField(verbose_name="Commentaires constructifs", blank=True)
    review_type = models.CharField(max_length=20, choices=REVIEW_TYPES, default='peer')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Évaluation"
        verbose_name_plural = "Évaluations"

    def clean(self):
        # Verrou anti-retardataire
        if self.submission.status in ['approved', 'rejected', 'graded']:
            raise ValidationError(
                "Cette soumission a déjà été finalisée. Aucune évaluation supplémentaire n'est acceptée."
            )
        
        if self.reviewer == self.submission.user:
            raise ValidationError("Un étudiant ne peut pas valider sa propre soumission.")
        
        # Verify JSON keys against Project Rubric
        is_valid, error_msg = self.submission.project.validate_submission_data(self.scores)
        if not is_valid:
            raise ValidationError(f"Les critères de la grille ne correspondent pas: {error_msg}")

    def save(self, *args, **kwargs):
        if self.status == 'completed':
            self.clean()
        super().save(*args, **kwargs)

    def get_total_score(self):
        if self.status != 'completed':
            return 0
        return sum(self.scores.values()) if self.scores else 0

    def __str__(self):
        return f"Évaluation ({self.get_review_type_display()}) de {self.reviewer} pour la soumission {self.submission.id}"


#  CERTIFICATION (Exam Attempts & Certificates)

class CertificationExamAttempt(models.Model):
    """Tentative d'examen de certification."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="exam_attempts"
    )
    exam = models.ForeignKey(
        "courses.CertificationExam", on_delete=models.CASCADE,
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

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new and self.passed:
            # Update PathEnrollment
            path_enr = PathEnrollment.objects.filter(
                user=self.user, 
                learning_path=self.exam.learning_path
            ).first()
            if path_enr:
                path_enr.is_certified = True
                path_enr.save(update_fields=['is_certified'])
                
                # Auto-generate Certificate
                Certificate.objects.get_or_create(
                    user=self.user,
                    learning_path=self.exam.learning_path,
                    defaults={
                        'cert_type': 'path_certification',
                        'final_score': self.score
                    }
                )

    def __str__(self):
        status = " Réussi" if self.passed else " Échoué"
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
    pdf_file = models.FileField(upload_to="certificates/", null=True, blank=True, verbose_name="Fichier PDF")

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

class SkillBadge(models.Model):
    """
    Badge de compétence technique validé.
    """
    BADGE_TYPES = [
        ('technical', 'Compétence Technique'),
        ('soft_skill', 'Soft Skill / Leadership'),
        ('contribution', 'Contribution Communautaire'),
    ]

    name = models.CharField(max_length=100, verbose_name="Nom de la compétence")
    icon = models.CharField(max_length=50, default="award", verbose_name="Icône Lucide")
    badge_type = models.CharField(max_length=20, choices=BADGE_TYPES, default='technical')
    description = models.TextField(blank=True)
    
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="badges", through='UserBadge', through_fields=('badge', 'user'))

    def __str__(self):
        return f"{self.name} ({self.get_badge_type_display()})"

class UserBadge(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    badge = models.ForeignKey(SkillBadge, on_delete=models.CASCADE)
    granted_at = models.DateTimeField(auto_now_add=True)
    granted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="badges_granted")

    class Meta:
        unique_together = [['user', 'badge']]
