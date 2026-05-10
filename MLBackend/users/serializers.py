from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


#  INSCRIPTION


class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        error_messages={
            "required": "L'adresse email est obligatoire.",
            "invalid": "Veuillez saisir une adresse email valide.",
            "blank": "L'adresse email ne peut pas être vide.",
        },
    )
    username = serializers.CharField(
        required=True,
        error_messages={
            "required": "Le nom d'utilisateur est obligatoire.",
            "blank": "Le nom d'utilisateur ne peut pas être vide.",
        },
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        trim_whitespace=False,
        error_messages={
            "required": "Le mot de passe est obligatoire.",
            "blank": "Le mot de passe ne peut pas être vide.",
        },
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        trim_whitespace=False,
        error_messages={
            "required": "La confirmation du mot de passe est obligatoire.",
            "blank": "La confirmation du mot de passe ne peut pas être vide.",
        },
    )

    class Meta:
        model = User
        fields = [
            "email",
            "username",
            "first_name",
            "last_name",
            "password",
            "password_confirm",
        ]
        extra_kwargs = {
            "first_name": {"required": False, "allow_blank": True},
            "last_name": {"required": False, "allow_blank": True},
        }

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Cet email est déjà utilisé.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà utilisé.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Les mots de passe ne correspondent pas."}
            )

        try:
            validate_password(attrs["password"])
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"password": list(exc.messages)})

        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.is_active = True  # Actif mais email non vérifié
        user.email_verified = False
        user.save()
        return user


#  CONNEXION JWT


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Ajoute des champs supplémentaires
    dans le token JWT et vérifie l'email.
    """

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        if not user.email_verified:
            raise serializers.ValidationError(
                {
                    "detail": "Veuillez confirmer votre adresse email avant de vous connecter."
                }
            )

        # Données retournées avec les tokens
        data["email"] = user.email
        data["username"] = user.username
        data["otp_enabled"] = user.otp_enabled
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["username"] = user.username
        return token


#  RESET MOT DE PASSE


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["new_password_confirm"]:
            raise serializers.ValidationError(
                {"new_password": "Les mots de passe ne correspondent pas."}
            )
        return attrs


#  EXPORT RGPD


class UserExportSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "bio",
            "linkedin_url",
            "github_url",
            "portfolio_url",
            "level",
            "personal_goals",
            "is_public_profile",
            "email_verified",
            "otp_enabled",
            "date_joined",
            "last_login",
        ]


#  F-02 : PROFIL APPRENANT


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer pour lire et mettre à jour le profil de l'utilisateur connecté.
    Utilisé pour GET/PATCH
    """

    avatar_url = serializers.SerializerMethodField(read_only=True)
    is_instructor = serializers.SerializerMethodField(read_only=True)
    instructor_application_status = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "avatar",
            "avatar_url",
            "bio",
            "linkedin_url",
            "github_url",
            "portfolio_url",
            "level",
            "personal_goals",
            "is_public_profile",
            "email_verified",
            "otp_enabled",
            "date_joined",
            "last_login",
            "is_instructor",
            "instructor_application_status",
        ]
        read_only_fields = [
            "id",
            "email",
            "email_verified",
            "otp_enabled",
            "date_joined",
            "last_login",
        ]
        extra_kwargs = {
            "avatar": {"write_only": True, "required": False},
        }

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def get_is_instructor(self, obj):
        from .models import InstructorApplication
        return InstructorApplication.objects.filter(user=obj, status='approved').exists()

    def get_instructor_application_status(self, obj):
        from .models import InstructorApplication
        try:
            app = InstructorApplication.objects.get(user=obj)
            return app.status
        except InstructorApplication.DoesNotExist:
            return None


class UserPublicProfileSerializer(serializers.ModelSerializer):
    """
    Serializer pour le profil public d'un utilisateur (visible par tous).
    Utilisé pour GET /api/users/profile/<username>/
    """

    avatar_url = serializers.SerializerMethodField(read_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "full_name",
            "avatar_url",
            "bio",
            "linkedin_url",
            "github_url",
            "portfolio_url",
            "level",
            "date_joined",
        ]

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def get_full_name(self, obj):
        return obj.get_full_name()


from .models import InstructorApplication

class InstructorApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructorApplication
        fields = ['id', 'cv_url', 'portfolio_url', 'motivation', 'expertise_areas', 'status', 'submitted_at']
        read_only_fields = ['id', 'status', 'submitted_at']
