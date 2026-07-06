from learning.models import Review, Enrollment
import random

class ReviewService:
    @staticmethod
    def assign_automated_reviews(submission):
        """
        Assigne automatiquement les reviews pour une soumission donnée.
        - Capstone (Instructor) : Pas d'assignation explicite (pris en charge par la file globale) ou assignation manuelle ultérieure.
        - Normal (Peer) : Assigne 2 étudiants ayant terminé le cours.
        """
        # Si c'est un projet final (capstone), on laisse pour les instructeurs
        if submission.project.is_final or submission.project.is_capstone:
            return
            
        # Logique d'assignation aux pairs
        course = submission.project.module.course
        
        # Récupérer les étudiants éligibles (ont terminé le cours, sauf l'auteur)
        eligible_users = Enrollment.objects.filter(
            course=course,
            is_completed=True
        ).exclude(
            user=submission.user
        ).values_list('user', flat=True)
        
        eligible_users = list(eligible_users)
        
        # S'il y a assez d'étudiants, on en prend 2 au hasard
        # S'il y a 1 étudiant, on lui assigne
        # Sinon, aucune assignation (restera en attente)
        users_to_assign = min(2, len(eligible_users))
        
        if users_to_assign > 0:
            selected_users = random.sample(eligible_users, users_to_assign)
            
            for user_id in selected_users:
                # Vérifier qu'une review n'existe pas déjà (sécurité)
                if not Review.objects.filter(submission=submission, reviewer_id=user_id).exists():
                    Review.objects.create(
                        submission=submission,
                        reviewer_id=user_id,
                        review_type='peer',
                        status='assigned',
                        scores={},
                        feedback=""
                    )
