from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """Interface d'administration pour le modèle CustomUser."""

    model = CustomUser
    list_display = ["email", "username", "first_name", "last_name", "email_verified", "otp_enabled", "is_staff"]
    list_filter = ["email_verified", "otp_enabled", "is_staff", "is_active", "level"]
    search_fields = ["email", "username", "first_name", "last_name"]
    ordering = ["-date_joined"]

    fieldsets = UserAdmin.fieldsets + (
        ("MLAcademy", {
            "fields": (
                "email_verified", "otp_enabled",
                "bio", "avatar", "linkedin_url", "github_url", "portfolio_url",
                "level", "personal_goals", "is_public_profile",
            )
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ("MLAcademy", {
            "fields": ("email", "first_name", "last_name"),
        }),
    )

from .models import InstructorApplication

@admin.register(InstructorApplication)
class InstructorApplicationAdmin(admin.ModelAdmin):
    list_display = ["user", "status", "submitted_at", "reviewed_at"]
    list_filter = ["status"]
    search_fields = ["user__email", "expertise_areas"]
    readonly_fields = ["submitted_at"]
