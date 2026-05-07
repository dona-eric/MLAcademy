from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
import httpx
import os
from .models import (ProjectSubmission, ProjectPeerReview, UserLessonProgress,
    UserNote, QuizQuestion, QuizChoice, UserCodeSubmission, UserQuizAttempt, Enrollment)
from courses.models import Lesson, Course
from .serializers import (
    UserLessonProgressSerializer, UserNoteSerializer, QuizQuestionSerializer,
    QuizSubmissionSerializer, UserQuizAttemptSerializer, UserCodeSubmissionSerializer,
    EnrollmentSerializer, ProjectSubmissionSerializer, ProjectPeerReviewSerializer
)


class EnrollView(APIView):
    """
    POST /api/learning/enroll/<course_slug>/ → S'inscrire à un cours
    DELETE /api/learning/enroll/<course_slug>/ → Se désinscrire
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_slug):
        course = get_object_or_404(Course, slug=course_slug, is_published=True)
        enrollment, created = Enrollment.objects.get_or_create(
            user=request.user, course=course
        )
        if not created:
            return Response(
                {"detail": "Vous êtes déjà inscrit à ce cours."},
                status=status.HTTP_200_OK
            )
        # Incrémenter le compteur d'inscrits du cours
        Course.objects.filter(pk=course.pk).update(
            enrolled_count=course.enrolled_count + 1
        )
        serializer = EnrollmentSerializer(enrollment, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, course_slug):
        course = get_object_or_404(Course, slug=course_slug)
        enrollment = get_object_or_404(Enrollment, user=request.user, course=course)
        enrollment.delete()
        Course.objects.filter(pk=course.pk).update(
            enrolled_count=max(0, course.enrolled_count - 1)
        )
        return Response(status=status.HTTP_204_NO_CONTENT)


class MyCoursesView(APIView):
    """
    GET /api/learning/my-courses/ → Liste des cours de l'étudiant connecté avec progression
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        enrollments = Enrollment.objects.filter(user=request.user).select_related('course')
        # Mettre à jour la progression avant de renvoyer
        for enrollment in enrollments:
            enrollment.update_progress()
        serializer = EnrollmentSerializer(enrollments, many=True, context={'request': request})
        return Response(serializer.data)



class LessonProgressView(APIView):
    """
    POST /api/learning/lessons/{id}/progress/
    Met à jour la position de la vidéo ou marque la leçon comme terminée (F-05).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        progress, created = UserLessonProgress.objects.get_or_create(
            user=request.user, lesson=lesson
        )

        is_completed = request.data.get('is_completed')
        last_watched_position = request.data.get('last_watched_position')

        if is_completed is not None:
            progress.is_completed = is_completed
        if last_watched_position is not None:
            progress.last_watched_position = last_watched_position

        progress.save()
        serializer = UserLessonProgressSerializer(progress)
        return Response(serializer.data)


class LessonNoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les notes d'une leçon (F-05).
    /api/learning/lessons/{id}/notes/
    """
    serializer_class = UserNoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        lesson_id = self.kwargs.get('lesson_id')
        return UserNote.objects.filter(user=self.request.user, lesson_id=lesson_id)

    def perform_create(self, serializer):
        lesson = get_object_or_404(Lesson, pk=self.kwargs.get('lesson_id'))
        serializer.save(user=self.request.user, lesson=lesson)


class LessonQuizView(APIView):
    """
    GET /api/learning/lessons/{id}/quiz/ : Récupère les questions du quiz.
    POST /api/learning/lessons/{id}/quiz/submit/ : Soumet les réponses et calcule le score.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        questions = QuizQuestion.objects.filter(lesson=lesson)
        serializer = QuizQuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def post(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        
        # Vérifier le nombre de tentatives
        MAX_ATTEMPTS = 3
        attempts_count = UserQuizAttempt.objects.filter(user=request.user, lesson=lesson).count()
        if attempts_count >= MAX_ATTEMPTS:
            return Response(
                {"error": f"Vous avez épuisé vos {MAX_ATTEMPTS} tentatives pour ce quiz."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Validation des réponses via un serializer de données
        submission_serializer = QuizSubmissionSerializer(data=request.data)
        submission_serializer.is_valid(raise_exception=True)
        answers = submission_serializer.validated_data['answers']

        questions = QuizQuestion.objects.filter(lesson=lesson)
        if not questions.exists():
            return Response(
                {"error": "Cette leçon n'a pas de quiz."},
                status=status.HTTP_400_BAD_REQUEST
                )

        correct_count = 0
        total_questions = questions.count()
        results = []

        for q in questions:
            user_choice_id = answers.get(str(q.id)) or answers.get(q.id)
            correct_choice = q.choices.filter(is_correct=True).first()
            is_correct = False
            
            if correct_choice and user_choice_id == correct_choice.id:
                correct_count += 1
                is_correct = True
            
            results.append({
                "question_id": q.id,
                "is_correct": is_correct,
                "explanation": q.explanation if hasattr(q, 'explanation') else ""
            })

        score_percentage = int((correct_count / total_questions) * 100)
        passed = score_percentage >= 85  # Seuil de passage demandé: 85%

        # Enregistrement de la tentative
        attempt = UserQuizAttempt.objects.create(
            user=request.user,
            lesson=lesson,
            score=score_percentage,
            passed=passed
        )

        # Mise à jour automatique de la progression globale si le quiz est réussi
        if passed:
            progress, _ = UserLessonProgress.objects.get_or_create(user=request.user, lesson=lesson)
            progress.is_completed = True
            progress.save()

            # Recalculer la progression globale du cours
            from learning.models import Enrollment
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


class LessonCodeSubmissionView(APIView):
    """
    POST /api/learning/lessons/{id}/code/
    Sauvegarde le code soumis par l'utilisateur pour une leçon (F-06).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        submission = UserCodeSubmission.objects.filter(user=request.user, lesson=lesson).first()
        if submission:
            serializer = UserCodeSubmissionSerializer(submission)
            return Response(serializer.data)
        return Response({})

    def post(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        code = request.data.get('code')
        if not code:
            return Response({"error": "Le code est requis."}, status=status.HTTP_400_BAD_REQUEST)

        # Sauvegarder la soumission
        submission, created = UserCodeSubmission.objects.update_or_create(
            user=request.user, lesson=lesson,
            defaults={'code': code}
        )

        # Exécuter le code via MLSandbox
        sandbox_url = os.getenv("SANDBOX_URL", "http://localhost:8001/execute")
        execution_result = {}
        
        try:
            with httpx.Client() as client:
                response = client.post(
                    sandbox_url,
                    json={
                        "source_code": code,
                        "language_id": 71  # Python 3
                    },
                    timeout=25.0
                )
                if response.status_code == 200:
                    execution_result = response.json()
                else:
                    execution_result = {"error": f"Sandbox error: {response.text}"}
        except Exception as e:
            execution_result = {"error": f"Connection to sandbox failed: {str(e)}"}

        serializer = UserCodeSubmissionSerializer(submission)
        response_data = serializer.data
        response_data['execution'] = execution_result
        
        return Response(response_data)


#  PEER REVIEW VIEWS

class ProjectSubmissionViewSet(viewsets.ModelViewSet):
    """
    CRUD sur les soumissions de projets (Brouillon).
    /api/learning/submissions/
    """
    serializer_class = ProjectSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectSubmission.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Passe le brouillon à 'En attente de correction'."""
        submission = self.get_object()
        submission.status = 'pending'
        submission.submitted_at = timezone.now()
        submission.save()
        return Response({"status": "Projet soumis pour correction aux pairs."})


class PeerReviewViewSet(viewsets.ViewSet):
    """
    /api/learning/peer-reviews/
    """
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def to_review(self, request):
        """Récupère les projets des autres étudiants en attente de correction."""
        submissions = ProjectSubmission.objects.filter(
            status='pending'
        ).exclude(
            user=request.user
        ).exclude(
            peer_reviews__reviewer=request.user
        )
        serializer = ProjectSubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='review')
    def submit_review(self, request, pk=None):
        """Soumet une correction pour une soumission donnée."""
        submission = get_object_or_404(ProjectSubmission, pk=pk)
        
        if submission.user == request.user:
            return Response({"error": "Vous ne pouvez pas corriger votre propre projet."}, status=status.HTTP_400_BAD_REQUEST)

        # Forcer le statut is_approved côté backend selon is_final
        data = request.data.copy()
        score = int(data.get('score', 0))
        required_score = 90 if submission.project.is_final else 70
        data['is_approved'] = score >= required_score

        serializer = ProjectPeerReviewSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(reviewer=request.user, submission=submission)

        # Logique métier: 2 validations = Validé (simplifié pour le POC)
        approved_count = submission.peer_reviews.filter(is_approved=True).count()
        if approved_count >= 2:
            submission.status = 'approved'
            submission.save()

            # Si c'est le projet final, on génère le certificat
            if submission.project.is_final:
                from .models import Certificate
                from django.db.models import Avg
                avg_score = submission.peer_reviews.filter(is_approved=True).aggregate(Avg('score'))['score__avg'] or score
                Certificate.objects.get_or_create(
                    user=submission.user,
                    course=submission.project.module.course,
                    defaults={'final_score': int(avg_score)}
                )

        return Response(serializer.data, status=status.HTTP_201_CREATED)
