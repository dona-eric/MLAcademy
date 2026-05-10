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
    list_display = ["user_email", "status", "expertise", "submitted_at", "reviewed_at"]
    list_filter = ["status", "expertise"]
    search_fields = ["user__email", "user__first_name", "user__last_name", "expertise"]
    readonly_fields = ["submitted_at", "reviewed_at", "activation_token", "activation_token_sent", "activation_expires_at"]
    actions = ["approve_applications", "reject_applications"]

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = "Email"

    @admin.action(description="Approuver les candidatures sélectionnées")
    def approve_applications(self, request, queryset):
        from django.core.mail import send_mail
        from django.conf import settings
        from django.utils import timezone

        count = 0
        for app in queryset.filter(status=InstructorApplication.STATUS_PENDING):
            app.approve(reviewed_by=request.user)
            
            # Activer l'utilisateur
            user = app.user
            user.is_active = True
            user.is_instructor = True
            user.save(update_fields=["is_active", "is_instructor"])

            # Envoyer l'email
            activation_link = f"{settings.FRONTEND_URL}/instructor/activate/?token={app.activation_token}"
            # Note: On peut aussi réutiliser le système de password reset existant
            
            send_mail(
                subject="Bienvenue chez MLAcademy ! Votre candidature est approuvée",
                message=(
                    f"Bonjour {user.first_name or user.email},\n\n"
                    f"Félicitations ! Votre candidature en tant qu'instructeur a été approuvée.\n\n"
                    f"Veuillez définir votre mot de passe pour accéder au Studio :\n"
                    f"{activation_link}\n\n"
                    "L'équipe MLAcademy"
                ),
                from_email="noreply@mlacademy.io",
                recipient_list=[user.email],
                fail_silently=True,
              )
            count += 1
        
        self.message_user(request, f"{count} candidatures approuvées et e-mails envoyés.")

    @admin.action(description="Refuser les candidatures sélectionnées")
    def reject_applications(self, request, queryset):
        # Ici on pourrait ouvrir un formulaire pour le motif, 
        # mais simplifions avec un motif par défaut pour le bulk
        count = 0
        for app in queryset.filter(status__in=[InstructorApplication.STATUS_PENDING, InstructorApplication.STATUS_REVIEWING]):
            app.reject(reviewed_by=request.user, reason="Profil non retenu pour le moment.")
            count += 1
        self.message_user(request, f"{count} candidatures refusées.")
