from django.db import models
from django.conf import settings
from django.utils import timezone

class Category(models.Model):
    """
    Catégorie regroupant plusieurs canaux (ex: TECH, CARRIÈRE, LOUNGE).
    """
    name = models.CharField(max_length=100, verbose_name="Nom de la catégorie")
    order = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['order']

    def __str__(self):
        return self.name

class Company(models.Model):
    """
    Représente une entreprise ou un employeur sur la plateforme.
    """
    name = models.CharField(max_length=255, verbose_name="Nom de l'entreprise")
    description = models.TextField(verbose_name="Présentation")
    website = models.URLField(blank=True, verbose_name="Site web")
    logo = models.ImageField(upload_to="companies/", blank=True, null=True)
    location = models.CharField(max_length=255, verbose_name="Siège social")
    
    admins = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="managed_companies", verbose_name="Administrateurs")
    
    is_verified = models.BooleanField(default=False, verbose_name="Vérifiée par MLAcademy")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class JobOffer(models.Model):
    """
    Offre d'emploi ou stage postée par une entreprise.
    """
    CONTRACT_TYPES = [
        ('CDI', 'Contrat à Durée Indéterminée'),
        ('CDD', 'Contrat à Durée Déterminée'),
        ('STAGE', 'Stage'),
        ('FREELANCE', 'Freelance'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="jobs")
    title = models.CharField(max_length=255, verbose_name="Intitulé du poste")
    description = models.TextField(verbose_name="Description du poste")
    requirements = models.TextField(verbose_name="Pré-requis / Compétences")
    
    location = models.CharField(max_length=255, verbose_name="Lieu")
    contract_type = models.CharField(max_length=20, choices=CONTRACT_TYPES, default='CDI')
    salary_range = models.CharField(max_length=100, blank=True, verbose_name="Fourchette de salaire")
    
    is_active = models.BooleanField(default=True)
    posted_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} @ {self.company.name}"

class JobApplication(models.Model):
    """
    Candidature d'un talent (étudiant) à une offre.
    """
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('reviewing', 'En cours de revue'),
        ('interview', 'Entretien'),
        ('accepted', 'Accepté'),
        ('rejected', 'Refusé'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="job_applications")
    job = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name="applications")
    
    cover_letter = models.TextField(verbose_name="Lettre de motivation")
    cv_url = models.URLField(blank=True, verbose_name="Lien vers CV mis à jour")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'job')

    def __str__(self):
        return f"{self.user.email} -> {self.job.title}"

class Channel(models.Model):
    """
    Canal de discussion par spécialité ou thématique.
    """
    CHANNEL_TYPES = [
        ('chat', 'Chat Classique'),
        ('forum', 'Espace Forum / Annonces'),
    ]

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="channels", null=True, blank=True)
    name = models.CharField(max_length=100, verbose_name="Nom du canal")
    description = models.TextField(blank=True)
    channel_type = models.CharField(max_length=20, choices=CHANNEL_TYPES, default='chat')
    icon = models.CharField(max_length=50, default="hash")
    
    order = models.IntegerField(default=0)
    is_private = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"# {self.name}"

class ChannelMessage(models.Model):
    """
    Message posté dans un canal.
    """
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name="messages")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, null=True, blank=True, verbose_name="Titre de la publication (Forum)")
    content = models.TextField()
    
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="replies")
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.user.username} @ {self.channel.name}"

class MentorshipRelation(models.Model):
    """
    Relation de mentorat entre un mentor et un étudiant.
    """
    mentor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="mentored_students")
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="mentors")
    
    status = models.CharField(max_length=20, choices=[('pending', 'En attente'), ('active', 'Actif'), ('closed', 'Terminé')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [['mentor', 'student']]

class SponsoredChallenge(models.Model):
    """
    Défi technique sponsorisé par une entreprise pour repérer des talents.
    Les entreprises vérifiées publient directement ; les nouvelles passent par validation admin.
    """
    DIFFICULTY_CHOICES = [
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="challenges")
    title = models.CharField(max_length=255, verbose_name="Titre du challenge")
    slug = models.SlugField(max_length=280, unique=True, null=True, blank=True)
    description = models.TextField(verbose_name="Description détaillée")
    rules = models.TextField(blank=True, verbose_name="Règles et contraintes")
    evaluation_criteria = models.TextField(blank=True, verbose_name="Critères d'évaluation")
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='intermediate')

    reward = models.CharField(max_length=255, blank=True, verbose_name="Récompense (ex: Offre de stage, Prize pool)")
    prize_pool = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Montant du prix (FCFA)")
    max_participants = models.PositiveIntegerField(default=0, verbose_name="Places (0 = illimité)")
    dataset_url = models.URLField(blank=True, verbose_name="Lien vers le dataset")

    is_active = models.BooleanField(default=True)
    is_open = models.BooleanField(default=True, verbose_name="Ouvert à tous")
    is_approved = models.BooleanField(default=False, verbose_name="Validé par MLAcademy")

    has_auto_grading = models.BooleanField(default=False, verbose_name="Évaluation automatique activée")
    private_test_dataset_url = models.URLField(blank=True, verbose_name="Dataset de test privé (auto-grading)")

    deadline = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Challenge Sponsorisé"
        verbose_name_plural = "Challenges Sponsorisés"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        from django.utils.text import slugify
        if not self.slug:
            original_slug = slugify(self.title)
            slug = original_slug
            num = 1
            while SponsoredChallenge.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{original_slug}-{num}"
                num += 1
            self.slug = slug
        # Auto-approve pour les entreprises vérifiées
        if not self.pk and self.company.is_verified:
            self.is_approved = True
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} by {self.company.name}"

    @property
    def is_published(self):
        """Un challenge est visible publiquement s'il est approuvé et actif."""
        return self.is_approved and self.is_active

    @property
    def spots_remaining(self):
        if self.max_participants == 0:
            return None  # Illimité
        return max(0, self.max_participants - self.submissions.count())


class ChallengeSubmission(models.Model):
    """
    Soumission d'un talent à un challenge sponsorisé.
    """
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('submitted', 'Soumis'),
        ('evaluated', 'Évalué'),
        ('winner', 'Gagnant'),
    ]

    challenge = models.ForeignKey(SponsoredChallenge, on_delete=models.CASCADE, related_name="submissions")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="challenge_submissions")

    repo_url = models.URLField(blank=True, verbose_name="Lien GitHub / dépôt")
    description = models.TextField(blank=True, verbose_name="Description de la solution")
    demo_url = models.URLField(blank=True, verbose_name="Lien démo live")

    score = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, verbose_name="Score (jury)")
    rank = models.PositiveIntegerField(null=True, blank=True, verbose_name="Classement final")
    jury_feedback = models.TextField(blank=True, verbose_name="Commentaires du jury")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    submitted_at = models.DateTimeField(null=True, blank=True)
    evaluated_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Soumission de Challenge"
        verbose_name_plural = "Soumissions de Challenges"
        constraints = [
            models.UniqueConstraint(fields=['challenge', 'user'], name='unique_challenge_user_submission')
        ]
        ordering = ['rank', '-score']

    def __str__(self):
        return f"{self.user.email} → {self.challenge.title} ({self.get_status_display()})"

    def submit(self):
        self.status = 'submitted'
        self.submitted_at = timezone.now()
        self.save(update_fields=['status', 'submitted_at'])

    def evaluate(self, score, rank=None, feedback=""):
        self.score = score
        self.rank = rank
        self.jury_feedback = feedback
        self.status = 'evaluated'
        self.evaluated_at = timezone.now()
        self.save(update_fields=['score', 'rank', 'jury_feedback', 'status', 'evaluated_at'])

    def mark_winner(self):
        self.status = 'winner'
        self.save(update_fields=['status'])


# ═════════════════════════════════════════════
#  MESSAGERIE DIRECTE (Recruteur ↔ Talent)
# ═════════════════════════════════════════════

class DirectConversation(models.Model):
    """
    Conversation privée entre exactement 2 utilisateurs.
    Optionnellement liée à une offre d'emploi.
    """
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="direct_conversations")
    job_offer = models.ForeignKey(JobOffer, on_delete=models.SET_NULL, null=True, blank=True, related_name="conversations",
        verbose_name="Offre liée (optionnel)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Conversation Directe"
        verbose_name_plural = "Conversations Directes"
        ordering = ['-updated_at']

    def __str__(self):
        names = ", ".join(u.email for u in self.participants.all()[:2])
        return f"Conversation: {names}"

    @classmethod
    def get_or_create_between(cls, user_a, user_b, job_offer=None):
        """
        Garantit l'unicité : une seule conversation par couple d'utilisateurs
        (et optionnellement par offre).
        """
        convos = cls.objects.filter(participants=user_a).filter(participants=user_b)
        if job_offer:
            convos = convos.filter(job_offer=job_offer)
        else:
            convos = convos.filter(job_offer__isnull=True)

        existing = convos.first()
        if existing:
            return existing, False

        convo = cls.objects.create(job_offer=job_offer)
        convo.participants.add(user_a, user_b)
        return convo, True


class DirectMessage(models.Model):
    """
    Message au sein d'une conversation directe privée.
    """
    conversation = models.ForeignKey(DirectConversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="direct_messages_sent")
    content = models.TextField(verbose_name="Message")
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Message Direct"
        verbose_name_plural = "Messages Directs"
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender.username}: {self.content[:50]}"
