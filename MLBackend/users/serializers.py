from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import StudentProfile, InstructorApplication, InstructorProfile, BetaTesteur
from phonenumber_field.serializerfields import PhoneNumberField

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
    register_as_beta_tester = serializers.BooleanField(required=False, write_only=True)
    motivation = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = [
            "email", "username", "first_name", "last_name", "password", "password_confirm",
            "register_as_beta_tester", "motivation"
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
        register_as_beta_tester = validated_data.pop("register_as_beta_tester", False)
        motivation = validated_data.pop("motivation", "")
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.is_active = True  # Actif mais email non vérifié
        user.email_verified = False
        user.save()

        if register_as_beta_tester:
            BetaTesteur.objects.create(
                user=user,
                motivation=motivation or "Inscription au programme bêta de MLAcademyHub.",
                is_approved=False,
            )

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
        fields = ["id","email","username","first_name","last_name","bio","linkedin_url","github_url","portfolio_url","level","personal_goals","is_public_profile","email_verified","otp_enabled","date_joined", "last_login",]


# StudentProfile Serializer

class StudentProfileSerializer(serializers.ModelSerializer):
    """
    Serializer pour gérer les données détaillées de l'onboarding.
    """
    class Meta:
        model = StudentProfile
        fields = [
            "phone", "gender", "address_street", "address_zip","address_city", "address_country", "french_level","english_level", "current_situation", 
            "professional_experiences","work_permits", "specific_statuses", "diplomas", "projects", "hours_per_week","desired_start_date", "onboarding_completed","honor_declaration_accepted", "selected_training_slug","funding_method"
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
    stats = serializers.SerializerMethodField(read_only=True)
    student_profile = StudentProfileSerializer(required=False)

    class Meta:
        model = User
        fields = [
            "id", "email", "username", "first_name", "last_name",
            "avatar", "avatar_url", "bio", "linkedin_url",
            "github_url", "portfolio_url", "level",
            "personal_goals", "is_public_profile", "email_verified",
            "otp_enabled", "is_staff", "is_superuser", "date_joined","last_login", "is_instructor", "instructor_application_status","stats", "student_profile", "xp_points"
        ]
        read_only_fields = [
            "id", "email", "email_verified", "otp_enabled", "date_joined", "last_login", "stats", "xp_points"
            ]
        extra_kwargs = {
            "avatar": {"write_only": True, "required": False},  # #18 : déplacé de la méthode get_stats() vers Meta où il doit être
        }

    def update(self, instance, validated_data):
        student_profile_data = validated_data.pop('student_profile', None)
        
        # Update User
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update or Create StudentProfile
        if student_profile_data:
            from .models import StudentProfile
            profile, created = StudentProfile.objects.get_or_create(user=instance)
            for attr, value in student_profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        return instance

    def get_stats(self, obj):
        from learning.models import Enrollment, Certificate, UserLessonProgress
        courses_completed = Enrollment.objects.filter(user=obj, is_completed=True).count()
        certificates = Certificate.objects.filter(user=obj).count()
        lessons_completed = UserLessonProgress.objects.filter(user=obj, is_completed=True).count()  # #17 : ajout de is_completed=True
        
        # Simulation d'heures (30 mins par leçon en moyenne)
        learning_hours = round(lessons_completed * 0.5, 1)
        
        # Système de points (XP)
        points = obj.xp_points
        level_number = (points // 1000) + 1
        
        return {
            "coursesCompleted": courses_completed,
            "certificates": certificates,
            "learningHours": learning_hours,
            "points": points,
            "levelNumber": level_number
        }

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def get_is_instructor(self, obj):
        # Vérifier le champ direct du modèle EN PRIORITÉ, puis l'application approuvée
        if getattr(obj, 'is_instructor', False):
            return True
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
        fields = ["id","username","full_name","avatar_url","bio","linkedin_url","github_url","portfolio_url", "level","date_joined"]

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def get_full_name(self, obj):
        return obj.get_full_name()



class InstructorApplicationSerializer(serializers.ModelSerializer):
    """
    Utilisé par le formulaire public de candidature.
    Pas besoin d'être connecté.
    """
    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)
    email = serializers.EmailField(required=True, write_only=True)

    class Meta:
        model = InstructorApplication
        fields = [
            "id", "first_name", "last_name", "email",
            "cv_file", "cv_url", "linkedin_url", "portfolio_url", "website_url",
            "expertise", "expertise_detail", "motivation", "teaching_experience",
        ]
        read_only_fields = ["id"]
 
    def validate_email(self, value):
        email = value.strip().lower()
 
        #  Vérifier si une candidature existe déjà 
        existing = InstructorApplication.objects.filter(user__email=email).first()
        if existing:
            if existing.status == InstructorApplication.STATUS_APPROVED:
                raise serializers.ValidationError(
                    "Cet email est déjà associé à un compte instructeur."
                )
            if existing.status in [
                InstructorApplication.STATUS_PENDING,
                InstructorApplication.STATUS_REVIEWING,
            ]:
                raise serializers.ValidationError(
                    "Une candidature est déjà en cours d'examen pour cet email."
                )
            # Statut rejected → on autorise une nouvelle candidature
            # (on mettra à jour l'existante ou on en crée une nouvelle)
 
        return email
 
    def validate(self, attrs):
        # Au moins CV fichier ou URL LinkedIn
        if not attrs.get("cv_file") and not attrs.get("cv_url") and not attrs.get("linkedin_url"):
            raise serializers.ValidationError(
                "Fournis au moins un CV (fichier ou URL) ou ton profil LinkedIn."
            )
        return attrs
 
    def create(self, validated_data):
        email = validated_data["email"]
 
        # Si une candidature rejetée existe, on la réutilise
        try:
            existing = InstructorApplication.objects.get(
                user__email=email, status=InstructorApplication.STATUS_REJECTED
            )
            for attr, value in validated_data.items():
                setattr(existing, attr, value)
            existing.status = InstructorApplication.STATUS_PENDING
            existing.rejection_reason = ""
            existing.reviewed_by = None
            existing.reviewed_at = None
            existing.save()
            return existing
        except InstructorApplication.DoesNotExist:
            pass
 
        # Récupérer ou créer l'utilisateur
        user = User.objects.filter(email=email).first()
        if not user:
            # Créer un compte inactif
            import secrets
            username = email.split('@')[0] + secrets.token_hex(2)
            user = User.objects.create(
                email=email,
                username=username,
                first_name=validated_data.get("first_name", ""),
                last_name=validated_data.get("last_name", ""),
                is_active=False,
                email_verified=False
            )
        
        # Supprimer les champs qui ne sont pas dans le modèle InstructorApplication
        validated_data.pop("email", None)
        validated_data.pop("first_name", None)
        validated_data.pop("last_name", None)
        
        # Créer la candidature
        application = InstructorApplication.objects.create(
            user=user,
            **validated_data
        )
        return application
 
 
# Candidature
 
class InstructorApplicationStatusSerializer(serializers.ModelSerializer):
    """Retourné au candidat pour suivre l'état de sa candidature."""
    status_display = serializers.CharField(source="get_status_display", read_only=True)
 
    class Meta:
        model  = InstructorApplication
        fields = [
            "id", "status", "status_display",
            "submitted_at", "reviewed_at",
            "rejection_reason",  # uniquement si rejected
        ]
 
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Ne pas exposer le motif si pas refusé ou modifications demandées
        if instance.status not in [InstructorApplication.STATUS_REJECTED, InstructorApplication.STATUS_CHANGES_REQUESTED]:
            data.pop("rejection_reason", None)
        return data
 
 
# Candidature — admin 
 
class InstructorApplicationAdminSerializer(serializers.ModelSerializer):
    """Vue complète pour l'équipe MLAcademy."""
    status_display   = serializers.CharField(source="get_status_display", read_only=True)
    expertise_display = serializers.CharField(source="get_expertise_display", read_only=True)
    reviewed_by_name = serializers.SerializerMethodField()
 
    class Meta:
        model = InstructorApplication
        fields = "__all__"
 
    def get_reviewed_by_name(self, obj):
        if obj.reviewed_by:
            return obj.reviewed_by.get_full_name() or obj.reviewed_by.email
        return None
 
 
#Actions admin : approuver / refuser
 
class ApproveApplicationSerializer(serializers.Serializer):
    application_id = serializers.IntegerField()
 
    def validate_application_id(self, value):
        try:
            app = InstructorApplication.objects.get(pk=value)
        except InstructorApplication.DoesNotExist:
            raise serializers.ValidationError("Candidature introuvable.")
        if app.status == InstructorApplication.STATUS_APPROVED:
            raise serializers.ValidationError("Cette candidature est déjà approuvée.")
        return value
 
 
class RejectApplicationSerializer(serializers.Serializer):
    application_id = serializers.IntegerField()
    reason = serializers.CharField(min_length=20, max_length=1000)
 
    def validate_application_id(self, value):
        try:
            InstructorApplication.objects.get(pk=value)
        except InstructorApplication.DoesNotExist:
            raise serializers.ValidationError("Candidature introuvable.")
        return value
 
 
# Activation du compte instructeur
 
class InstructorActivationSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(min_length=8)
    password_confirm = serializers.CharField(min_length=8)
 
    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password": "Les mots de passe ne correspondent pas."}
            )
        return attrs
 
    def validate_token(self, value):
        from django.utils import timezone
        try:
            app = InstructorApplication.objects.get(
                activation_token=value,
                status=InstructorApplication.STATUS_APPROVED,
            )
        except InstructorApplication.DoesNotExist:
            raise serializers.ValidationError("Token d'activation invalide.")
 
        if app.activation_expires_at and app.activation_expires_at < timezone.now():
            raise serializers.ValidationError(
                "Ce lien d'activation a expiré. Contacte support@mlacademy.io."
            )
 
        return value


class InstructorProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField(read_only=True)
    banner_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = InstructorProfile
        fields = [
            "id", "headline", "bio", "avatar", "avatar_url", 
            "banner", "banner_url", "github_url", "linkedin_url", 
            "portfolio_url", "twitter_url", "updated_at"
        ]
        read_only_fields = ["id", "updated_at"]

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def get_banner_url(self, obj):
        request = self.context.get("request")
        if obj.banner and request:
            return request.build_absolute_uri(obj.banner.url)
        return None

