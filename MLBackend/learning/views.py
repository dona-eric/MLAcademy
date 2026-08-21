import os
from datetime import timedelta
import httpx
from django.shortcuts import get_object_or_404
from django.db import models
from django.db.models import Avg
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import permissions, status, viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import ProjectSubmission, Review, UserLessonProgress, UserNote, QuizQuestion, UserCodeSubmission, UserQuizAttempt, Enrollment, PathEnrollment, Certificate, SkillBadge, UserBadge
from .permissions import IsAuthorizedReviewer
from courses.models import Lesson, Course, LearningPath
from .serializers import UserLessonProgressSerializer, UserNoteSerializer, QuizQuestionSerializer, QuizSubmissionSerializer, UserCodeSubmissionSerializer, EnrollmentSerializer, ProjectSubmissionSerializer, ReviewSerializer, PathEnrollmentSerializer, CertificateSerializer, CertificatePublicVerifySerializer, NotificationSerializer, SkillBadgeSerializer, UserBadgeSerializer
from users.models import Notification, Message


# ═════════════════════════════════════════════
#  NOTIFICATIONS MANAGEMENT
# ═════════════════════════════════════════════

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour gérer et acquitter les notifications de l'utilisateur connecté."""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=['is_read'])
        return Response({'status': 'notification marquée comme lue'})

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'toutes les notifications marquées comme lues'})


# ═════════════════════════════════════════════
#  DASHBOARD SUMMARY
# ═════════════════════════════════════════════

class DashboardSummaryView(APIView):
    """Vue agrégée pour alimenter l'ensemble des widgets du tableau de bord étudiant."""
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60 * 15))  # Mise en cache de 15 minutes
    def get(self, request):
        user = request.user

        # 1. Inscriptions actives (Optimisation via select_related)
        course_enrollments = Enrollment.objects.filter(user=user, is_completed=False).select_related('course')
        path_enrollments = PathEnrollment.objects.filter(user=user, is_completed=False).select_related('learning_path')
        
        # 2. Certificats
        certificates = Certificate.objects.filter(user=user).order_by('-issued_at')
        
        # 3. Calcul des échéances dynamiques (simulation basée sur le rythme hebdomadaire)
        deadlines = []
        now = timezone.now()
        for enr in course_enrollments:
            days_since_start = (now - enr.enrolled_at).days
            expected_module = (days_since_start // 7) + 1
            
            deadlines.append({
                "id": f"course-{enr.id}",
                "title": f"Quiz Hebdo : {enr.course.title}",
                "course": enr.course.title,
                "date": enr.enrolled_at + timedelta(days=expected_module * 7),
                "type": "quiz",
                "priority": "high" if enr.progress_percentage < (expected_module * 10) else "medium"
            })

        # 4. Statistiques réelles de performance
        avg_score = UserQuizAttempt.objects.filter(user=user).aggregate(Avg('score'))['score__avg'] or 0
        
        # Calcul de l'assiduité (Série / Streak de jours actifs consécutifs)
        active_days = UserLessonProgress.objects.filter(user=user) \
            .annotate(date=TruncDate('updated_at')) \
            .values_list('date', flat=True) \
            .distinct().order_by('-date')
        
        streak = 0
        if active_days:
            current_date = now.date()
            if active_days[0] in (current_date, current_date - timedelta(days=1)):
                streak = 1
                for i in range(len(active_days) - 1):
                    if active_days[i] - active_days[i+1] == timedelta(days=1):
                        streak += 1
                    else:
                        break
        
        # 5. Flux de messagerie et notifications non lues
        recent_notifications = Notification.objects.filter(user=user, is_read=False)[:5]
        unread_messages_count = Message.objects.filter(recipient=user, is_read=False).count()

        return Response({
            "user": {
                "first_name": user.first_name,
                "username": user.username,
            },
            "active_courses": EnrollmentSerializer(course_enrollments, many=True, context={'request': request}).data,
            "active_paths": PathEnrollmentSerializer(path_enrollments, many=True, context={'request': request}).data,
            "certificates_count": certificates.count(),
            "latest_certificates": CertificateSerializer(certificates[:3], many=True).data,
            "user_badges": UserBadgeSerializer(UserBadge.objects.filter(user=user).select_related('badge').order_by('-granted_at')[:3], many=True).data,
            "deadlines": deadlines[:4],
            "stats": {
                "avg_quiz_score": int(avg_score),
                "streak_days": streak,
                "unread_messages": unread_messages_count,
                "total_points": user.xp_points,
                "level_number": (user.xp_points // 1000) + 1
            },
            "notifications": [
                {"id": n.id, "title": n.title, "type": n.type, "created_at": n.created_at} 
                for n in recent_notifications
            ]
        })


# ═════════════════════════════════════════════
#  ENROLLMENT CONTROLLERS (Cours & Parcours)
# ═════════════════════════════════════════════

class EnrollView(APIView):
    """Gestion des inscriptions et désinscriptions à un cours individuel avec contrôle des prérequis."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_slug):
        course = get_object_or_404(Course, slug=course_slug, is_published=True)

        can_access, missing = course.check_prerequisites(request.user)
        if not can_access:
            return Response({
                "error": "Vous devez d'abord terminer les cours prérequis.",
                "missing_courses": [{"id": c.id, "title": c.title, "slug": c.slug} for c in missing]
            }, status=status.HTTP_403_FORBIDDEN)

        enrollment, created = Enrollment.objects.get_or_create(user=request.user, course=course)
        if not created:
            return Response({"detail": "Vous êtes déjà inscrit à ce cours."}, status=status.HTTP_200_OK)
            
        Course.objects.filter(pk=course.pk).update(enrolled_count=models.F('enrolled_count') + 1)

        # #9 : Création d'une Transaction pour les cours payants
        if course.price and float(course.price) > 0:
            from management.models import Transaction
            Transaction.objects.create(
                user=request.user,
                course=course,
                amount=course.price,
                status='completed'
            )
        
        serializer = EnrollmentSerializer(enrollment, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, course_slug):
        course = get_object_or_404(Course, slug=course_slug)
        enrollment = get_object_or_404(Enrollment, user=request.user, course=course)
        enrollment.delete()
        
        Course.objects.filter(pk=course.pk).update(enrolled_count=models.Case(
            models.When(enrolled_count__gt=0, then=models.F('enrolled_count') - 1),
            default=0
        ))
        return Response(status=status.HTTP_204_NO_CONTENT)


class PathEnrollView(APIView):
    """Inscription et consultation de la progression sur un parcours de certification complet."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, path_slug):
        learning_path = get_object_or_404(LearningPath, slug=path_slug, is_published=True)

        path_enrollment, created = PathEnrollment.objects.get_or_create(user=request.user, learning_path=learning_path)
        if not created:
            return Response({"detail": "Vous êtes déjà inscrit à ce parcours."}, status=status.HTTP_200_OK)

        path_enrollment.auto_enroll_courses()
        LearningPath.objects.filter(pk=learning_path.pk).update(enrolled_count=models.F('enrolled_count') + 1)

        serializer = PathEnrollmentSerializer(path_enrollment, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request, path_slug):
        learning_path = get_object_or_404(LearningPath, slug=path_slug)
        path_enrollment = get_object_or_404(PathEnrollment, user=request.user, learning_path=learning_path)
        
        # Sérialisation directe sans recalcul forcé en GET (l'état est déjà synchronisé en DB)
        serializer = PathEnrollmentSerializer(path_enrollment, context={'request': request})
        return Response(serializer.data)


class MyCoursesView(APIView):
    """Retourne la liste des cours de l'étudiant avec leur état d'avancement."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        enrollments = Enrollment.objects.filter(user=request.user).select_related('course')
        serializer = EnrollmentSerializer(enrollments, many=True, context={'request': request})
        return Response(serializer.data)


class MyPathsView(APIView):
    """Retourne l'ensemble des parcours de certification suivis par l'étudiant."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        path_enrollments = PathEnrollment.objects.filter(user=request.user).select_related('learning_path')
        serializer = PathEnrollmentSerializer(path_enrollments, many=True, context={'request': request})
        return Response(serializer.data)


class MyCertificatesView(APIView):
    """Historique des diplômes et attestations d'études obtenus par l'étudiant."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        certificates = Certificate.objects.filter(user=request.user).order_by('-issued_at')
        serializer = CertificateSerializer(certificates, many=True)
        return Response(serializer.data)


class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour la vérification publique et la gestion des certificats."""
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    lookup_field = 'certificate_id'

    def get_permissions(self):
        if self.action in ['verify', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny], url_path='verify')
    def verify(self, request, certificate_id=None):
        """Vérification publique de l'authenticité d'un certificat."""
        cert = get_object_or_404(Certificate, certificate_id=certificate_id)
        
        # S'assurer que le PDF est généré si pas encore présent
        if not cert.pdf_file:
            from .certificates import build_certificate_pdf
            build_certificate_pdf(cert)

        serializer = CertificatePublicVerifySerializer(cert, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny], url_path='download')
    def download(self, request, certificate_id=None):
        """Téléchargement direct du fichier PDF du certificat."""
        from django.http import FileResponse, Http404
        cert = get_object_or_404(Certificate, certificate_id=certificate_id)
        
        if not cert.pdf_file:
            from .certificates import build_certificate_pdf
            build_certificate_pdf(cert)

        if cert.pdf_file and os.path.exists(cert.pdf_file.path):
            response = FileResponse(open(cert.pdf_file.path, 'rb'), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{cert.certificate_id}.pdf"'
            return response
        raise Http404("Fichier PDF introuvable.")



# ═════════════════════════════════════════════
#  LESSON PROGRESS & USER NOTES
# ═════════════════════════════════════════════

class LessonProgressView(APIView):
    """Met à jour le timecode de lecture ou valide le visionnage d'une leçon."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)

        # #28 : Vérification que l'utilisateur est bien inscrit au cours parent
        is_enrolled = Enrollment.objects.filter(
            user=request.user,
            course__course_modules__module=lesson.module
        ).exists()
        if not is_enrolled:
            return Response(
                {"error": "Vous devez être inscrit au cours pour enregistrer votre progression."},
                status=status.HTTP_403_FORBIDDEN
            )

        progress, _ = UserLessonProgress.objects.get_or_create(user=request.user, lesson=lesson)

        is_completed = request.data.get('is_completed')
        last_watched_position = request.data.get('last_watched_position')

        if last_watched_position is not None:
            progress.last_watched_position = last_watched_position
            progress.save(update_fields=['last_watched_position'])

        # #5 : On passe systématiquement par mark_as_complete() pour assurer
        # la mise à jour atomique de completed_at et le déclenchement correct des signaux XP
        if is_completed:
            progress.mark_as_complete()
        elif is_completed is False and progress.is_completed:
            # Permet la dé-validation si nécessaire
            progress.is_completed = False
            progress.completed_at = None
            progress.save(update_fields=['is_completed', 'completed_at'])

        # Cascade : mise à jour de la progression globale du cours
        enrollment = Enrollment.objects.filter(
            user=request.user, course__course_modules__module=lesson.module
        ).first()
        if enrollment:
            enrollment.update_progress()

        serializer = UserLessonProgressSerializer(progress)
        return Response(serializer.data)


class LessonNoteViewSet(viewsets.ModelViewSet):
    """CRUD complet pour les notes personnelles prises en cours de lecture vidéo."""
    serializer_class = UserNoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserNote.objects.filter(user=self.request.user, lesson_id=self.kwargs.get('lesson_id'))

    def perform_create(self, serializer):
        lesson = get_object_or_404(Lesson, pk=self.kwargs.get('lesson_id'))
        serializer.save(user=self.request.user, lesson=lesson)


# ═════════════════════════════════════════════
#  QUIZ SYSTEM (Validation Théorique)
# ═════════════════════════════════════════════

class LessonQuizView(APIView):
    """Consultation et soumission sécurisée des réponses aux questionnaires de validation."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        questions = QuizQuestion.objects.filter(lesson=lesson).prefetch_related('choices')
        serializer = QuizQuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def post(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        MAX_ATTEMPTS = 3

        attempts_count = UserQuizAttempt.objects.filter(user=request.user, lesson=lesson).count()
        if attempts_count >= MAX_ATTEMPTS:
            return Response(
                {"error": f"Vous avez épuisé vos {MAX_ATTEMPTS} tentatives pour ce quiz."},
                status=status.HTTP_403_FORBIDDEN
            )

        submission_serializer = QuizSubmissionSerializer(data=request.data)
        submission_serializer.is_valid(raise_exception=True)
        answers = submission_serializer.validated_data['answers']

        # Optimisation majeure : utilisation du prefetch_related pour éviter le N+1 SQL dans la boucle
        questions = QuizQuestion.objects.filter(lesson=lesson).prefetch_related('choices')
        if not questions.exists():
            return Response({"error": "Cette leçon n'a pas de quiz."}, status=status.HTTP_400_BAD_REQUEST)

        correct_count = 0
        total_questions = questions.count()
        results = []

        for q in questions:
            user_choice_id = answers.get(str(q.id)) or answers.get(q.id)
            
            # Recherche filtrée en mémoire Python via le cache du prefetch
            correct_choice = next((c for c in q.choices.all() if c.is_correct), None)
            is_correct = (correct_choice is not None and user_choice_id == correct_choice.id)

            if is_correct:
                correct_count += 1

            results.append({
                "question_id": q.id,
                "is_correct": is_correct,
                "explanation": getattr(q, 'explanation', "")
            })

        score_percentage = int((correct_count / total_questions) * 100)
        passed = score_percentage >= 85

        UserQuizAttempt.objects.create(user=request.user, lesson=lesson, score=score_percentage, passed=passed)

        if passed:
            progress, _ = UserLessonProgress.objects.get_or_create(user=request.user, lesson=lesson)
            progress.is_completed = True
            progress.save(update_fields=['is_completed'])

            enrollment = Enrollment.objects.filter(user=request.user, course=lesson.module.course).first()
            if enrollment:
                enrollment.update_progress()

        return Response({
            "score": score_percentage,
            "passed": passed,
            "attempts_used": attempts_count + 1,
            "max_attempts": MAX_ATTEMPTS,
            "results": results
        })


# ═════════════════════════════════════════════
#  INTERACTIVE CODE SANDBOX
# ═════════════════════════════════════════════

class LessonCodeSubmissionView(APIView):
    """Sauvegarde et soumission de code source vers le bac à sable d'exécution isolé (Sandbox)."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        submission = UserCodeSubmission.objects.filter(user=request.user, lesson=lesson).first()
        if submission:
            serializer = UserCodeSubmissionSerializer(submission)
            return Response(serializer.data)

        return Response({
            "lesson": lesson.id,
            "code": lesson.starter_code,
            "starter_code": lesson.starter_code,
            "solution_code": lesson.solution_code
        })

    def post(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        code = request.data.get('code')
        if not code:
            return Response({"error": "Le code est requis."}, status=status.HTTP_400_BAD_REQUEST)

        submission, _ = UserCodeSubmission.objects.update_or_create(
            user=request.user, lesson=lesson, defaults={'code': code}
        )

        save_only = request.data.get('save_only', False)
        execution_result = submission.last_result or {}

        if not save_only:
            from django.conf import settings
            sandbox_url = getattr(settings, "SANDBOX_URL", "http://localhost:8000/execute")
            try:
                with httpx.Client() as client:
                    response = client.post(
                        sandbox_url, json={"source_code": code, "language_id": 71}, timeout=25.0
                    )
                    execution_result = response.json() if response.status_code == 200 else {"error": f"Sandbox error: {response.text}"}
            except Exception as e:
                execution_result = {"error": f"Connection to sandbox failed: {str(e)}"}

            submission.last_result = execution_result
            submission.save(update_fields=['last_result', 'updated_at'])

        serializer = UserCodeSubmissionSerializer(submission)
        response_data = serializer.data
        response_data['execution'] = execution_result

        return Response(response_data)


# ═════════════════════════════════════════════
#  PEER REVIEW FLOW (Correction par les Pairs)
# ═════════════════════════════════════════════

class ProjectSubmissionViewSet(viewsets.ModelViewSet):
    """Point de dépôt pour les livrables de fin de module soumis par les étudiants."""
    serializer_class = ProjectSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectSubmission.objects.filter(user=self.request.user).select_related('project')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        submission = self.get_object()
        submission.status = 'pending'
        submission.submitted_at = timezone.now()
        submission.save(update_fields=['status', 'submitted_at'])
        
        # Déclenche l'auto-grading asynchrone via Celery si du code de test existe
        if submission.project.solution_code:
            from .tasks import auto_grade_project_submission
            auto_grade_project_submission.delay(submission.id)
            return Response({"status": "Projet soumis pour évaluation automatique."})
            
        return Response({"status": "Projet soumis pour correction aux pairs."})


class PeerReviewViewSet(viewsets.ViewSet):
    """Gestion de la file d'attente des projets assignés à l'utilisateur pour correction."""
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def to_review(self, request):
        # Correction de la double affectation + ajout select_related pour alléger la sérialisation
        submissions = ProjectSubmission.objects.filter(
            status__in=['pending', 'in_review'],
            reviews__reviewer=request.user,
            reviews__status='assigned'
        ).distinct().select_related('project', 'user')
        
        serializer = ProjectSubmissionSerializer(submissions, many=True)
        return Response(serializer.data)


class SubmitReviewView(generics.CreateAPIView):
    """Soumission finale d'une note chiffrée basée sur la grille d'évaluation du projet."""
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorizedReviewer]

    def perform_create(self, serializer):
        submission = serializer.validated_data['submission']
        
        if submission.user == self.request.user:
            raise generics.ValidationError("Vous ne pouvez pas évaluer votre propre projet.")
        
        if Review.objects.filter(submission=submission, reviewer=self.request.user, status='completed').exists():
            raise generics.ValidationError("Vous avez déjà soumis une évaluation terminée pour ce projet.")
            
        # Nettoyage de l'assignation en attente pour éviter les doublons de lignes historiques
        Review.objects.filter(submission=submission, reviewer=self.request.user, status='assigned').delete()
            
        serializer.save(reviewer=self.request.user, status='completed')


# ═════════════════════════════════════════════
#  AI TUTOR (RAG Integration) & GAMIFICATION
# ═════════════════════════════════════════════

class AiTutorChatView(APIView):
    """Interface de discussion contextuelle avec l'assistant IA basé sur le contenu textuel de la leçon."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        lesson_id = request.data.get('lesson_id')
        conversation = request.data.get('messages', [])

        if not lesson_id:
            return Response({"error": "lesson_id est requis."}, status=status.HTTP_400_BAD_REQUEST)

        lesson = get_object_or_404(Lesson, pk=lesson_id)

        valid_messages = []
        for msg in conversation:
            if isinstance(msg, dict) and msg.get('role') in ('user', 'assistant') and msg.get('content'):
                valid_messages.append({
                    'role': msg['role'],
                    'content': msg['content'][:2000]
                })

        if not valid_messages or valid_messages[-1]['role'] != 'user':
            return Response({"error": "Au moins un message utilisateur est requis."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            from .services.ai_tutor import chat_with_tutor
            reply = chat_with_tutor(lesson, valid_messages)
            return Response({"reply": reply})
        except Exception as e:
            return Response({"error": f"Erreur du Tuteur IA : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserBadgesView(APIView):
    """Récupère l'inventaire des compétences débloquées (badges) et affiche celles en attente de validation."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_badges = UserBadge.objects.filter(user=request.user).select_related('badge')
        obtained_data = UserBadgeSerializer(user_badges, many=True).data

        obtained_badge_ids = user_badges.values_list('badge_id', flat=True)
        locked_badges = SkillBadge.objects.exclude(id__in=obtained_badge_ids)
        locked_data = SkillBadgeSerializer(locked_badges, many=True).data

        return Response({
            "obtained": obtained_data,
            "locked": locked_data,
            "total_obtained": len(obtained_data),
            "total_available": SkillBadge.objects.count(),
        })