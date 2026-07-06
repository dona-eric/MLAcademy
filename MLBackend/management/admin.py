from django.contrib import admin
from .models import PlatformSettings, Transaction, AuditLog
# Register your models here.


@admin.register(PlatformSettings)
class PlatformSettingsAdmin(admin.ModelAdmin):
    list_display = ['site_name', 'logo_url', "maintenance_mode", "meta_description", "contact_email", 'updated_at']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'amount', 'status', 'created_at']


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['admin', 'action', 'details', 'ip_address', 'created_at']
