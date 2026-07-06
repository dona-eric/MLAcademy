from rest_framework import permissions

class IsAuthorizedReviewer(permissions.BasePermission):
    """
    Vérifie que le user n'est pas l'auteur et qu'il est autorisé à évaluer (ou que le projet est en attente).
    """
    def has_object_permission(self, request, view, obj):
        # La vue SubmitReviewView cible l'objet "Review" pour l'assignation, 
        # mais la permission est souvent appelée sur la soumission si on l'attache à la création de Review.
        # En fait, lors d'un POST (CreateAPIView), has_object_permission n'est pas appelé automatiquement.
        # Mais si l'on veut le vérifier manuellement, obj peut être le ProjectSubmission.
        
        # Pour être sûr, cette méthode suppose que "obj" = ProjectSubmission.
        
        if request.user == obj.user:
            return False
            
        # L'évaluation ne peut se faire que si le projet est dans l'état pending ou in_review
        if obj.status not in ['pending', 'in_review']:
            return False
            
        # Vérification si l'utilisateur est assigné (pour une review peer) 
        # Pour un instructeur, il pourrait avoir le droit s'il enseigne le cours.
        # La logique de validation d'assignation se fera aussi au niveau de perform_create.
        return True
