from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, InstructorApplication,BetaTesteur
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
import secrets
import string

def generate_professional_email(first_name, last_name, base_domain="mlacademy.io"):
    first = "".join(e for e in first_name if e.isalnum()).lower()
    last = "".join(e for e in last_name if e.isalnum()).lower()
    
    if not first and not last:
        base_email = f"instructor@{base_domain}"
    else:
        base_email = f"{first}.{last}@{base_domain}" if first and last else f"{first or last}@{base_domain}"
    
    new_email = base_email
    counter = 1
    while CustomUser.objects.filter(email=new_email).exists():
        new_email = f"{base_email.split('@')[0]}{counter}@{base_domain}"
        counter += 1
        
    return new_email

def generate_secure_password(length=12):
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for i in range(length))


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
        count = 0
        for app in queryset.filter(status=InstructorApplication.STATUS_PENDING):
            app.approve(reviewed_by=request.user)
            
            user = app.user
            old_personal_email = user.email
            
            # 1. Génération de l'identité professionnelle
            new_pro_email = generate_professional_email(user.first_name, user.last_name)
            new_password = generate_secure_password()
            
            # 2. Mise à jour du compte utilisateur existant
            user.email = new_pro_email
            user.username = new_pro_email
            user.set_password(new_password)
            user.is_active = True
            user.is_instructor = True
            user.email_verified = True
            user.save()

            # 3. Envoi des identifiants à l'ancienne adresse
            login_url = f"{settings.FRONTEND_URL}/instructor/login"
            
            send_mail(
                subject="Bienvenue chez MLAcademy ! Votre candidature est approuvée",
                message=(
                    f"Bonjour {user.first_name or 'futur instructeur'},\n\n"
                    f"Félicitations ! Votre candidature en tant qu'instructeur a été approuvée.\n\n"
                    f"Pour garantir votre identité professionnelle sur la plateforme, nous vous avons provisionné un compte officiel.\n\n"
                    f"Voici vos identifiants uniques de connexion pour accéder à votre Studio :\n"
                    f"URL de connexion : {login_url}\n"
                    f"Email (Identifiant) : {new_pro_email}\n"
                    f"Mot de passe : {new_password}\n\n"
                    f"Nous vous recommandons de changer ce mot de passe lors de votre première connexion.\n\n"
                    f"L'équipe MLAcademy"
                ),
                from_email="noreply@mlacademy.io",
                recipient_list=[old_personal_email],
                fail_silently=False,
            )
            count += 1
        
        self.message_user(request, f"{count} candidatures approuvées. Les emails professionnels ont été générés et envoyés.")

    @admin.action(description="Refuser les candidatures sélectionnées")
    def reject_applications(self, request, queryset):
        # Ici on pourrait ouvrir un formulaire pour le motif, 
        # mais simplifions avec un motif par défaut pour le bulk
        count = 0
        for app in queryset.filter(status__in=[InstructorApplication.STATUS_PENDING, InstructorApplication.STATUS_REVIEWING]):
            app.reject(reviewed_by=request.user, reason="Profil non retenu pour le moment.")
            count += 1
        self.message_user(request, f"{count} candidatures refusées.")



@admin.register(BetaTesteur)
class BetaTesterAdmin(admin.ModelAdmin):
    # Colonnes affichées dans la liste
    list_display = ('get_username', 'get_email', 'applied_at', 'is_approved')
    # Filtres latéraux
    list_filter = ('is_approved', 'applied_at')
    # Barre de recherche
    search_fields = ('user__username', 'user__email')
    
    # Action personnalisée pour approuver en masse
    actions = ['approve_testers']

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = "Nom d'utilisateur"

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = "Email"

    # Fonction de l'action de groupe
    @admin.action(description="Approuver les bêta-testeurs sélectionnés")
    def approve_testers(self, request, queryset):
        updated = queryset.update(is_approved=True)
        # Ici, tu pourras plus tard déclencher un signal pour envoyer un email de félicitations automatique !
        self.message_user(request, f"{updated} testeur(s) ont été approuvés avec succès et ont accès aux cours.")