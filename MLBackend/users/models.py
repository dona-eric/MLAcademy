import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.utils import timezone

class CustomUser(AbstractUser):
    """
    Modèle utilisateur étendu pour MLAcademy.
    Remplace le modèle User par défaut de Django.
    """

    # --- Champs d'identification ---
    email = models.EmailField(unique=True, verbose_name="Adresse email")

    # --- Vérification Email ---
    email_verified = models.BooleanField(
        default=False, verbose_name="Email vérifié"
    )
    verification_token = models.UUIDField(
        default=uuid.uuid4, editable=False, unique=True,
        verbose_name="Token de vérification"
    )

    otp_enabled = models.BooleanField(
        default=False, verbose_name="2FA activé"
    )
    is_instructor = models.BooleanField(
        default=False, verbose_name="Est instructeur"
    )

    # --- Profil ---
    bio = models.TextField(blank=True, verbose_name="Biographie")
    avatar = models.ImageField(
        upload_to="avatars/", blank=True, null=True, verbose_name="Photo de profil"
    )
    linkedin_url = models.URLField(blank=True, verbose_name="Profil LinkedIn")
    github_url = models.URLField(blank=True, verbose_name="Profil GitHub")
    portfolio_url = models.URLField(blank=True, verbose_name="Portfolio")

    LEVEL_CHOICES = [
        ("beginner", "Débutant"),
        ("intermediate", "Intermédiaire"),
        ("advanced", "Avancé"),
    ]
    level = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES,
        default="beginner",
        verbose_name="Niveau déclaré",
    )
    personal_goals = models.TextField(
        blank=True, verbose_name="Objectifs personnels"
    )
    is_public_profile = models.BooleanField(
        default=True, verbose_name="Profil public"
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
        ordering = ["-date_joined"]

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email


class InstructorApplication(models.Model):
    """Candidature pour devenir instructeur sur la plateforme."""

    STATUS_PENDING = "pending"
    STATUS_REVIEWING = "reviewing"
    STATUS_APPROVED = "approved"
    STATUS_REJECTED = "rejected"

    STATUS_CHOICES = [
        (STATUS_PENDING, "En attente"),
        (STATUS_REVIEWING, "En cours d'examen"),
        (STATUS_APPROVED, "Approuvé"),
        (STATUS_REJECTED, "Refusé"),
    ]

    EXPERTISE_CHOICES = [
        ("machine_learning",   "Machine Learning"),
        ("deep_learning",      "Deep Learning"),
        ("data_science",       "Data Science"),
        ("nlp",                "NLP / Traitement du langage"),
        ("computer_vision",    "Vision par ordinateur"),
        ("mlops",              "MLOps / Déploiement"),
        ("mathematics",        "Mathématiques pour le ML"),
        ("python",             "Python & Data Engineering"),
        ("other",              "Autre"),
    ]

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="instructor_application")
    cv_url = models.URLField(blank=True, verbose_name="Lien vers le CV (LinkedIn, Drive, etc.)")
    cv_file = models.FileField(upload_to="instructor_cvs/", blank=True, null=True, verbose_name="Fichier CV (PDF, Word)")
    linkedin_url = models.URLField(blank=True, verbose_name="Profil LinkedIn")
    portfolio_url = models.URLField(blank=True, verbose_name="Lien vers Portfolio/GitHub")
    website_url = models.URLField(blank=True, verbose_name="Site Web / Blog")
    motivation = models.TextField(verbose_name="Motivations pour devenir instructeur")
    expertise = models.CharField(max_length=50, choices=EXPERTISE_CHOICES, default='other')
    expertise_detail = models.TextField(
        blank=True,
        help_text="Décris ton expertise : années d'expérience, projets, publications…"
    )
    teaching_experience = models.TextField(
        blank=True,
        help_text="As-tu déjà enseigné ? Formations, tutos YouTube, articles…",
    )

    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    rejection_reason = models.TextField(blank=True, verbose_name="Motif du refus")
    
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_applications",
    )

    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    updated_at   = models.DateTimeField(auto_now=True)
    

    activation_token      = models.CharField(max_length=64, blank=True, unique=True, null=True)
    activation_token_sent = models.DateTimeField(null=True, blank=True)
    activation_expires_at = models.DateTimeField(null=True, blank=True)

    
    class Meta:
        verbose_name = "Candidature Instructeur"
        verbose_name_plural = "Candidatures Instructeurs"
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"Candidature de {self.user.email} ({self.get_status_display()})"


    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
 
    @property
    def is_pending(self):
        return self.status == self.STATUS_PENDING
 
    @property
    def is_approved(self):
        return self.status == self.STATUS_APPROVED
 
    def approve(self, reviewed_by):
        """Approuve la candidature et génère le token d'activation."""
        import secrets
        self.status  = self.STATUS_APPROVED
        self.reviewed_by = reviewed_by
        self.reviewed_at = timezone.now()
        # Token valable 7 jours pour que l'instructeur définisse son mdp
        self.activation_token = secrets.token_urlsafe(48)
        self.activation_token_sent = timezone.now()
        self.activation_expires_at = timezone.now() + timezone.timedelta(days=7)
        self.save(update_fields=[
            "status", "reviewed_by", "reviewed_at",
            "activation_token", "activation_token_sent", "activation_expires_at",
        ])
 
    def reject(self, reviewed_by, reason: str):
        """Refuse la candidature avec un motif obligatoire."""
        self.status = self.STATUS_REJECTED
        self.reviewed_by = reviewed_by
        self.reviewed_at = timezone.now()
        self.rejection_reason = reason
        self.save(update_fields=["status", "reviewed_by", "reviewed_at", "rejection_reason"])
 
    def mark_reviewing(self):
        self.status = self.STATUS_REVIEWING
        self.save(update_fields=["status"])
 
