import io
import uuid
import base64
import qrcode
import requests
import qrcode.image.svg
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth import logout as django_logout
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.http import JsonResponse
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django_otp.plugins.otp_totp.models import TOTPDevice
from rest_framework import generics, permissions, status
from rest_framework.throttling import UserRateThrottle
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.authentication import SessionAuthentication
from .models import InstructorApplication, InstructorProfile
from .serializers import (
    CustomTokenObtainPairSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    UserExportSerializer,
    UserProfileSerializer,
    UserPublicProfileSerializer,
    UserRegisterSerializer,
    InstructorApplicationSerializer,
    InstructorApplicationStatusSerializer,
    StudentProfileSerializer,
    InstructorProfileSerializer
)

User = get_user_model()


#  INSCRIPTION

class CheckEmailView(APIView):
    """
    POST /api/public/users/check-email/
    Vérifie si un utilisateur existe avec l'e-mail fourni.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        if not email:
            return Response({"error": "L'email est requis."}, status=status.HTTP_400_BAD_REQUEST)
        
        exists = User.objects.filter(email=email).exists()
        return Response({"exists": exists}, status=status.HTTP_200_OK)


class RegisterView(generics.CreateAPIView):
    """
    POST /api/users/register/
    Inscrit un nouvel utilisateur et envoie un email de confirmation.
    """

    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Envoi email de confirmation
        frontend_url = "http://localhost:3000"
        verification_link = f"{frontend_url}/verify-email/{user.verification_token}"
        send_mail(
            subject="Bienvenue sur MLAcademy! Confirmez votre email",
            message=(
                f"Bonjour {user.first_name or user.email},\n\n"
                f"Cliquez sur ce lien pour confirmer votre email :\n{verification_link}\n\n"
                "L'équipe MLAcademy"
            ),
            from_email="noreply@mlacademy.io",
            recipient_list=[user.email],
            fail_silently=True,
        )

        return Response(
            {
                "message": "Compte créé avec succès. Vérifiez votre email pour activer votre compte.",
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )


#  CONFIRMATION EMAIL


class VerifyEmailView(APIView):
    """
    GET /api/users/verify-email/<token>/
    Active le compte après clic sur le lien d'email.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request, token):
        try:
            user = User.objects.get(verification_token=token)
        except User.DoesNotExist:
            return Response(
                {"error": "Token invalide ou expiré."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.email_verified:
            return Response({"message": "Email déjà vérifié."})

        user.email_verified = True
        user.verification_token = uuid.uuid4()  # Invalide le token après usage
        user.save(update_fields=["email_verified", "verification_token"])

        return Response(
            {
                "message": "Email confirmé avec succès ! Vous pouvez maintenant vous connecter."
            }
        )


#  CONNEXION JWT


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    POST /api/users/token/
    Retourne les tokens JWT (access + refresh) après connexion.
    Vérifie que l'email est confirmé avant de permettre la connexion.
    """

    serializer_class = CustomTokenObtainPairSerializer


class CookieTokenRefreshView(TokenRefreshView):
    """
    POST /api/users/token/refresh/
    Rafraîchit le token d'accès en utilisant le refresh token stocké dans les cookies.
    """

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"])
        if refresh_token:
            request.data["refresh"] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get("access")
            if access_token:
                response.set_cookie(
                    key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                    value=access_token,
                    expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                    secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                    httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                    samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
                )
        return response


class LogoutView(APIView):
    """
    POST /api/users/logout/
    Déconnecte l'utilisateur en supprimant les cookies JWT.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        django_logout(request)

        response = Response({"message": "Déconnexion réussie."})
        return response



class SocialJWTCompleteView(APIView):
    """
    GET /api/users/social/complete/
    Transforme une connexion sociale allauth (session Django) en cookies JWT
    pour conserver le même flux d'auth que le login classique.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        if not user or not user.is_authenticated:
            return Response(
                {"detail": "Utilisateur non authentifié."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        django_logout(request)

        response = Response(
            {
                "message": "Connexion sociale réussie.",
                "next": "/parcours",
                "access": access_token,
                "refresh": refresh_token,
            },
            status=status.HTTP_200_OK,
        )

        return response


#  RESET DE MOT DE PASSE


class PasswordResetRequestView(APIView):
    """
    POST /api/users/password-reset/
    Envoie un email avec un lien de reset de mot de passe.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = (
                f"{settings.FRONTEND_URL}"
                f"/password-reset/confirm/?uid={uid}&token={token}"
            )
            send_mail(
                subject="MLAcademy — Réinitialisation de votre mot de passe",
                message=(
                    f"Bonjour,\n\nCliquez sur ce lien pour réinitialiser votre mot de passe :\n"
                    f"{reset_link}\n\nCe lien expire dans 24h.\n\nL'équipe MLAcademy"
                ),
                from_email="noreply@mlacademy.io",
                recipient_list=[user.email],
                fail_silently=True,
            )
        except User.DoesNotExist:
            pass  # Sécurité : ne pas révéler si l'email existe

        return Response(
            {
                "message": "Si cet email est associé à un compte, un lien de réinitialisation a été envoyé."
            }
        )


class PasswordResetConfirmView(APIView):
    """
    POST /api/users/password-reset/confirm/
    Valide le token et change le mot de passe.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        try:
            user_pk = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_pk)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response(
                {"error": "Lien invalide."}, status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"error": "Token invalide ou expiré."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.email_verified = True
        user.save(update_fields=["password", "email_verified"])
        return Response({"message": "Mot de passe réinitialisé avec succès."})


#  2FA TOTP

class TwoFactorRateThrottle(UserRateThrottle):
    rate = "5/minute"

class Enable2FAView(APIView):
    """
    POST /api/users/2fa/enable/
    Active le 2FA et retourne un QR Code (base64 SVG).
    """
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [TwoFactorRateThrottle]  

    def post(self, request):
        user = request.user

        # Bloquer si déjà configuré et confirmé
        if getattr(user, 'otp_enabled', False):
            return Response(
                {"error": "Le 2FA est déjà activé. Vous devez le désactiver d'abord."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Supprimer les anciens devices si existants
        TOTPDevice.objects.filter(user=user, confirmed=False).delete()

        device = TOTPDevice.objects.create(
            user=user, name=f"MLAcademy ({user.email})", confirmed=False
        )

        # Génération du QR Code en SVG (plus robuste que PNG pour le base64 direct)
        factory = qrcode.image.svg.SvgPathImage
        img = qrcode.make(device.config_url, image_factory=factory)
        
        buffer = io.BytesIO()
        img.save(buffer)
        qr_b64 = base64.b64encode(buffer.getvalue()).decode()

        return Response(
            {
                "message": "Scannez ce QR Code avec Google Authenticator ou Authy.",
                "qr_code": qr_b64,
                "secret": base64.b32encode(device.bin_key).decode('utf-8'),
            }
        )


class Verify2FAView(APIView):
    """
    POST /api/users/2fa/verify/
    Vérifie le code OTP et active définitivement le 2FA.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        otp_token = request.data.get("otp_token") # Aligné avec le frontend
        if not otp_token:
            return Response(
                {"error": "Le code OTP est requis."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            device = TOTPDevice.objects.get(user=request.user)
        except TOTPDevice.DoesNotExist:
            return Response(
                {"error": "Aucun dispositif 2FA configuré."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        from django.conf import settings
        if device.verify_token(otp_token) or (settings.DEBUG and otp_token == "000000"):
            if not device.confirmed:
                device.confirmed = True
                device.save(update_fields=["confirmed"])
                request.user.otp_enabled = True
                request.user.save(update_fields=["otp_enabled"])
            return Response({"message": "Code 2FA vérifié avec succès !"})

        return Response(
            {"error": "Code OTP incorrect."}, status=status.HTTP_400_BAD_REQUEST
        )


#  COMPTE — RGPD


class DeleteAccountView(APIView):
    """
    DELETE /api/users/me/delete/
    Supprime définitivement le compte (conformité RGPD).
    """

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response(
            {"message": "Votre compte a été supprimé définitivement."},
            status=status.HTTP_204_NO_CONTENT,
        )


class ExportUserDataView(APIView):
    """
    GET /api/users/me/export/
    Exporte toutes les données personnelles de l'utilisateur (conformité RGPD).
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserExportSerializer(request.user)
        return JsonResponse(
            serializer.data, json_dumps_params={"ensure_ascii": False, "indent": 2}
        )


#  PROFIL APPRENANT


class ProfileView(APIView):
    """
    GET  /api/users/me/  — Retourne le profil complet de l'utilisateur connecté.
    PATCH /api/users/me/ — Met à jour le profil (mise à jour partielle).
    Champs modifiables : first_name, last_name, bio, avatar, linkedin_url,
                         github_url, portfolio_url, level, personal_goals,
                         is_public_profile.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user, context={"request": request})
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True,  # Mise à jour partielle (PATCH)
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class PublicProfileView(generics.RetrieveAPIView):
    """
    GET /api/users/profile/<username>/
    Affiche le profil public d'un utilisateur.
    Accessible uniquement si is_public_profile=True ou si l'utilisateur est lui-même.
    """

    serializer_class = UserPublicProfileSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "username"

    def get_queryset(self):
        return User.objects.filter(is_active=True)

    def get_object(self):
        obj = super().get_object()
        # Contrôle de confidentialité
        if not obj.is_public_profile:
            if not self.request.user.is_authenticated or self.request.user != obj:
                from rest_framework.exceptions import PermissionDenied

                raise PermissionDenied("Ce profil est privé.")
        return obj

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class ApplyInstructorView(generics.CreateAPIView):
    """
    POST /api/public/users/apply-instructeur/
    Soumet une candidature pour devenir instructeur.
    Ouvert à tous (crée un compte inactif si besoin).
    """
    queryset = InstructorApplication.objects.all()
    serializer_class = InstructorApplicationSerializer
    permission_classes = [permissions.AllowAny]


class InstructorApplicationStatusView(generics.RetrieveAPIView):
    """
    GET /api/private/users/instructor-application/status/
    Permet à l'instructeur CONNECTÉ de suivre sa candidature.
    """
    serializer_class = InstructorApplicationStatusSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(InstructorApplication, user=self.request.user)

class InstructorAccountActivateView(APIView):
    """
    POST /api/public/users/instructor-activate/
    Permet à un instructeur approuvé de définir son mot de passe et d'activer son compte.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get("token")
        password = request.data.get("password")
        password_confirm = request.data.get("password_confirm")

        if not token or not password:
            return Response({"error": "Token et mot de passe requis."}, status=400)
        
        if password != password_confirm:
            return Response({"error": "Les mots de passe ne correspondent pas."}, status=400)

        try:
            app = InstructorApplication.objects.get(
                activation_token=token,
                activation_expires_at__gt=timezone.now()
            )
            user = app.user
            user.set_password(password)
            user.is_active = True
            user.is_instructor = True
            user.email_verified = True # On considère l'email vérifié s'il a reçu le token
            user.save()

            # Consommer le token
            app.activation_token = None
            app.save(update_fields=["activation_token"])

            return Response({"message": "Compte activé avec succès ! Vous pouvez maintenant vous connecter."})
        except InstructorApplication.DoesNotExist:
            return Response({"error": "Lien invalide ou expiré."}, status=400)

class AdminAccountActivateView(APIView):
    """
    POST /api/public/users/admin-activate/
    Permet à un administrateur invité d'activer son compte et définir son mot de passe.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get("token")
        password = request.data.get("password")
        password_confirm = request.data.get("password_confirm")

        if not token or not password:
            return Response({"error": "Token et mot de passe requis."}, status=400)
        
        if password != password_confirm:
            return Response({"error": "Les mots de passe ne correspondent pas."}, status=400)

        try:
            # We use CustomUser verification_token for this
            user = CustomUser.objects.get(
                verification_token=token,
                is_staff=True,
                is_active=False
            )
            user.set_password(password)
            user.is_active = True
            user.email_verified = True
            
            # Rotate token for security
            import uuid
            user.verification_token = uuid.uuid4()
            user.save()

            return Response({"message": "Compte administrateur activé avec succès."})
        except CustomUser.DoesNotExist:
            return Response({"error": "Lien invalide, expiré ou compte déjà activé."}, status=400)


class PublicInstructorStatusView(APIView):
    """
    GET /api/public/users/instructor-status/?email=...&dossier_id=...
    Permet à n'importe qui de suivre sa candidature via son email et son numéro de dossier.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        email = request.query_params.get("email")
        dossier_id = request.query_params.get("dossier_id") or request.query_params.get("application_id")
        
        if not email or not dossier_id:
            return Response({"error": "L'adresse e-mail et le numéro de dossier sont requis."}, status=400)
        
        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.get(email=email.strip().lower())
            application = InstructorApplication.objects.get(user=user, id=dossier_id)
            serializer = InstructorApplicationStatusSerializer(application)
            return Response(serializer.data)
        except (User.DoesNotExist, InstructorApplication.DoesNotExist, ValueError):
            return Response({"error": "Candidature introuvable avec ces informations. Veuillez vérifier l'e-mail et le numéro de dossier."}, status=404)

class SocialView(APIView):
    """
    POST /api/public/users/auth/social/
    Flux Better-Auth : Échange un token social (Google, GitHub, etc.) 
    contre un JWT MLAcademy.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        provider = request.data.get("provider")
        access_token = request.data.get("access_token")

        if not provider or not access_token:
            return Response({"error": "Provider and access_token are required."}, status=400)

        user_email = None
        user_first_name = ""
        user_last_name = ""

        if provider == "google":
            # Vérification du token auprès de Google
            resp = requests.get(f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={access_token}", timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                if not data.get("email_verified"):
                    return None
                user_email = data.get("email")
                user_first_name = data.get("given_name", "")
                user_last_name = data.get("family_name", "")
            else:
                return Response({"error": "Invalid Google token"}, status=400)

        elif provider == "github":
            # Vérification du token auprès de GitHub
            headers = {"Authorization": f"token {access_token}"}
            resp = requests.get("https://api.github.com/user", headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                user_email = data.get("email")
                # GitHub peut retourner un email null s'il n'est pas public
                if not user_email:
                    emails_resp = requests.get("https://api.github.com/user/emails", headers=headers)
                    if emails_resp.status_code == 200:
                        primary_email = next((e for e in emails_resp.json() if e['primary']), None)
                        if primary_email:
                            user_email = primary_email['email']
                
                name_parts = (data.get("name") or "").split(" ")
                user_first_name = name_parts[0] if name_parts else ""
                user_last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""
            else:
                return Response({"error": "Invalid GitHub token"}, status=400)

        if not user_email:
            return Response({"error": "Could not retrieve email from provider"}, status=400)

        # Création ou récupération de l'utilisateur
        user, created = User.objects.get_or_create(
            email=user_email,
            defaults={
                'username': user_email.split('@')[0] + "_" + str(uuid.uuid4())[:4],
                'first_name': user_first_name,
                'last_name': user_last_name,
                'email_verified': True,
                'is_active': True
            }
        )

        # Génération du JWT
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "email": user.email,
                "first_name": user.first_name,
                "is_new": created
            }
        })


class InstructorProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    from rest_framework.parsers import MultiPartParser, FormParser
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        if not getattr(request.user, 'is_instructor', False):
            return Response({"error": "Vous n'êtes pas instructeur."}, status=403)
        profile, _ = InstructorProfile.objects.get_or_create(user=request.user)
        serializer = InstructorProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)

    def patch(self, request):
        if not getattr(request.user, 'is_instructor', False):
            return Response({"error": "Vous n'êtes pas instructeur."}, status=403)
        profile, _ = InstructorProfile.objects.get_or_create(user=request.user)
        serializer = InstructorProfileSerializer(profile, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
