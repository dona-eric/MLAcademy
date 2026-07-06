from rest_framework import permissions
from users.models import InstructorApplication

class IsInstructor(permissions.BasePermission):
    """
    Vérifie si l'utilisateur connecté a le statut d'instructeur (soit via un booléen sur l'utilisateur,
    soit via l'appartenance à un groupe spécifique 'Instructeurs').
    """

    def has_permission(self, request, view):
        # Vérifie si l'utilisateur est authentifié et s'il est instructeur
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Pour MLAcademy, on suppose que le modèle utilisateur ou un groupe détermine cela.
        # Soit request.user.groups.filter(name='Instructors').exists()
        # Soit request.user.is_staff (pour simplifier si staff = instructor)
        # Mais le mieux est de se baser sur InstructorApplication (si approuvé) ou un champ 'is_instructor' sur User.
        
        # On va vérifier si une candidature approuvée existe pour cet utilisateur
        return InstructorApplication.objects.filter(
            user=request.user, 
            status='approved'
        ).exists()
