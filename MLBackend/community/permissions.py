from rest_framework import permissions
from .models import Company

class IsRecruiter(permissions.BasePermission):
    """
    Vérifie si l'utilisateur connecté est un recruteur ou un administrateur.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_recruiter or request.user.is_staff)
        )

class IsCompanyAdmin(permissions.BasePermission):
    """
    Vérifie si l'utilisateur est administrateur de l'entreprise associée.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        if request.user.is_staff:
            return True
            
        if view.action == 'create':
            company_id = request.data.get('company')
            if not company_id:
                return True # Laisse le serializer lever l'erreur de validation du champ obligatoire
            try:
                company = Company.objects.get(pk=company_id)
                return company.admins.filter(pk=request.user.pk).exists()
            except Company.DoesNotExist:
                return False
        return True

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
            
        if request.user.is_staff:
            return True
            
        return obj.company.admins.filter(pk=request.user.pk).exists()
