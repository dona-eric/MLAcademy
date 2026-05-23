from django.urls import path
from .views_public import PublicCertificateView

urlpatterns = [
    path("<str:certificate_id>/", PublicCertificateView.as_view(), name="public-certificate"),
]