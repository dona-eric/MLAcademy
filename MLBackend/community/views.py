from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .models import Company, JobOffer, JobApplication, Category, Channel, ChannelMessage
from .serializers import (CompanySerializer, JobOfferSerializer, TalentProfileSerializer, 
JobApplicationSerializer,ChannelSerializer, CategorySerializer, ChannelMessageSerializer)

User = get_user_model()

class JobOfferViewSet(viewsets.ModelViewSet):
    """
    Gestion des offres d'emploi.
    Public (authentifié) pour la lecture, Recruteur pour la création.
    """
    queryset = JobOffer.objects.filter(is_active=True).order_by('-posted_at')
    serializer_class = JobOfferSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'company__name', 'location']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()] # Devrait être IsRecruiter plus tard
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['post'], url_path='apply')
    def apply(self, request, pk=None):
        job = self.get_object()
        serializer = JobApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, job=job)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TalentHubViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Interface pour les recruteurs (et talents) pour découvrir les profils.
    """
    queryset = User.objects.filter(is_public_profile=True).order_by('-date_joined')
    serializer_class = TalentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'bio', 'level']

    def get_queryset(self):
        # On peut filtrer par niveau (beginner, intermediate, advanced)
        queryset = super().get_queryset()
        level = self.request.query_params.get('level')
        if level:
            queryset = queryset.filter(level=level)
        return queryset

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
    Classement des meilleurs talents basés sur les points XP.
    """
    serializer_class = TalentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        from django.db.models import Count
        return User.objects.filter(is_public_profile=True).annotate(
            cert_count=Count('certificates', distinct=True),
            lesson_count=Count('lesson_progress', distinct=True)
        ).order_by('-cert_count', '-lesson_count')[:100]

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
            return User.objects.filter(is_public_profile=True).order_by('-date_joined') # Placeholder logic
        except JobOffer.DoesNotExist:
            return User.objects.none()

class ChannelViewSet(viewsets.ModelViewSet):
    """
    Gestion des canaux de discussion.
    """
    queryset = Channel.objects.all().order_by('name')
    serializer_class = ChannelSerializer
    permission_classes = [permissions.IsAuthenticated]

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

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Interface pour obtenir la structure des canaux groupés par catégorie.
    """
    queryset = Category.objects.all().prefetch_related('channels').order_by('order')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

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
