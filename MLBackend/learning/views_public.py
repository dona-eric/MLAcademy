from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from .models import Certificate

class PublicCertificateView(APIView):
    """
    Point d'accès public permettant la vérification d'un diplôme 
    par des tiers (ex: lien de partage LinkedIn, recruteurs).
    """
    permission_classes = [AllowAny]

    def get(self, request, certificate_id):
        # Jointure préventive (select_related) pour éliminer le fléau des requêtes N+1
        queryset = Certificate.objects.select_related('user', 'learning_path', 'course')
        certificate = get_object_or_404(queryset, certificate_id=certificate_id)
        
        target_name = (
            certificate.learning_path.title if certificate.learning_path 
            else (certificate.course.title if certificate.course else "Formation MLAcademy")
        )
        student_name = certificate.user.get_full_name() or certificate.user.username
        
        data = {
            "certificate_id": certificate.certificate_id,
            "student_name": student_name,
            "target_name": target_name,
            "cert_type": certificate.get_cert_type_display(),
            "final_score": certificate.final_score,
            "issued_at": certificate.issued_at,
            "pdf_url": request.build_absolute_uri(certificate.pdf_file.url) if certificate.pdf_file else None,
        }
        return Response(data)