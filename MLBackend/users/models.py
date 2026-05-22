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
    is_recruiter = models.BooleanField(
        default=False, verbose_name="Est recruteur"
    )
    is_mentor = models.BooleanField(
        default=False, verbose_name="Est mentor"
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

    # --- Gamification ---
    xp_points = models.IntegerField(
        default=0, verbose_name="Points d'expérience"
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


class StudentProfile(models.Model):
    """
    Profil détaillé de l'apprenant, rempli lors de l'onboarding.
    Contient les informations professionnelles, académiques et logistiques.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="student_profile")
    
    # --- Contact & Localisation ---
    phone = models.CharField(max_length=20, blank=True)
    gender = models.CharField(max_length=20, blank=True)
    address_street = models.CharField(max_length=255, blank=True)
    address_zip = models.CharField(max_length=20, blank=True)
    address_city = models.CharField(max_length=100, blank=True)
    address_country = models.CharField(max_length=100, default="Bénin")

    # --- Langues ---
    french_level = models.CharField(max_length=50, blank=True)
    english_level = models.CharField(max_length=50, blank=True)

    # --- Situation Professionnelle ---
    current_situation = models.CharField(max_length=100, blank=True)
    professional_experiences = models.JSONField(default=list, blank=True) # Liste d'objets {company, role, missions, duration}
    work_permits = models.JSONField(default=list, blank=True) # Liste de pays
    specific_statuses = models.JSONField(default=list, blank=True) # handicap, militaire, etc.

    # --- Diplômes & Certifications ---
    diplomas = models.JSONField(default=list, blank=True) # Liste d'objets {title, school, year}

    # --- Formation & Disponibilité ---
    hours_per_week = models.IntegerField(default=20)
    desired_start_date = models.DateField(null=True, blank=True)
    
    # --- État Onboarding ---
    onboarding_completed = models.BooleanField(default=False)
    honor_declaration_accepted = models.BooleanField(default=False)
    selected_training_slug = models.SlugField(max_length=100, blank=True)
    funding_method = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profil Apprenant de {self.user.email}"


class Notification(models.Model):
    """
    Système de notifications pour le dashboard (échéances, nouveaux cours, messages).
    """
    TYPE_CHOICES = [
        ('deadline', 'Échéance à venir'),
        ('grade', 'Nouvelle note'),
        ('message', 'Nouveau message'),
        ('system', 'Système / Plateforme'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='system')
    title = models.CharField(max_length=200)
    content = models.TextField()
    link = models.CharField(max_length=255, blank=True, null=True, help_text="Lien relatif (ex: /dashboard/grades)")
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        return f"[{self.type}] {self.title} pour {self.user.email}"


class Message(models.Model):
    """
    Messagerie interne entre étudiants et instructeurs.
    """
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_messages")
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_messages")
    subject = models.CharField(max_length=255)
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Message"
        verbose_name_plural = "Messages"

    def __str__(self):
        return f"De: {self.sender.email} À: {self.recipient.email} - {self.subject}"
 
