from django.db.models import Avg, Count, Sum
from django.shortcuts import get_object_or_404
from learning.models import Certificate, ProjectSubmission, Enrollment
from management.models import Transaction
from learning.serializers import ProjectPeerReviewSerializer
from rest_framework import permissions, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Course, Lesson, Module, Project, LearningPath, LearningPathCourse
from .permissions import IsInstructor
from .serializers import (
    InstructorCourseEditSerializer,
    InstructorLearningPathEditSerializer,
    LessonSerializer,
    ModuleSerializer,
    ProjectSerializer,
    CourseListSerializer,
    LearningPathListSerializer
)

class InstructorStatsView(APIView):
    """
    Retourne les statistiques réelles de l'instructeur.
    """
    permission_classes = [IsInstructor]

    def get(self, request):
        user = request.user
        my_courses = Course.objects.filter(instructor=user)
        total_students = Enrollment.objects.filter(course__in=my_courses).values('user').distinct().count()
        total_revenue = Transaction.objects.filter(course__in=my_courses, status='completed').aggregate(Sum('amount'))['amount__sum'] or 0
        active_courses = my_courses.filter(is_published=True).count()
        
        return Response({
            "total_students": total_students,
            "total_revenue": f"{total_revenue} €",
            "active_courses": active_courses,
            "avg_rating": "4.9", # Simulation (Rating system not yet implemented)
            "growth": "+15%",
            "views": total_students * 12
        })


class InstructorCourseViewSet(viewsets.ModelViewSet):
    """
    CRUD pour les cours de l'instructeur connecté.
    """
    permission_classes = [IsInstructor]

    def get_queryset(self):
        return Course.objects.filter(instructor=self.request.user).select_related(
            "category", "instructor"
        )

    def get_serializer_class(self):
        if self.action == "list":
            return CourseListSerializer
        return InstructorCourseEditSerializer

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)


class InstructorModuleViewSet(viewsets.ModelViewSet):
    """
    CRUD pour les modules réutilisables.
    """
    permission_classes = [IsInstructor]
    serializer_class = ModuleSerializer

    def get_queryset(self):
        # Un instructeur peut voir tous ses modules
        return Module.objects.filter(author=self.request.user).prefetch_related("lessons")

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class InstructorLearningPathViewSet(viewsets.ModelViewSet):
    """
    CRUD pour les parcours certifiants (Learning Paths).
    """
    permission_classes = [IsInstructor]

    def get_queryset(self):
        return LearningPath.objects.filter(creator=self.request.user).select_related(
            "category", "creator"
        )

    def get_serializer_class(self):
        if self.action == "list":
            return LearningPathListSerializer
        return InstructorLearningPathEditSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=["post"], url_path="add-course")
    def add_course(self, request, pk=None):
        path = self.get_object()
        course_id = request.data.get("course_id")
        order = request.data.get("order", path.path_courses.count() + 1)
        is_required = request.data.get("is_required", True)

        course = get_object_or_404(Course, pk=course_id, instructor=request.user)

        lp_course, created = LearningPathCourse.objects.get_or_create(
            learning_path=path,
            course=course,
            defaults={"order": order, "is_required": is_required},
        )

        if not created:
            lp_course.order = order
            lp_course.is_required = is_required
            lp_course.save()

        path.update_courses_count()
        return Response(
            {"status": "course added to path", "order": order},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"], url_path="remove-course")
    def remove_course(self, request, pk=None):
        path = self.get_object()
        course_id = request.data.get("course_id")
        lp_course = get_object_or_404(
            LearningPathCourse, learning_path=path, course_id=course_id
        )
        lp_course.delete()
        path.update_courses_count()
        return Response(status=status.HTTP_204_NO_CONTENT)


class InstructorLessonViewSet(viewsets.ModelViewSet):
    """
    CRUD pour les leçons.
    """

    permission_classes = [IsInstructor]
    serializer_class = LessonSerializer

    def get_queryset(self):
        # On limite aux leçons dont le module appartient à l'instructeur
        return Lesson.objects.filter(module__author=self.request.user)


class InstructorProjectViewSet(viewsets.ModelViewSet):
    """
    CRUD pour les projets.
    """

    permission_classes = [IsInstructor]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(module__author=self.request.user)


class InstructorPeerReviewSubmissionSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source="project.title", read_only=True)
    project_is_final = serializers.BooleanField(
        source="project.is_final", read_only=True
    )
    course_title = serializers.CharField(
        source="project.module.course.title", read_only=True
    )
    course_slug = serializers.CharField(
        source="project.module.course.slug", read_only=True
    )
    student_name = serializers.CharField(source="user.get_full_name", read_only=True)
    student_username = serializers.CharField(source="user.username", read_only=True)
    peer_reviews = ProjectPeerReviewSerializer(many=True, read_only=True)

    class Meta:
        model = ProjectSubmission
        fields = ["id","project", "project_title","project_is_final","course_title",
            "course_slug","student_name","student_username","repo_url","code_content",
            "status","submitted_at","peer_reviews","created_at","updated_at",]


class InstructorPeerReviewViewSet(viewsets.ViewSet):
    """
    Espace instructeur pour l'évaluation des projets d'étudiants.
    Les submissions sont limitées aux cours de l'instructeur connecté.
    """
    permission_classes = [IsInstructor]

    def get_queryset(self, request):
        return (
            ProjectSubmission.objects.filter(
                status="pending",
                project__module__course__instructor=request.user).exclude(
                    user=request.user).select_related(
                        "user",
                        "project",
                        "project__module",
                        "project__module__course",
                        ).prefetch_related(
                            "peer_reviews__reviewer"
                            ).order_by("-submitted_at", "-created_at")
        )

    def list(self, request):
        submissions = self.get_queryset(request)
        serializer = InstructorPeerReviewSubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        submission = get_object_or_404(
            ProjectSubmission,
            pk=pk,
            project__module__course__instructor=request.user,
        )
        serializer = InstructorPeerReviewSubmissionSerializer(submission)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="to-review")
    def to_review(self, request):
        submissions = self.get_queryset(request).exclude(
            peer_reviews__reviewer=request.user
        )
        serializer = InstructorPeerReviewSubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="review")
    def submit_review(self, request, pk=None):
        submission = get_object_or_404(
            ProjectSubmission,
            pk=pk,
            project__module__course__instructor=request.user,
            status="pending",
        )

        if submission.user == request.user:
            return Response(
                {"error": "Vous ne pouvez pas corriger votre propre projet."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if submission.peer_reviews.filter(reviewer=request.user).exists():
            return Response(
                {"error": "Vous avez déjà corrigé cette soumission."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = request.data.copy()
        try:
            score = int(data.get("score", 0))
        except (TypeError, ValueError):
            score = 0

        required_score = 90 if submission.project.is_final else 70
        data["is_approved"] = score >= required_score

        serializer = ProjectPeerReviewSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        review = serializer.save(reviewer=request.user, submission=submission)

        approved_count = submission.peer_reviews.filter(is_approved=True).count()
        if approved_count >= 2:
            submission.status = "approved"
            submission.save(update_fields=["status"])

            if submission.project.is_final:
                avg_score = (
                    submission.peer_reviews.filter(is_approved=True).aggregate(
                        Avg("score")
                    )["score__avg"]
                    or score
                )
                Certificate.objects.get_or_create(
                    user=submission.user,
                    course=submission.project.module.course,
                    defaults={"final_score": int(avg_score)},
                )

        return Response(
            ProjectPeerReviewSerializer(review).data,
            status=status.HTTP_201_CREATED,
        )
