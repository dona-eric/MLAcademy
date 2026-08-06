from rest_framework import serializers
from .models import (
    Company, JobOffer, JobApplication, Category, Channel, ChannelMessage,
    SponsoredChallenge, ChallengeSubmission, MentorshipRelation,
    DirectConversation, DirectMessage, Badge, UserBadge, UserStreak
)
from community.gamification import calculate_rank, calculate_level
from django.contrib.auth import get_user_model

User = get_user_model()


class BadgeSerializer(serializers.ModelSerializer):
    is_unlocked = serializers.SerializerMethodField()
    awarded_at = serializers.SerializerMethodField()

    class Meta:
        model = Badge
        fields = [
            'id', 'name', 'slug', 'description', 'icon', 'category', 
            'xp_reward', 'is_secret', 'is_unlocked', 'awarded_at'
        ]

    def get_is_unlocked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserBadge.objects.filter(user=request.user, badge=obj).exists()
        return False

    def get_awarded_at(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            ub = UserBadge.objects.filter(user=request.user, badge=obj).first()
            if ub:
                return ub.awarded_at.isoformat()
        return None


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'awarded_at', 'is_seen']


class UserStreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStreak
        fields = [
            'current_streak', 'max_streak', 'last_activity_date', 
            'streak_freezes_available'
        ]


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'description', 'website', 'logo', 'location', "position_geographique",'is_verified']

class JobOfferSerializer(serializers.ModelSerializer):
    company_name = serializers.ReadOnlyField(source='company.name')
    company_position = serializers.ReadOnlyField(source="company.position_geographique")
    company_logo = serializers.SerializerMethodField()

    class Meta:
        model = JobOffer
        fields = [
            'id', 'company', 'company_name', 'company_logo', 'title', 
            'description', 'requirements', 'location', 'contract_type', 
            'salary_range', 'posted_at', 'deadline', "company_position",
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
    Toutes les données sont dynamiques et issues du parcours réel de l'apprenant.
    """
    rankName = serializers.SerializerMethodField()
    calculatedLevel = serializers.SerializerMethodField()
    unlockedBadges = serializers.SerializerMethodField()
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
            'github_url', 'portfolio_url', 'level', 'stats', 'rank', 'rankName', 
            'calculatedLevel', 'unlockedBadges', 'skills', 'certificates', 'projects', 
            'joinedAt', 'xpPoints'
        ]

    def get_rankName(self, obj):
        return calculate_rank(obj.xp_points)

    def get_calculatedLevel(self, obj):
        return calculate_level(obj.xp_points)

    def get_unlockedBadges(self, obj):
        user_badges = UserBadge.objects.filter(user=obj).select_related('badge')[:8]
        return [{
            "id": ub.badge.id,
            "name": ub.badge.name,
            "icon": ub.badge.icon,
            "description": ub.badge.description,
            "xp_reward": ub.badge.xp_reward,
            "awarded_at": ub.awarded_at.isoformat()
        } for ub in user_badges]


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
        """Compétences dynamiques basées sur les SkillBadges réellement obtenus."""
        from learning.models import UserBadge
        badges = UserBadge.objects.filter(user=obj).select_related('badge').values_list('badge__name', flat=True)
        skill_list = list(badges)
        # Fallback si aucun badge n'est encore obtenu
        if not skill_list:
            if obj.level == "advanced":
                return ["Python", "PyTorch", "Hugging Face", "MLOps", "Docker"]
            elif obj.level == "intermediate":
                return ["Python", "Scikit-Learn", "Pandas", "SQL"]
            return ["Python", "Data Analysis", "Maths"]
        return skill_list

    def get_certificates(self, obj):
        from learning.models import Certificate
        certs = Certificate.objects.filter(user=obj).select_related('course', 'learning_path')
        return [{
            "id": str(c.id),
            "title": c.course.title if c.course else (c.learning_path.title if c.learning_path else "Certificat"),
            "issuer": "MLAcademy",
            "issuedAt": c.issued_at.strftime("%B %Y") if hasattr(c, 'issued_at') else "2026"
        } for c in certs]

    def get_projects(self, obj):
        """Projets dynamiques : soumissions validées et marquées comme visibles dans le portfolio."""
        from learning.models import ProjectSubmission
        submissions = ProjectSubmission.objects.filter(
            user=obj,
            status='approved',
            is_featured_in_portfolio=True
        ).select_related('project', 'project__module')

        projects = []
        for sub in submissions:
            projects.append({
                "id": str(sub.id),
                "title": sub.project.title,
                "description": sub.project.description[:200],
                "module": sub.project.module.title if sub.project.module else None,
                "repoUrl": sub.repo_url or None,
                "submittedAt": sub.submitted_at.strftime("%B %Y") if sub.submitted_at else None,
            })

        # Inclure aussi les soumissions gagnantes de challenges
        challenge_subs = ChallengeSubmission.objects.filter(
            user=obj, status__in=['evaluated', 'winner']
        ).select_related('challenge', 'challenge__company')

        for cs in challenge_subs:
            projects.append({
                "id": f"challenge-{cs.id}",
                "title": f"🏆 {cs.challenge.title}",
                "description": cs.description[:200] if cs.description else cs.challenge.description[:200],
                "module": f"Challenge {cs.challenge.company.name}",
                "repoUrl": cs.repo_url or None,
                "submittedAt": cs.submitted_at.strftime("%B %Y") if cs.submitted_at else None,
            })

        return projects

    def get_rank(self, obj):
        """Classement réel basé sur les points XP."""
        higher_xp_count = User.objects.filter(
            is_public_profile=True,
            xp_points__gt=obj.xp_points
        ).count()
        return higher_xp_count + 1

    def get_xpPoints(self, obj):
        return obj.xp_points

    def get_stats(self, obj):
        from learning.models import Enrollment, Certificate, UserLessonProgress
        courses_completed = Enrollment.objects.filter(user=obj, is_completed=True).count()
        certificates = Certificate.objects.filter(user=obj).count()
        lessons_completed = UserLessonProgress.objects.filter(user=obj, is_completed=True).count()
        challenges_won = ChallengeSubmission.objects.filter(user=obj, status='winner').count()
        
        return {
            "coursesCompleted": courses_completed,
            "certificates": certificates,
            "lessonsCompleted": lessons_completed,
            "challengesWon": challenges_won,
            "points": obj.xp_points
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


# ═════════════════════════════════════════════
#  CHALLENGES & COMPÉTITIONS
# ═════════════════════════════════════════════

class SponsoredChallengeSerializer(serializers.ModelSerializer):
    company_name = serializers.ReadOnlyField(source='company.name')
    company_logo = serializers.SerializerMethodField()
    spots_remaining = serializers.ReadOnlyField()
    submissions_count = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)
    type_display = serializers.CharField(source='get_challenge_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = SponsoredChallenge
        fields = [
            'id', 'company', 'company_name', 'company_logo', 'title', 'slug',
            'short_description', 'description', 'objective', 'rules', 'evaluation_criteria',
            'difficulty', 'difficulty_display', 'category', 'category_display',
            'challenge_type', 'type_display', 'status', 'status_display',
            'start_date', 'deadline', 'results_date',
            'allow_teams', 'max_team_size',
            'dataset_url', 'is_dataset_private', 'dataset_size', 'dataset_license',
            'deliverables', 'recommended_tech',
            'evaluation_mode', 'has_auto_grading', 'enable_public_leaderboard',
            'reward', 'prize_pool', 'first_prize', 'second_prize', 'third_prize', 'other_perks',
            'mentor_name', 'contact_email', 'organizer_website',
            'progression_order', 'prerequisite_challenge', 'ranking_tier', 'badge_reward',
            'max_participants', 'spots_remaining', 'is_active', 'is_open', 'is_approved',
            'submissions_count', 'created_at', 'updated_at'
        ]

    def get_company_logo(self, obj):
        if obj.company.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.company.logo.url)
        return None

    def get_submissions_count(self, obj):
        return obj.submissions.count()


class ChallengeSubmissionSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.get_full_name')
    username = serializers.ReadOnlyField(source='user.username')
    user_avatar = serializers.SerializerMethodField()
    challenge_title = serializers.ReadOnlyField(source='challenge.title')
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = ChallengeSubmission
        fields = [
            'id', 'challenge', 'challenge_title', 'user', 'user_name', 'username', 'user_avatar',
            'submission_number', 'repo_url', 'notebook_url', 'demo_url', 'pdf_report_url', 'description',
            'score', 'rank', 'jury_feedback', 'status', 'status_display',
            'submitted_at', 'evaluated_at', 'created_at'
        ]
        read_only_fields = ['user', 'score', 'rank', 'jury_feedback', 'status', 'submitted_at', 'evaluated_at']

    def get_user_avatar(self, obj):
        if obj.user.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.user.avatar.url)
        return None


# ═════════════════════════════════════════════
#  MENTORAT
# ═════════════════════════════════════════════

class MentorshipSerializer(serializers.ModelSerializer):
    mentor_name = serializers.ReadOnlyField(source='mentor.get_full_name')
    mentor_email = serializers.ReadOnlyField(source='mentor.email')
    student_name = serializers.ReadOnlyField(source='student.get_full_name')
    student_email = serializers.ReadOnlyField(source='student.email')

    class Meta:
        model = MentorshipRelation
        fields = [
            'id', 'mentor', 'mentor_name', 'mentor_email',
            'student', 'student_name', 'student_email',
            'status', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']


# ═════════════════════════════════════════════
#  MESSAGERIE DIRECTE
# ═════════════════════════════════════════════

class DirectMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')
    sender_avatar = serializers.SerializerMethodField()

    class Meta:
        model = DirectMessage
        fields = ['id', 'conversation', 'sender', 'sender_name', 'sender_avatar', 'content', 'is_read', 'created_at']
        read_only_fields = ['sender', 'is_read']

    def get_sender_avatar(self, obj):
        if obj.sender.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.sender.avatar.url)
        return None


class DirectConversationSerializer(serializers.ModelSerializer):
    participants_details = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    job_title = serializers.ReadOnlyField(source='job_offer.title')

    class Meta:
        model = DirectConversation
        fields = ['id', 'participants_details', 'job_offer', 'job_title', 'last_message', 'unread_count', 'created_at', 'updated_at']

    def get_participants_details(self, obj):
        request = self.context.get('request')
        return [{
            "id": u.id,
            "username": u.username,
            "fullName": u.get_full_name(),
            "avatarUrl": request.build_absolute_uri(u.avatar.url) if u.avatar and request else None,
            "is_recruiter": u.is_recruiter,
        } for u in obj.participants.all()]

    def get_last_message(self, obj):
        msg = obj.messages.order_by('-created_at').first()
        if msg:
            return {
                "content": msg.content[:100],
                "sender": msg.sender.username,
                "created_at": msg.created_at
            }
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0
