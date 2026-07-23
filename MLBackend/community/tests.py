from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class CommunityStatsTests(APITestCase):
    def setUp(self):
        # Création d'un utilisateur de test
        self.user = User.objects.create_user(
            username='testuser', 
            email='test@example.com', 
            password='testpassword123'
        )
        self.url = reverse('community-stats') # Assurez-vous que l'URL est nommée ainsi dans urls.py

    def test_community_stats_authenticated(self):
        """
        Vérifie qu'un utilisateur authentifié peut récupérer les statistiques de la communauté.
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        
        # Le code de statut doit être 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Le payload doit contenir les clés attendues
        self.assertIn('activeJobs', response.data)
        self.assertIn('totalTalents', response.data)
        self.assertIn('activeDiscussions', response.data)
        
        # Par défaut sans données, les compteurs devraient être à 0
        self.assertEqual(response.data['activeJobs'], 0)

    def test_community_stats_unauthenticated(self):
        """
        Vérifie que l'endpoint reste accessible (si IsAuthenticatedOrReadOnly) ou renvoie une erreur (si IsAuthenticated).
        """
        response = self.client.get(self.url)
        # Selon votre configuration, cela peut être 200 (autorisé aux anonymes) ou 401 (interdit).
        # Ajustons le test selon le fonctionnement actuel : 
        # (Si la vue @api_view autorise tout le monde (AllowAny), cela retourne 200)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
