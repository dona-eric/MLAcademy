from django.db.models import Avg
from django.shortcuts import get_object_or_404
from learning.models import Certificate, ProjectSubmission
from learning.serializers import ProjectPeerReviewSerializer
from rest_framework import permissions, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Course, Lesson, Module, Project
from .permissions import IsInstructor
from .serializers import (
    CourseListSerializer,
    InstructorCourseEditSerializer,
    LessonSerializer,
    ModuleSerializer,
    ProjectSerializer,
)


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
    CRUD pour les modules. L'instructeur ne peut gérer que les modules de ses propres cours.
    """

    permission_classes = [IsInstructor]
    serializer_class = ModuleSerializer

    def get_queryset(self):
        return Module.objects.filter(course__instructor=self.request.user)

    def perform_create(self, serializer):
        serializer.save()


class InstructorLessonViewSet(viewsets.ModelViewSet):
    """
    CRUD pour les leçons.
    """

    permission_classes = [IsInstructor]
    serializer_class = LessonSerializer

    def get_queryset(self):
        return Lesson.objects.filter(module__course__instructor=self.request.user)

    def perform_create(self, serializer):
        serializer.save()


class InstructorProjectViewSet(viewsets.ModelViewSet):
    """
    CRUD pour les projets.
    """

    permission_classes = [IsInstructor]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(module__course__instructor=self.request.user)

    def perform_create(self, serializer):
        serializer.save()


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
        fields = [
            "id",
            "project",
            "project_title",
            "project_is_final",
            "course_title",
            "course_slug",
            "student_name",
            "student_username",
            "repo_url",
            "code_content",
            "status",
            "submitted_at",
            "peer_reviews",
            "created_at",
            "updated_at",
        ]


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
                project__module__course__instructor=request.user,
            )
            .exclude(user=request.user)
            .select_related(
                "user",
                "project",
                "project__module",
                "project__module__course",
            )
            .prefetch_related("peer_reviews__reviewer")
            .order_by("-submitted_at", "-created_at")
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
