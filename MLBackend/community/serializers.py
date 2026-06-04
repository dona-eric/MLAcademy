from rest_framework import serializers
from .models import Company, JobOffer, JobApplication, Category, Channel, ChannelMessage
from django.contrib.auth import get_user_model

User = get_user_model()

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'description', 'website', 'logo', 'location', 'is_verified']

class JobOfferSerializer(serializers.ModelSerializer):
    company_name = serializers.ReadOnlyField(source='company.name')
    company_logo = serializers.SerializerMethodField()

    class Meta:
        model = JobOffer
        fields = [
            'id', 'company', 'company_name', 'company_logo', 'title', 
            'description', 'requirements', 'location', 'contract_type', 
            'salary_range', 'posted_at', 'deadline'
        ]

    def get_company_logo(self, obj):
        if obj.company.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.company.logo.url)
        return None

class TalentProfileSerializer(serializers.ModelSerializer):
    """
    Serializer pour exposer le profil d'un talent (étudiant) aux recruteurs.
    """
    stats = serializers.SerializerMethodField()
    fullName = serializers.SerializerMethodField()
    headline = serializers.SerializerMethodField()
    rank = serializers.SerializerMethodField()
    skills = serializers.SerializerMethodField()
    certificates = serializers.SerializerMethodField()
    projects = serializers.SerializerMethodField()
    joinedAt = serializers.SerializerMethodField()
    xpPoints = serializers.SerializerMethodField()
    avatarUrl = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'fullName', 'avatarUrl', 'headline', 'bio', 'linkedin_url',
            'github_url', 'portfolio_url', 'level', 'stats', 'rank', 'skills', 
            'certificates', 'projects', 'joinedAt', 'xpPoints'
        ]

    def get_avatarUrl(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
        return None

    def get_fullName(self, obj):
        return obj.get_full_name()

    def get_headline(self, obj):
        level_map = {"beginner": "Débutant", "intermediate": "Intermédiaire", "advanced": "Avancé"}
        return f"Talent {level_map.get(obj.level, 'Débutant')} en IA & Machine Learning"

    def get_joinedAt(self, obj):
        return obj.date_joined.strftime("%B %Y")

    def get_skills(self, obj):
        if obj.level == "advanced":
            return ["Python", "PyTorch", "Hugging Face", "MLOps", "Docker"]
        elif obj.level == "intermediate":
            return ["Python", "Scikit-Learn", "Pandas", "SQL"]
        return ["Python", "Data Analysis", "Maths"]

    def get_certificates(self, obj):
        from learning.models import Certificate
        certs = Certificate.objects.filter(user=obj)
        return [{
            "id": str(c.id),
            "title": c.course.title if c.course else (c.learning_path.title if c.learning_path else "Certificat"),
            "issuer": "MLAcademy",
            "issuedAt": c.issued_at.strftime("%B %Y") if hasattr(c, 'issued_at') else "2026"
        } for c in certs]

    def get_projects(self, obj):
        return [
            {
                "id": "p1",
                "title": "Aide-Diagnostic Médical par Vision",
                "description": "Entraînement d'un modèle ResNet pour détecter des anomalies.",
                "techStack": ["PyTorch", "Torchvision", "FastAPI"],
                "githubUrl": obj.github_url or "https://github.com",
                "demoUrl": None
            }
        ]

    def get_rank(self, obj):
        return 1

    def get_xpPoints(self, obj):
        return self.get_stats(obj)["points"]

    def get_stats(self, obj):
        from learning.models import Enrollment, Certificate, UserLessonProgress
        courses_completed = Enrollment.objects.filter(user=obj, is_completed=True).count()
        certificates = Certificate.objects.filter(user=obj).count()
        lessons_completed = UserLessonProgress.objects.filter(user=obj).count()
        points = (certificates * 500) + (courses_completed * 200) + (lessons_completed * 10)
        
        return {
            "coursesCompleted": courses_completed,
            "certificates": certificates,
            "points": points
        }

class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.ReadOnlyField(source='job.title')
    company_name = serializers.ReadOnlyField(source='job.company.name')

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'company_name', 'cover_letter', 
            'cv_url', 'status', 'applied_at'
        ]
        read_only_fields = ['status', 'applied_at']

class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ['id', 'category', 'name', 'description', 'channel_type', 'icon', 'order', 'is_private', 'created_at']

class CategorySerializer(serializers.ModelSerializer):
    channels = ChannelSerializer(many=True, read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'order', 'channels']

class ChannelMessageSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    user_avatar = serializers.SerializerMethodField()
    is_mentor = serializers.ReadOnlyField(source='user.is_mentor')

    class Meta:
        model = ChannelMessage
        fields = ['id', 'channel', 'user', 'user_name', 'user_avatar', 'is_mentor', 'title', 'content', 'parent', 'is_pinned', 'created_at']

    def get_user_avatar(self, obj):
        if obj.user.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.user.avatar.url)
        return None
