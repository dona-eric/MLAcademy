import io
import uuid
import base64
import qrcode
import qrcode.image.svg
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth import logout as django_logout
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.http import JsonResponse
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django_otp.plugins.otp_totp.models import TOTPDevice
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import (
    CustomTokenObtainPairSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    UserExportSerializer,
    UserProfileSerializer,
    UserPublicProfileSerializer,
    UserRegisterSerializer,
    InstructorApplicationSerializer,
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


from rest_framework.authentication import SessionAuthentication

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
        user.save(update_fields=["password"])
        return Response({"message": "Mot de passe réinitialisé avec succès."})


#  2FA — TOTP


class Enable2FAView(APIView):
    """
    POST /api/users/2fa/enable/
    Active le 2FA et retourne un QR Code (base64 SVG).
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        # Supprimer les anciens devices si existants
        TOTPDevice.objects.filter(user=user).delete()

        device = TOTPDevice.objects.create(
            user=user, name="MLAcademy 2FA", confirmed=False
        )

        # Génération du QR Code
        otp_url = device.config_url
        qr = qrcode.make(otp_url)
        buffer = io.BytesIO()
        qr.save(buffer, format="PNG")

        qr_b64 = base64.b64encode(buffer.getvalue()).decode()

        return Response(
            {
                "message": "Scannez ce QR Code avec Google Authenticator ou Authy.",
                "qr_code": f"data:image/png;base64,{qr_b64}",
                "secret": device.bin_key.hex(),
            }
        )


class Verify2FAView(APIView):
    """
    POST /api/users/2fa/verify/
    Vérifie le code OTP et active définitivement le 2FA.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        otp_token = request.data.get("token")
        if not otp_token:
            return Response(
                {"error": "Le code OTP est requis."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            device = TOTPDevice.objects.get(user=request.user, confirmed=False)
        except TOTPDevice.DoesNotExist:
            return Response(
                {"error": "Aucun dispositif 2FA en attente de confirmation."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if device.verify_token(otp_token):
            device.confirmed = True
            device.save(update_fields=["confirmed"])
            request.user.otp_enabled = True
            request.user.save(update_fields=["otp_enabled"])
            return Response({"message": "2FA activé avec succès !"})

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
    POST /api/users/apply-instructor/
    Soumet une candidature pour devenir instructeur.
    """
    from .models import InstructorApplication
    queryset = InstructorApplication.objects.all()
    serializer_class = InstructorApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        from .models import InstructorApplication
        # Vérifier si l'utilisateur a déjà soumis
        if InstructorApplication.objects.filter(user=self.request.user).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"error": "Vous avez déjà soumis une candidature."})
        serializer.save(user=self.request.user)
