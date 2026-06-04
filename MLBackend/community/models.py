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
    """
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="challenges")
    title = models.CharField(max_length=255)
    description = models.TextField()
    reward = models.CharField(max_length=255, blank=True, verbose_name="Récompense (ex: Offre de stage, Prize pool)")
    
    is_active = models.BooleanField(default=True)
    deadline = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.company.name}"
