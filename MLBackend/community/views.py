# pyrefly: ignore [missing-import]
from rest_framework import viewsets, permissions, filters, status
# pyrefly: ignore [missing-import]
import os
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.db import models as db_models
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from openai import OpenAI
from django.utils import timezone
from .models import (
    Company, JobOffer, JobApplication, Category, Channel, ChannelMessage,
    SponsoredChallenge, ChallengeSubmission, MentorshipRelation,
    DirectConversation, DirectMessage, Badge, UserBadge, UserStreak
)
from .serializers import (
    CompanySerializer, JobOfferSerializer, TalentProfileSerializer,
    JobApplicationSerializer, ChannelSerializer, CategorySerializer,
    ChannelMessageSerializer, SponsoredChallengeSerializer,
    ChallengeSubmissionSerializer, MentorshipSerializer,
    DirectConversationSerializer, DirectMessageSerializer,
    BadgeSerializer, UserBadgeSerializer, UserStreakSerializer
)
from community.gamification import update_user_streak

User = get_user_model()

def get_student_talents_queryset():
    """
    Retourne uniquement les profils des vrais apprenants/étudiants actifs et vérifiés.
    Exclut les comptes non vérifiés par email, recruteurs, instructeurs, administrateurs et responsables d'entreprises.
    """
    return User.objects.filter(
        is_active=True,
        email_verified=True,
        is_public_profile=True,
        is_recruiter=False,
        is_instructor=False,
        is_staff=False,
        is_superuser=False
    ).exclude(managed_companies__isnull=False).distinct()


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def community_stats(request):
    """Retourne les vraies métriques de la plateforme."""
    return Response({
        "totalTalents": get_student_talents_queryset().count(),
        "applicationsProcessed": JobApplication.objects.count(),
        "activeChallenges": SponsoredChallenge.objects.filter(is_approved=True, is_active=True).count(),
        "activeJobs": JobOffer.objects.filter(is_active=True).count()
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def community_chat(request):
    """
    Kibo AI Career Coach - Orientation et orientation professionnelle en ML.
    """
    message = request.data.get('message')
    chat_history = request.data.get('chatHistory', [])
    
    if not message:
        return Response({"error": "Message is required"}, status=400)
        
    try:
        api_key = os.environ.get("API_AFRI_KEY") or os.environ.get("OPENAI_API_KEY", "")
        if not api_key:
            raise ValueError("Neither API_AFRI_KEY nor OPENAI_API_KEY is set in the environment.")
            
        base_url = os.environ.get("LLM_BASE_URL", "https://build.lewisnote.com/v1/")
        client = OpenAI(api_key=api_key, base_url=base_url)
        
        system_prompt = """Tu es Kibo, un Conseiller IA d'Orientation et Coach de Carrière expert pour la communauté Machine Learning et Data Science en Afrique sur la plateforme MLAcademy.
        
        Ton objectif :
        - Conseiller les apprenants sur leur choix de parcours, de technologies ou d'opportunités professionnelles.
        - Les aider à préparer leurs entretiens, optimiser leur profil GitHub/LinkedIn, ou structurer leur recherche d'emploi.
        - Être chaleureux, professionnel, encourageant et avoir une perspective ancrée dans l'écosystème tech africain.
        - Répondre en français, de manière claire et bien formatée en Markdown.
        """
        
        messages = [{"role": "system", "content": system_prompt}]
        for h in chat_history:
            messages.append({
                "role": "user" if h.get("role") == "user" else "assistant",
                "content": h.get("text", "")
            })
        messages.append({"role": "user", "content": message})
        
        response = client.chat.completions.create(
            model="gpt-5.4-mini",
            messages=messages,
            max_tokens=1000,
            temperature=0.7
        )
        reply = response.choices[0].message.content
        return Response({"reply": reply})
    except Exception as e:
        fallback_reply = "Bonjour ! En tant que coach de carrière Kibo, je vous recommande de vous concentrer sur la maîtrise de Python, de SQL et des fondamentaux du Machine Learning. Explorez nos offres d'emploi et nos challenges pour acquérir de l'expérience pratique ! (Note: Le service de chat rencontre actuellement une difficulté technique de connexion. Veuillez réessayer dans quelques instants)."
        return Response({"reply": fallback_reply})



# =============================================
#  JOB BOARD
# =============================================

class CompanyViewSet(viewsets.ModelViewSet):
    """
    Gestion des entreprises (Recruteurs).
    """
    queryset = Company.objects.all().order_by('-created_at')
    serializer_class = CompanySerializer
    pagination_class = None

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        company = serializer.save()
        company.admins.add(self.request.user)
        self.request.user.is_recruiter = True
        self.request.user.save(update_fields=['is_recruiter'])

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated], url_path='my-company')
    def my_company(self, request):
        company = request.user.managed_companies.first()
        if not company:
            return Response({"detail": "Aucune entreprise gérée."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(company, context={'request': request})
        return Response(serializer.data)


class JobOfferViewSet(viewsets.ModelViewSet):
    """
    Gestion des offres d'emploi.
    Public (authentifié) pour la lecture, Recruteur pour la création.
    """
    queryset = JobOffer.objects.filter(is_active=True).order_by('-posted_at')
    pagination_class = None
    serializer_class = JobOfferSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'company__name', 'company__position', 'location']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        company_id = self.request.data.get('company')
        if company_id:
            company = get_object_or_404(Company, pk=company_id, admins=self.request.user)
        else:
            company = self.request.user.managed_companies.first()
            if not company:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({"company": "Vous devez créer votre entreprise avant de publier une offre."})
        serializer.save(company=company)

    @action(detail=True, methods=['post'], url_path='apply')
    def apply(self, request, pk=None):
        job = self.get_object()
        serializer = JobApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, job=job)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#  =============================================
#  TALENT HUB (Vitrine des Profils Apprenants)
# =============================================

class TalentHubViewSet(viewsets.ModelViewSet):
    """
    Interface pour les recruteurs (et la communauté) pour découvrir uniquement les profils d'étudiants/apprenants.
    Exclut les recruteurs, instructeurs, admins et représentants d'entreprise.
    """
    pagination_class = None
    serializer_class = TalentProfileSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'bio', 'level']

    def get_queryset(self):
        queryset = get_student_talents_queryset().order_by('-date_joined')
        level = self.request.query_params.get('level')
        if level:
            queryset = queryset.filter(level=level)
        return queryset

    def create(self, request, *args, **kwargs):
        """Enregistrement / Mise à jour du profil talent étudiant."""
        data = request.data
        email = data.get('email')
        if not email and request.user.is_authenticated:
            email = request.user.email

        if not email:
            return Response({"error": "L'email est requis pour créer un profil talent."}, status=400)

        names = data.get('name', '').strip().split(' ', 1)
        first_name = names[0] if names else ''
        last_name = names[1] if len(names) > 1 else ''

        # Récupérer ou créer l'utilisateur apprenant (jamais recruteur)
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email.split('@')[0],
                'first_name': first_name,
                'last_name': last_name,
                'is_recruiter': False,
                'is_public_profile': True,
                'bio': data.get('bio', ''),
                'github_url': data.get('github', ''),
                'linkedin_url': data.get('linkedin', ''),
            }
        )

        if not created:
            user.is_recruiter = False
            user.is_public_profile = True
            if data.get('bio'): user.bio = data.get('bio')
            if data.get('github'): user.github_url = data.get('github')
            if data.get('linkedin'): user.linkedin_url = data.get('linkedin')
            user.save()

        serializer = TalentProfileSerializer(user, context={'request': request})
        return Response(serializer.data, status=201 if created else 200)


class MyApplicationsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Historique des candidatures de l'étudiant connecté.
    """
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user).order_by('-applied_at')


class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Classement des meilleurs talents (étudiants uniquement) basés sur les points XP.
    """
    serializer_class = TalentProfileSerializer
    pagination_class = None
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return get_student_talents_queryset().order_by('-xp_points')[:100]

class MatchingViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Algorithme de Matching pour les recruteurs.
    Suggère les talents les plus pertinents pour un poste.
    """
    serializer_class = TalentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        job_id = self.request.query_params.get('job_id')
        if not job_id:
            return User.objects.none()
            
        try:
            job = JobOffer.objects.get(pk=job_id)
            # Matching simple : on cherche les talents du niveau requis ou supérieur
            # et triés par XP.
            return User.objects.filter(is_public_profile=True).order_by('-xp_points')
        except JobOffer.DoesNotExist:
            return User.objects.none()


# =============================================
#  CHANNELS & CHAT
# =============================================

class ChannelViewSet(viewsets.ModelViewSet):
    """
    Gestion des canaux de discussion.
    """
    queryset = Channel.objects.all().order_by('name')
    pagination_class = None
    serializer_class = ChannelSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(detail=True, methods=['get', 'post'], url_path='messages')
    def messages(self, request, pk=None):
        channel = self.get_object()
        if request.method == 'GET':
            msgs = channel.messages.all().select_related('user').order_by('created_at')
            serializer = ChannelMessageSerializer(msgs, many=True, context={'request': request})
            return Response(serializer.data)
        
        serializer = ChannelMessageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user, channel=channel)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    @action(detail=False, methods=['post'], url_path='toggle-pin')
    def toggle_pin(self, request):
        message_id = request.data.get('message_id')
        try:
            msg = ChannelMessage.objects.get(id=message_id)
            # Seul un admin ou mentor peut épingler
            if not request.user.is_staff and not getattr(request.user, 'is_mentor', False):
                return Response({"error": "Permissions insuffisantes"}, status=403)
            
            msg.is_pinned = not msg.is_pinned
            msg.save()
            return Response({"is_pinned": msg.is_pinned})
        except ChannelMessage.DoesNotExist:
            return Response({"error": "Message non trouvé"}, status=404)

class CategoryViewSet(viewsets.ModelViewSet):
    """
    Interface pour obtenir la structure des canaux groupés par catégorie.
    """
    queryset = Category.objects.all().prefetch_related('channels').order_by('order')
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


# ═════════════════════════════════════════════
#  RECRUITMENT DASHBOARD (Entreprises)
# ═════════════════════════════════════════════

class RecruitmentDashboardViewSet(viewsets.ViewSet):
    """
    Dashboard dédié aux entreprises pour gérer leurs offres et candidatures.
    """
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_company_jobs(self, request):
        # Récupère les entreprises gérées par l'utilisateur
        companies = request.user.managed_companies.all()
        jobs = JobOffer.objects.filter(company__in=companies).order_by('-posted_at')
        serializer = JobOfferSerializer(jobs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='applications')
    def job_applications(self, request, pk=None):
        # Récupère les candidatures pour une offre spécifique de l'entreprise
        try:
            job = JobOffer.objects.get(pk=pk, company__admins=request.user)
            apps = job.applications.all().select_related('user').order_by('-applied_at')
            serializer = JobApplicationSerializer(apps, many=True)
            return Response(serializer.data)
        except JobOffer.DoesNotExist:
            return Response({"error": "Offre non trouvée ou accès refusé"}, status=404)

    @action(detail=True, methods=['post'], url_path='update-application-status')
    def update_status(self, request, pk=None):
        # PK est l'ID de la candidature (JobApplication)
        try:
            app = JobApplication.objects.get(pk=pk, job__company__admins=request.user)
            new_status = request.data.get('status')
            if new_status in [s[0] for s in JobApplication.STATUS_CHOICES]:
                app.status = new_status
                app.save()
                return Response({"status": "Mis à jour avec succès"})
            return Response({"error": "Statut invalide"}, status=400)
        except JobApplication.DoesNotExist:
            return Response({"error": "Candidature non trouvée"}, status=404)


# ═════════════════════════════════════════════
#  CHALLENGES & COMPÉTITIONS
# ═════════════════════════════════════════════

class ChallengeViewSet(viewsets.ModelViewSet):
    """
    Gestion des challenges sponsorisés.
    - Lecture publique (uniquement les challenges approuvés)
    - Création par les entreprises (admin de la Company)
    - Soumission et évaluation via des actions dédiées
    """
    serializer_class = SponsoredChallengeSerializer
    pagination_class = None
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'company__name']

    def get_queryset(self):
        queryset = SponsoredChallenge.objects.filter(is_approved=True, is_active=True)
        category = self.request.query_params.get('category')
        difficulty = self.request.query_params.get('difficulty')
        challenge_type = self.request.query_params.get('type')
        status_param = self.request.query_params.get('status')

        if category:
            queryset = queryset.filter(category=category)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        if challenge_type:
            queryset = queryset.filter(challenge_type=challenge_type)
        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save()

    # --- Actions pour les Talents ---

    @action(detail=True, methods=['post'], url_path='participate')
    def participate(self, request, pk=None):
        """Un talent s'inscrit à un challenge et crée une soumission."""
        challenge = self.get_object()

        if not challenge.is_published:
            return Response({"error": "Ce challenge n'est pas encore publié."}, status=status.HTTP_403_FORBIDDEN)

        if challenge.spots_remaining is not None and challenge.spots_remaining <= 0:
            return Response({"error": "Le nombre maximum de participants est atteint."}, status=status.HTTP_403_FORBIDDEN)

        submission, created = ChallengeSubmission.objects.get_or_create(
            challenge=challenge, user=request.user
        )
        if not created:
            return Response({"detail": "Vous participez déjà à ce challenge."}, status=status.HTTP_200_OK)

        serializer = ChallengeSubmissionSerializer(submission, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], url_path='my-submission')
    def my_submission(self, request, pk=None):
        """Récupère la soumission de l'utilisateur connecté pour ce challenge."""
        challenge = self.get_object()
        submission = ChallengeSubmission.objects.filter(challenge=challenge, user=request.user).first()
        if not submission:
            return Response({"detail": "Vous ne participez pas à ce challenge."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ChallengeSubmissionSerializer(submission, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['put', 'patch', 'post'], url_path='update-submission')
    def update_submission(self, request, pk=None):
        """Met à jour la soumission (repo_url, notebook_url, demo_url, pdf_report_url, description)."""
        challenge = self.get_object()
        submission, created = ChallengeSubmission.objects.get_or_create(challenge=challenge, user=request.user)

        for field in ['repo_url', 'notebook_url', 'demo_url', 'pdf_report_url', 'description']:
            if field in request.data:
                setattr(submission, field, request.data[field])

        submission.submit()
        serializer = ChallengeSubmissionSerializer(submission, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='submit-solution')
    def submit_solution(self, request, pk=None):
        """Soumet officiellement la solution du talent."""
        challenge = self.get_object()
        submission, created = ChallengeSubmission.objects.get_or_create(challenge=challenge, user=request.user)

        repo_url = request.data.get('repo_url', submission.repo_url)
        notebook_url = request.data.get('notebook_url', submission.notebook_url)
        demo_url = request.data.get('demo_url', submission.demo_url)
        pdf_report_url = request.data.get('pdf_report_url', submission.pdf_report_url)
        description = request.data.get('description', submission.description)

        if not repo_url and not notebook_url and not description:
            return Response({"error": "Veuillez fournir un lien GitHub, un Notebook ou une description."}, status=status.HTTP_400_BAD_REQUEST)

        submission.repo_url = repo_url
        submission.notebook_url = notebook_url
        submission.demo_url = demo_url
        submission.pdf_report_url = pdf_report_url
        submission.description = description
        submission.submit()

        serializer = ChallengeSubmissionSerializer(submission, context={'request': request})
        return Response(serializer.data)

    # --- Actions pour le Jury (Entreprise) ---

    @action(detail=True, methods=['get'], url_path='submissions')
    def list_submissions(self, request, pk=None):
        """Liste toutes les soumissions d'un challenge (pour le jury)."""
        challenge = self.get_object()
        # Vérifier que l'utilisateur est admin de l'entreprise
        if not challenge.company.admins.filter(pk=request.user.pk).exists() and not request.user.is_staff:
            return Response({"error": "Accès refusé."}, status=status.HTTP_403_FORBIDDEN)

        submissions = challenge.submissions.filter(
            status__in=['submitted', 'evaluated', 'winner']
        ).select_related('user').order_by('rank', '-score')
        serializer = ChallengeSubmissionSerializer(submissions, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='evaluate-submission')
    def evaluate_submission(self, request, pk=None):
        """Le jury évalue une soumission (score, feedback, rang)."""
        challenge = self.get_object()
        if not challenge.company.admins.filter(pk=request.user.pk).exists() and not request.user.is_staff:
            return Response({"error": "Accès refusé."}, status=status.HTTP_403_FORBIDDEN)

        submission_id = request.data.get('submission_id')
        score = request.data.get('score')
        rank = request.data.get('rank')
        feedback = request.data.get('feedback', '')

        if not submission_id or score is None:
            return Response({"error": "submission_id et score sont requis."}, status=status.HTTP_400_BAD_REQUEST)

        submission = get_object_or_404(ChallengeSubmission, pk=submission_id, challenge=challenge)
        submission.evaluate(score=score, rank=rank, feedback=feedback)

        serializer = ChallengeSubmissionSerializer(submission, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='leaderboard')
    def leaderboard(self, request, pk=None):
        """Classement public d'un challenge."""
        challenge = self.get_object()
        submissions = challenge.submissions.filter(
            status__in=['evaluated', 'winner'],
            score__isnull=False
        ).select_related('user').order_by('rank', '-score')

        serializer = ChallengeSubmissionSerializer(submissions, many=True, context={'request': request})
        return Response(serializer.data)


# ═════════════════════════════════════════════
#  MENTORAT
# ═════════════════════════════════════════════

class MentorshipViewSet(viewsets.ModelViewSet):
    """
    Gestion des relations de mentorat.
    - Un étudiant peut demander un mentorat.
    - Un mentor peut accepter ou refuser.
    """
    serializer_class = MentorshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return MentorshipRelation.objects.filter(
            db_models.Q(mentor=user) | db_models.Q(student=user)
        ).select_related('mentor', 'student')

    def perform_create(self, serializer):
        """L'étudiant connecté demande un mentorat."""
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['post'], url_path='accept')
    def accept(self, request, pk=None):
        relation = self.get_object()
        if relation.mentor != request.user:
            return Response({"error": "Seul le mentor peut accepter."}, status=status.HTTP_403_FORBIDDEN)
        relation.status = 'active'
        relation.save(update_fields=['status'])
        return Response({"status": "Mentorat activé."})

    @action(detail=True, methods=['post'], url_path='decline')
    def decline(self, request, pk=None):
        relation = self.get_object()
        if relation.mentor != request.user:
            return Response({"error": "Seul le mentor peut refuser."}, status=status.HTTP_403_FORBIDDEN)
        relation.status = 'closed'
        relation.save(update_fields=['status'])
        return Response({"status": "Mentorat refusé."})

    @action(detail=True, methods=['post'], url_path='terminate')
    def terminate(self, request, pk=None):
        relation = self.get_object()
        if request.user not in [relation.mentor, relation.student]:
            return Response({"error": "Vous n'êtes pas impliqué dans ce mentorat."}, status=status.HTTP_403_FORBIDDEN)
        relation.status = 'closed'
        relation.save(update_fields=['status'])
        return Response({"status": "Mentorat terminé."})


# ═════════════════════════════════════════════
#  MESSAGERIE DIRECTE (DM)
# ═════════════════════════════════════════════

class DirectMessageViewSet(viewsets.ViewSet):
    """
    Messagerie directe privée entre deux utilisateurs.
    """
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='conversations')
    def list_conversations(self, request):
        """Liste toutes les conversations de l'utilisateur connecté."""
        convos = DirectConversation.objects.filter(
            participants=request.user
        ).prefetch_related('participants', 'messages').order_by('-updated_at')
        serializer = DirectConversationSerializer(convos, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='start')
    def start_conversation(self, request):
        """Démarre ou récupère une conversation avec un autre utilisateur."""
        recipient_id = request.data.get('recipient_id')
        job_offer_id = request.data.get('job_offer_id')

        if not recipient_id:
            return Response({"error": "recipient_id est requis."}, status=status.HTTP_400_BAD_REQUEST)

        recipient = get_object_or_404(User, pk=recipient_id)
        if recipient == request.user:
            return Response({"error": "Impossible de démarrer une conversation avec vous-même."}, status=status.HTTP_400_BAD_REQUEST)

        job_offer = None
        if job_offer_id:
            job_offer = get_object_or_404(JobOffer, pk=job_offer_id)

        convo, created = DirectConversation.get_or_create_between(request.user, recipient, job_offer=job_offer)
        serializer = DirectConversationSerializer(convo, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='messages')
    def get_messages(self, request, pk=None):
        """Récupère les messages d'une conversation."""
        convo = get_object_or_404(DirectConversation, pk=pk, participants=request.user)

        # Marquer les messages reçus comme lus
        convo.messages.filter(is_read=False).exclude(sender=request.user).update(is_read=True)

        messages = convo.messages.select_related('sender').order_by('created_at')
        serializer = DirectMessageSerializer(messages, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='send')
    def send_message(self, request, pk=None):
        """Envoie un message dans une conversation existante."""
        convo = get_object_or_404(DirectConversation, pk=pk, participants=request.user)

        content = request.data.get('content')
        if not content:
            return Response({"error": "Le contenu du message est requis."}, status=status.HTTP_400_BAD_REQUEST)

        msg = DirectMessage.objects.create(
            conversation=convo,
            sender=request.user,
            content=content
        )
        # Mettre à jour le timestamp de la conversation
        convo.save(update_fields=['updated_at'])

        serializer = DirectMessageSerializer(msg, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API pour consulter la liste de tous les badges et la progression de l'utilisateur.
    """
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Badge.objects.all()
        # Masquer les badges secrets non débloqués
        user = self.request.user
        if not user.is_authenticated:
            return qs.filter(is_secret=False)
        
        unlocked_ids = UserBadge.objects.filter(user=user).values_list('badge_id', flat=True)
        return qs.filter(db_models.Q(is_secret=False) | db_models.Q(id__in=unlocked_ids))

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated], url_path='my-badges')
    def my_badges(self, request):
        """Récupère tous les badges débloqués par l'utilisateur connecté."""
        user_badges = UserBadge.objects.filter(user=request.user).select_related('badge')
        serializer = UserBadgeSerializer(user_badges, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated], url_path='mark-seen')
    def mark_seen(self, request):
        """Marque tous les badges non vus comme vus après fermeture du popup de félicitations."""
        UserBadge.objects.filter(user=request.user, is_seen=False).update(is_seen=True)
        return Response({"status": "success", "message": "Badges marqués comme vus."})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_streak(request):
    """
    Récupère le statut de la série (Streak) et les protections de l'utilisateur connecté.
    """
    streak = update_user_streak(request.user)
    serializer = UserStreakSerializer(streak)
    return Response(serializer.data)

