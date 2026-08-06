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
    position_geographique = models.CharField(max_length=255, verbose_name="Localisation", blank=True, null=True)
    
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
    Défi technique sponsorisé par une entreprise pour repérer des talents (Kaggle / Zindi Style).
    """
    DIFFICULTY_CHOICES = [
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
        ('expert', 'Expert'),
    ]

    CATEGORY_CHOICES = [
        ('machine_learning', 'Machine Learning'),
        ('data_science', 'Data Science'),
        ('deep_learning', 'Deep Learning'),
        ('nlp', 'NLP / Traitement du Langage'),
        ('computer_vision', 'Vision par Ordinateur'),
        ('data_engineering', 'Data Engineering'),
        ('mlops', 'MLOps'),
        ('generative_ai', 'IA Générative'),
        ('quantum_ml', 'Quantum ML'),
        ('business_analytics', 'Business Analytics'),
    ]

    TYPE_CHOICES = [
        ('challenge', 'Challenge'),
        ('hackathon', 'Hackathon'),
        ('competition', 'Compétition'),
        ('sprint', 'Sprint'),
        ('bootcamp', 'Bootcamp Challenge'),
        ('kaggle', 'Kaggle Style'),
    ]

    EVALUATION_MODE_CHOICES = [
        ('auto', 'Évaluation Automatique'),
        ('jury', 'Évaluation par Jury'),
        ('hybrid', 'Évaluation Mixte'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('open', 'Ouvert'),
        ('closed', 'Fermé'),
        ('evaluating', 'En évaluation'),
        ('completed', 'Terminé'),
    ]

    RANKING_TIER_CHOICES = [
        ('bronze', 'Bronze'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
        ('diamond', 'Diamond'),
        ('master', 'Master'),
        ('grand_master', 'Grand Master'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="challenges")
    title = models.CharField(max_length=255, verbose_name="Titre du challenge")
    slug = models.SlugField(max_length=280, unique=True, null=True, blank=True)
    short_description = models.CharField(max_length=500, blank=True, verbose_name="Courte description (carte)")
    description = models.TextField(verbose_name="Description détaillée")
    objective = models.TextField(blank=True, verbose_name="Objectif du challenge")
    rules = models.TextField(blank=True, verbose_name="Règles et contraintes")
    evaluation_criteria = models.TextField(blank=True, verbose_name="Critères d'évaluation")
    
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='intermediate')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='machine_learning')
    challenge_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='competition')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')

    # Planning & Dates
    start_date = models.DateField(null=True, blank=True, verbose_name="Date d'ouverture")
    deadline = models.DateField()
    results_date = models.DateField(null=True, blank=True, verbose_name="Annonce des résultats")

    # Équipe
    allow_teams = models.BooleanField(default=False, verbose_name="Équipes autorisées")
    max_team_size = models.PositiveIntegerField(default=1, verbose_name="Taille max par équipe")

    # Dataset
    dataset_url = models.URLField(blank=True, verbose_name="Lien vers le dataset public")
    is_dataset_private = models.BooleanField(default=False, verbose_name="Dataset privé")
    private_test_dataset_url = models.URLField(blank=True, verbose_name="Dataset de test privé")
    dataset_size = models.CharField(max_length=50, blank=True, verbose_name="Taille du dataset (ex: 1.2 GB)")
    dataset_license = models.CharField(max_length=100, blank=True, verbose_name="Licence (ex: MIT, CC BY 4.0)")

    # Livrables & Tech Stack
    deliverables = models.JSONField(default=list, blank=True, verbose_name="Livrables attendus (ex: Notebook, Code, PDF)")
    recommended_tech = models.JSONField(default=list, blank=True, verbose_name="Technologies (ex: Python, PyTorch, XGBoost)")

    # Evaluation & Leaderboard
    evaluation_mode = models.CharField(max_length=20, choices=EVALUATION_MODE_CHOICES, default='hybrid')
    has_auto_grading = models.BooleanField(default=False, verbose_name="Auto-grading activé")
    enable_public_leaderboard = models.BooleanField(default=True, verbose_name="Activer Leaderboard public")

    # Récompenses & Prizes
    reward = models.CharField(max_length=255, blank=True, verbose_name="Récompense globale")
    prize_pool = models.DecimalField(max_digits=20, decimal_places=2, default=0.00, verbose_name="Montant du prix (FCFA)")
    first_prize = models.CharField(max_length=255, blank=True, verbose_name="Premier prix 🥇")
    second_prize = models.CharField(max_length=255, blank=True, verbose_name="Deuxième prix 🥈")
    third_prize = models.CharField(max_length=255, blank=True, verbose_name="Troisième prix 🥉")
    other_perks = models.TextField(blank=True, verbose_name="Avantages (Stage, Mentorat, Goodies)")

    # Organisateurs
    mentor_name = models.CharField(max_length=255, blank=True, verbose_name="Mentor principal")
    contact_email = models.EmailField(blank=True, verbose_name="Contact Email")
    organizer_website = models.URLField(blank=True, verbose_name="Site web organisateur")

    # Progression & Gamification (Parcours MLAcademy)
    progression_order = models.IntegerField(default=0, verbose_name="Ordre dans le parcours")
    prerequisite_challenge = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name="unlocked_challenges")
    ranking_tier = models.CharField(max_length=30, choices=RANKING_TIER_CHOICES, default='bronze', verbose_name="Palier de niveau")
    badge_reward = models.CharField(max_length=100, blank=True, verbose_name="Badge débloqué (ex: 🥇 Winner)")

    max_participants = models.PositiveIntegerField(default=0, verbose_name="Places (0 = illimité)")
    is_active = models.BooleanField(default=True)
    is_open = models.BooleanField(default=True, verbose_name="Ouvert à tous")
    is_approved = models.BooleanField(default=False, verbose_name="Validé par MLAcademy")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Challenge Sponsorisé"
        verbose_name_plural = "Challenges Sponsorisés"
        ordering = ['progression_order', '-created_at']

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
        if not self.pk and self.company.is_verified:
            self.is_approved = True
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.get_category_display()}) by {self.company.name}"

    @property
    def is_published(self):
        return self.is_approved and self.is_active

    @property
    def spots_remaining(self):
        if self.max_participants == 0:
            return None
        return max(0, self.max_participants - self.submissions.count())


class ChallengeSubmission(models.Model):
    """
    Soumission d'un talent à un challenge sponsorisé (Kaggle style).
    """
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('submitted', 'Soumis'),
        ('evaluated', 'Évalué'),
        ('winner', 'Gagnant'),
    ]

    challenge = models.ForeignKey(SponsoredChallenge, on_delete=models.CASCADE, related_name="submissions")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="challenge_submissions")

    submission_number = models.PositiveIntegerField(default=1, verbose_name="N° de soumission")
    repo_url = models.URLField(blank=True, verbose_name="Lien GitHub / dépôt")
    notebook_url = models.URLField(blank=True, verbose_name="Lien Notebook / Kaggle / Colab")
    demo_url = models.URLField(blank=True, verbose_name="Lien démo live / API")
    pdf_report_url = models.URLField(blank=True, verbose_name="Lien Rapport PDF")
    description = models.TextField(blank=True, verbose_name="Description de la solution & méthode")

    score = models.DecimalField(max_digits=8, decimal_places=5, null=True, blank=True, verbose_name="Score (métrique/jury)")
    rank = models.PositiveIntegerField(null=True, blank=True, verbose_name="Classement final")
    jury_feedback = models.TextField(blank=True, verbose_name="Commentaires du jury")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    submitted_at = models.DateTimeField(default=timezone.now, blank=True)
    evaluated_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Soumission de Challenge"
        verbose_name_plural = "Soumissions de Challenges"
        constraints = [
            models.UniqueConstraint(fields=['challenge', 'user'], name='unique_challenge_user_submission')
        ]
        ordering = ['rank', '-score', '-submitted_at']

    def __str__(self):
        return f"{self.user.email} → {self.challenge.title} (Score: {self.score})"

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


# =============================================
#  GAMIFICATION, BADGES & STREAKS
# =============================================

class Badge(models.Model):
    """
    Badge d'accomplissement débloquable par les apprenants.
    """
    CATEGORY_CHOICES = [
        ('learning', 'Apprentissage'),
        ('challenge', 'Challenges'),
        ('community', 'Communauté'),
        ('streak', 'Constance'),
        ('rank', 'Rangs & Tiers'),
        ('secret', 'Badges Secrets'),
    ]

    CONDITION_TYPE_CHOICES = [
        ('lesson_completed', 'Leçons complétées'),
        ('quiz_perfect', 'Score parfait au Quiz'),
        ('challenge_submitted', 'Solution de Challenge soumise'),
        ('streak_days', 'Série de jours d\'apprentissage'),
        ('first_login', 'Première connexion'),
        ('night_owl', 'Abeille du soir / Nuit'),
        ('bug_hunter', 'Chasseur de bugs'),
        ('top_leaderboard', 'Top Leaderboard'),
        ('manual', 'Manuel / Spécial'),
    ]

    name = models.CharField(max_length=150, verbose_name="Nom du badge")
    slug = models.SlugField(max_length=150, unique=True)
    description = models.TextField(verbose_name="Conditions d'obtention")
    icon = models.CharField(max_length=100, default="trophy", help_text="Nom d'icône Lucide (ex: trophy, flame, zap, award)")
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='learning')
    xp_reward = models.IntegerField(default=100, verbose_name="Points XP accordés")
    
    condition_type = models.CharField(max_length=50, choices=CONDITION_TYPE_CHOICES, default='lesson_completed')
    condition_value = models.IntegerField(default=1, help_text="Valeur nécessaire pour débloquer (ex: 5 leçons)")
    is_secret = models.BooleanField(default=False, verbose_name="Badge masqué / secret")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Badge"
        verbose_name_plural = "Badges"
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} (+{self.xp_reward} XP)"


class UserBadge(models.Model):
    """
    Association entre un utilisateur et un badge débloqué.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="unlocked_badges")
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name="awarded_users")
    awarded_at = models.DateTimeField(auto_now_add=True)
    is_seen = models.BooleanField(default=False, help_text="Indique si la popup de félicitations a été affichée")

    class Meta:
        verbose_name = "Badge Utilisateur"
        verbose_name_plural = "Badges Utilisateurs"
        unique_together = ('user', 'badge')
        ordering = ['-awarded_at']

    def __str__(self):
        return f"{self.user.email} - {self.badge.name}"


class UserStreak(models.Model):
    """
    Suivi des jours consécutifs d'apprentissage et protections (Streak Freeze).
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="streak_info")
    current_streak = models.IntegerField(default=0, verbose_name="Série actuelle (jours)")
    max_streak = models.IntegerField(default=0, verbose_name="Record de série (jours)")
    last_activity_date = models.DateField(null=True, blank=True, verbose_name="Dernier jour d'activité")
    streak_freezes_available = models.IntegerField(default=1, verbose_name="Protections Streak Freeze disponibles")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Série d'apprentissage"
        verbose_name_plural = "Séries d'apprentissage"

    def __str__(self):
        return f"{self.user.email} - 🔥 {self.current_streak} jours"

