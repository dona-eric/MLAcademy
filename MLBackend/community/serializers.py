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
    
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'avatar', 'bio', 'linkedin_url',
         'github_url', 'portfolio_url',  'level', 'stats']

    def get_stats(self, obj):
        # Utilise la même logique que UserProfileSerializer
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
        fields = ['id', 'category', 'name', 'description', 'icon', 'order', 'is_private', 'created_at']

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
        fields = ['id', 'channel', 'user', 'user_name', 'user_avatar', 'is_mentor', 'content', 'is_pinned', 'created_at']

    def get_user_avatar(self, obj):
        if obj.user.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.user.avatar.url)
        return None
