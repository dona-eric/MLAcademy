from django.db import models

class PlatformSettings(models.Model):
    """
    Configuration globale de la plateforme MLAcademy.
    Permet à l'admin de changer le branding et les paramètres en temps réel.
    """
    site_name = models.CharField(max_length=100, default="MLAcademy")
    primary_color = models.CharField(max_length=7, default="#3B82F6") # Blue 600
    secondary_color = models.CharField(max_length=7, default="#10B981") # Emerald 500
    logo_url = models.URLField(blank=True, null=True)
    maintenance_mode = models.BooleanField(default=False)
    allow_registration = models.BooleanField(default=True)
    # SEO & Social
    meta_description = models.TextField(blank=True)
    contact_email = models.EmailField(default="contact@mlacademy.com")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Paramètres Plateforme"
        verbose_name_plural = "Paramètres Plateforme"

    def __str__(self):
        return self.site_name

    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(id=1)
        return settings

class AuditLog(models.Model):
    """
    Historique des actions administratives pour la traçabilité.
    """
    admin = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name="audit_logs")
    action = models.CharField(max_length=255)
    details = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Journal d'Audit"
        verbose_name_plural = "Journaux d'Audit"

class Transaction(models.Model):
    """
    Suivi des ventes et revenus (même simulés pour l'instant).
    """
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name="transactions")
    course = models.ForeignKey('courses.Course', on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='completed')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"
