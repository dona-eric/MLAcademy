from rest_framework import serializers
from users.models import CustomUser, InstructorApplication
from learning.models import Enrollment
from courses.models import Course
from .models import PlatformSettings, AuditLog, Transaction

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'is_staff', 'is_instructor', 'date_joined', 'last_login']

class AdminInstructorApplicationSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = InstructorApplication
        fields = ['id', 'user', 'user_email', 'user_full_name', 'cv_url', 'cv_file', 'linkedin_url', 
        'portfolio_url', 'motivation', 'expertise','expertise_detail', 'teaching_experience', 'status', 'submitted_at'
        ]

class AdminEnrollmentSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'user_email', 'course', 'course_title', 'enrolled_at', 'progress_percentage', 'is_completed']

class PlatformSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformSettings
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    admin_email = serializers.EmailField(source='admin.email', read_only=True)
    class Meta:
        model = AuditLog
        fields = ['id', 'admin_email', 'action', 'details', 'ip_address', 'created_at']

class TransactionSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    class Meta:
        model = Transaction
        fields = ['id', 'user_email', 'course_title', 'amount', 'status', 'created_at']

class AdminTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login']
        read_only_fields = ['id', 'is_staff', 'is_superuser', 'date_joined', 'last_login']
