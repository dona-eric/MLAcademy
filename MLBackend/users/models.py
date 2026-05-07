import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


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

    # --- 2FA ---
    otp_enabled = models.BooleanField(
        default=False, verbose_name="2FA activé"
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
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvée'),
        ('rejected', 'Rejetée'),
    ]

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="instructor_application")
    cv_url = models.URLField(blank=True, verbose_name="Lien vers le CV (LinkedIn, Drive, etc.)")
    portfolio_url = models.URLField(blank=True, verbose_name="Lien vers Portfolio/GitHub")
    motivation = models.TextField(verbose_name="Motivations pour devenir instructeur")
    expertise_areas = models.CharField(max_length=255, verbose_name="Domaines d'expertise")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Candidature Instructeur"
        verbose_name_plural = "Candidatures Instructeurs"
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"Candidature de {self.user.email} ({self.get_status_display()})"
