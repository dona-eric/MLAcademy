from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.db.models import Avg, Count, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from users.models import CustomUser, InstructorApplication, Notification, Message
from courses.models import Course, LearningPath
from learning.models import Enrollment, Certificate, ProjectSubmission
from .models import PlatformSettings, AuditLog, Transaction
from .serializers import (AdminInstructorApplicationSerializer,AdminEnrollmentSerializer,AdminUserSerializer,
    PlatformSettingsSerializer,AuditLogSerializer,TransactionSerializer, AdminTeamSerializer)

class PlatformSettingsView(APIView):
    """
    Gestion des paramètres de la plateforme.
    GET: Public (Branding)
    PATCH: Admin Only (Update)
    """
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request):
        settings = PlatformSettings.get_settings()
        serializer = PlatformSettingsSerializer(settings)
        return Response(serializer.data)

    def patch(self, request):
        settings = PlatformSettings.get_settings()
        serializer = PlatformSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AuditLogView(APIView):
    """
    Historique des actions administratives.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        logs = AuditLog.objects.all()[:100]
        serializer = AuditLogSerializer(logs, many=True)
        return Response(serializer.data)

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Suivi des revenus.
    """
    permission_classes = [permissions.IsAdminUser]
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class AdminStatsView(APIView):
    """
    Vue panoramique étendue pour le dashboard Crown.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        
        # 1. Chiffres clés (Réels)
        total_students = CustomUser.objects.filter(is_instructor=False, is_staff=False).count()
        total_instructors = CustomUser.objects.filter(is_instructor=True).count()
        total_courses = Course.objects.count()
        total_certificates = Certificate.objects.count()
        
        # 2. Revenus réels (via Transactions)
        total_revenue = Transaction.objects.filter(status='completed').aggregate(Sum('amount'))['amount__sum'] or 0
        monthly_revenue = Transaction.objects.filter(status='completed', created_at__gte=thirty_days_ago).aggregate(Sum('amount'))['amount__sum'] or 0
        
        # 3. Activité Réelle (Inscriptions 30 derniers jours)
        enrollment_stats = Enrollment.objects.filter(enrolled_at__gte=thirty_days_ago) \
            .annotate(date=TruncDate('enrolled_at')) \
            .values('date').annotate(count=Count('id')).order_by('date')
        
        # 4. Distribution par catégorie (Réel)
        category_stats = Course.objects.values('category__name') \
            .annotate(count=Count('id')).order_by('-count')
            
        # 5. Projets & Candidatures en attente
        pending_projects = ProjectSubmission.objects.filter(status='pending').count()
        pending_applications = InstructorApplication.objects.filter(status='pending').count()

        # 6. Admins Connectés (Actifs depuis 15 mins)
        active_admins = CustomUser.objects.filter(
            is_staff=True, 
            last_login__gte=now - timedelta(minutes=15)
        ).values('email', 'first_name', 'last_login')

        # 7. Popular Instructors (Top 5 instructors by enrolled students count)
        popular_instructors = CustomUser.objects.filter(is_instructor=True) \
            .annotate(
                courses_count_ann=Count('courses_taught', distinct=True),
                students_count_ann=Count('courses_taught__enrollments', distinct=True)
            ) \
            .order_by('-students_count_ann')[:5]
            
        popular_instructors_data = []
        for inst in popular_instructors:
            popular_instructors_data.append({
                "id": inst.id,
                "first_name": inst.first_name,
                "last_name": inst.last_name,
                "email": inst.email,
                "avatar_url": inst.avatar.url if inst.avatar else None,
                "courses_count": inst.courses_count_ann,
                "students_count": inst.students_count_ann
            })

        return Response({
            "summary": {
                "total_students": total_students,
                "total_instructors": total_instructors,
                "total_courses": total_courses,
                "total_certificates": total_certificates,
                "total_revenue": float(total_revenue),
                "monthly_revenue": float(monthly_revenue),
                "pending_projects": pending_projects,
                "pending_applications": pending_applications,
            },
            "charts": {
                "enrollments": list(enrollment_stats),
                "categories": list(category_stats),
            },
            "active_admins": list(active_admins),
            "recent_activity": CustomUser.objects.order_by('-date_joined')[:5].values('email', 'first_name', 'date_joined'),
            "popular_instructors": popular_instructors_data
        })

class AdminInstructorApplicationViewSet(viewsets.ModelViewSet):
    """
    Gestion des candidatures instructeurs.
    """
    permission_classes = [permissions.IsAdminUser]
    queryset = InstructorApplication.objects.all()
    serializer_class = AdminInstructorApplicationSerializer

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        application = self.get_object()

        # #11 : On utilise la méthode métier approve() qui génère le token d'activation
        # et l'expiration (7 jours) pour que l'instructeur puisse activer son compte.
        application.approve(reviewed_by=request.user)
        user = application.user

        # Promouvoir l'utilisateur
        user.is_instructor = True
        user.save(update_fields=['is_instructor'])

        # Audit Log
        AuditLog.objects.create(
            admin=request.user,
            action="APPROVE_INSTRUCTOR",
            details=f"Approuvé candidature ID {application.id} pour {user.email}",
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        # Créer une notification interne
        Notification.objects.create(
            user=user,
            title="Candidature Approuvée !",
            content="Félicitations, vous êtes maintenant instructeur sur MLAcademy.",
            type="system"
        )
        
        # Envoyer un email réel de félicitations
        from django.core.mail import send_mail
        from django.conf import settings as django_settings
        try:
            send_mail(
                subject="Félicitations ! Votre candidature instructeur est approuvée",
                message=f"Bonjour {user.first_name},\n\nNous avons le plaisir de vous informer que votre candidature pour devenir instructeur sur MLAcademy a été examinée et approuvée par notre équipe.\n\nVous avez désormais accès à l'Espace Formateur pour créer et gérer vos cours.\n\nBienvenue dans l'équipe pédagogique !\n\nCordialement,\nL'équipe MLAcademy",
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
            )
        except Exception:
            pass

        return Response({"status": "Candidature acceptée, utilisateur promu et email envoyé."})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        reason = request.data.get('reason', 'Critères non remplis.')
        application = self.get_object()
        application.status = 'rejected'
        application.rejection_reason = reason
        application.reviewed_by = request.user
        application.reviewed_at = timezone.now()
        application.save()

        # Audit Log
        AuditLog.objects.create(
            admin=request.user,
            action="REJECT_INSTRUCTOR",
            details=f"Refusé candidature ID {application.id} pour {application.user.email}. Raison: {reason}",
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        # Créer une notification interne
        Notification.objects.create(
            user=application.user,
            title="Suite à votre candidature instructeur",
            content=f"Votre candidature n'a pas pu être retenue pour le motif suivant: {reason}",
            type="system"
        )

        # Envoyer un email réel de refus avec motif
        from django.core.mail import send_mail
        from django.conf import settings as django_settings
        try:
            send_mail(
                subject="Suite à votre candidature instructeur",
                message=f"Bonjour {application.user.first_name},\n\nNous vous remercions de l'intérêt que vous portez à MLAcademy.\n\nAprès un examen minutieux par notre équipe, nous ne pouvons malheureusement pas donner une suite favorable à votre candidature pour le moment.\n\nMotif : {reason}\n\nNous vous encourageons à améliorer votre profil et à retenter votre chance à l'avenir.\n\nCordialement,\nL'équipe MLAcademy",
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[application.user.email],
                fail_silently=True,
            )
        except Exception:
            pass

        return Response({"status": "Candidature refusée et email envoyé."})

class AdminEnrollmentViewSet(viewsets.ModelViewSet):
    """
    Gestion des inscriptions (Révocation d'accès).
    """
    permission_classes = [permissions.IsAdminUser]
    queryset = Enrollment.objects.all().select_related('user', 'course')
    serializer_class = AdminEnrollmentSerializer

    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        enrollment = self.get_object()
        enrollment.delete() # Ou marquer comme inactif si le modèle le permet
        return Response({"status": "Accès révoqué."})

from django.core.mail import send_mail
from django.conf import settings as django_settings

class AdminCommunicationView(APIView):
    """
    Centre de communication : Envoi de messages internes et d'emails réels.
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        mode = request.data.get('mode') # 'message' or 'email'
        target_type = request.data.get('target_type') # 'single', 'students', 'instructors', 'all'
        target_user_id = request.data.get('user_id')
        subject = request.data.get('subject', 'Annonce MLAcademy')
        content = request.data.get('content')

        # 1. Identifier les destinataires
        recipients = CustomUser.objects.all()
        if target_type == 'single' and target_user_id:
            recipients = recipients.filter(id=target_user_id)
        elif target_type == 'students':
            recipients = recipients.filter(is_instructor=False, is_staff=False)
        elif target_type == 'instructors':
            recipients = recipients.filter(is_instructor=True)
        
        # 2. Exécution selon le mode
        if mode == 'message':
            # Créer des messages internes et des notifications
            messages = []
            notifications = []
            for user in recipients:
                messages.append(Message(sender=request.user, recipient=user, subject=subject, body=content))
                notifications.append(Notification(user=user, title=subject, content=content[:100], type='message'))
            
            Message.objects.bulk_create(messages)
            Notification.objects.bulk_create(notifications)
            return Response({"status": f"Message interne envoyé à {len(recipients)} utilisateurs."})

        elif mode == 'email':
            # Envoi d'emails réels via SMTP
            recipient_emails = [u.email for u in recipients]
            try:
                send_mail(
                    subject=subject,
                    message=content,
                    from_email=django_settings.DEFAULT_FROM_EMAIL,
                    recipient_list=recipient_emails,
                    fail_silently=False,
                )
                return Response({"status": f"Email envoyé avec succès à {len(recipient_emails)} destinataires."})
            except Exception as e:
                return Response({"error": f"Erreur SMTP: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"error": "Mode non valide."}, status=status.HTTP_400_BAD_REQUEST)

class AdminTeamViewSet(viewsets.ModelViewSet):
    """
    Gestion de l'équipe administrateur.
    """
    permission_classes = [permissions.IsAdminUser]
    serializer_class = AdminTeamSerializer

    def get_queryset(self):
        return CustomUser.objects.filter(is_staff=True).order_by('-date_joined')

    @action(detail=False, methods=['post'])
    def invite(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "L'email est requis."}, status=status.HTTP_400_BAD_REQUEST)
        
        email = email.lower().strip()
        user = CustomUser.objects.filter(email=email).first()
        
        if user:
            if user.is_staff:
                return Response({"error": "Cet utilisateur est déjà dans l'équipe admin."}, status=status.HTTP_400_BAD_REQUEST)
            if user.is_instructor or not user.is_staff:
                # The user requested specifically to reject if already an instructor or student.
                return Response({"error": "Cet utilisateur existe déjà en tant qu'instructeur ou étudiant. Le matching est refusé."}, status=status.HTTP_400_BAD_REQUEST)
        
        import secrets
        import uuid
        username = email.split('@')[0] + secrets.token_hex(2)
        user = CustomUser.objects.create(
            email=email,
            username=username,
            is_staff=True,
            is_active=False,
            email_verified=False
        )
        # Ensure a verification token is set
        if not user.verification_token:
            user.verification_token = uuid.uuid4()
            user.save(update_fields=['verification_token'])

        activation_link = f"{django_settings.FRONTEND_URL}/admin/activate/?token={user.verification_token}"  # #6 : corrige le shadow import
        
        try:
            send_mail(
                subject="Invitation à rejoindre l'équipe d'administration MLAcademy",
                message=(
                    f"Bonjour,\n\nVous avez été invité à rejoindre l'équipe d'administration de MLAcademy.\n\n"
                    f"Veuillez activer votre compte et définir votre mot de passe via ce lien sécurisé :\n"
                    f"{activation_link}\n\nL'équipe MLAcademy"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            # En cas d'erreur SMTP, on le signale, mais le compte est créé
            pass

        AuditLog.objects.create(
            admin=request.user,
            action="INVITE_ADMIN",
            details=f"Invité {email} dans l'équipe admin",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        user = self.get_object()
        
        if user == request.user:
            return Response({"error": "Vous ne pouvez pas révoquer votre propre accès."}, status=status.HTTP_400_BAD_REQUEST)
        
        if user.is_superuser and not request.user.is_superuser:
            return Response({"error": "Seul un superuser peut révoquer un autre superuser."}, status=status.HTTP_403_FORBIDDEN)

        user.is_staff = False
        user.is_superuser = False
        user.save()

        AuditLog.objects.create(
            admin=request.user,
            action="REVOKE_ADMIN",
            details=f"Révoqué les accès admin de {user.email}",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return Response({"status": "Accès administrateur révoqué avec succès."})
