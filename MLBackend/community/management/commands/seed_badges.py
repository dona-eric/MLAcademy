from django.core.management.base import BaseCommand
from community.models import Badge

INITIAL_BADGES = [
    {
        "name": "Pionnier MLAcademy",
        "slug": "pionnier-mlacademy",
        "description": "Félicitations ! Vous avez fait vos premiers pas sur la plateforme MLAcademy.",
        "icon": "sparkles",
        "category": "community",
        "xp_reward": 100,
        "condition_type": "first_login",
        "condition_value": 1,
        "is_secret": False,
    },
    {
        "name": "Code Ninja",
        "slug": "code-ninja",
        "description": "A accompli sa première leçon pratique dans l'éditeur de code.",
        "icon": "terminal",
        "category": "learning",
        "xp_reward": 150,
        "condition_type": "lesson_completed",
        "condition_value": 1,
        "is_secret": False,
    },
    {
        "name": "Maître du Quiz",
        "slug": "maitre-du-quiz",
        "description": "A obtenu un score parfait (100%) lors d'une évaluation par Quiz.",
        "icon": "award",
        "category": "learning",
        "xp_reward": 200,
        "condition_type": "quiz_perfect",
        "condition_value": 1,
        "is_secret": False,
    },
    {
        "name": "Challenger Officiel",
        "slug": "challenger-officiel",
        "description": "A soumis sa toute première solution à une compétition ou hackathon MLAcademy.",
        "icon": "swords",
        "category": "challenge",
        "xp_reward": 300,
        "condition_type": "challenge_submitted",
        "condition_value": 1,
        "is_secret": False,
    },
    {
        "name": "Spécialiste NLP & Text",
        "slug": "specialiste-nlp",
        "description": "A complété le module avancé de Traitement du Langage Naturel (NLP).",
        "icon": "cpu",
        "category": "learning",
        "xp_reward": 500,
        "condition_type": "lesson_completed",
        "condition_value": 5,
        "is_secret": False,
    },
    {
        "name": "Abeille du Soir (Night Owl)",
        "slug": "night-owl",
        "description": "Badge Secret : A codé et validé un exercice tard dans la nuit (entre 1h et 4h).",
        "icon": "moon",
        "category": "secret",
        "xp_reward": 250,
        "condition_type": "night_owl",
        "condition_value": 1,
        "is_secret": True,
    },
    {
        "name": "Chasseur de Bugs",
        "slug": "bug-hunter",
        "description": "Badge Secret : A signalé une erreur ou soulevé une issue technique pertinente.",
        "icon": "bug",
        "category": "secret",
        "xp_reward": 400,
        "condition_type": "bug_hunter",
        "condition_value": 1,
        "is_secret": True,
    },
    {
        "name": "Flamme de Bronze (3 jours)",
        "slug": "streak-bronze-3d",
        "description": "A maintenu une série d'apprentissage pendant 3 jours consécutifs !",
        "icon": "flame",
        "category": "streak",
        "xp_reward": 150,
        "condition_type": "streak_days",
        "condition_value": 3,
        "is_secret": False,
    },
    {
        "name": "Flamme d'Argent (7 jours)",
        "slug": "streak-silver-7d",
        "description": "A fait preuve d'une assiduité remarquable pendant une semaine complète !",
        "icon": "zap",
        "category": "streak",
        "xp_reward": 400,
        "condition_type": "streak_days",
        "condition_value": 7,
        "is_secret": False,
    },
    {
        "name": "Flamme d'Or (30 jours)",
        "slug": "streak-gold-30d",
        "description": "Niveau d'élite ! 30 jours de travail acharné sans interruption.",
        "icon": "crown",
        "category": "streak",
        "xp_reward": 1500,
        "condition_type": "streak_days",
        "condition_value": 30,
        "is_secret": False,
    },
    {
        "name": "Membre du Top 10",
        "slug": "top-10-leaderboard",
        "description": "A hissé son nom parmi le Top 10 du classement général de la communauté.",
        "icon": "trophy",
        "category": "rank",
        "xp_reward": 1000,
        "condition_type": "top_leaderboard",
        "condition_value": 10,
        "is_secret": False,
    },
]

class Command(BaseCommand):
    help = "Initialise les badges officiels et badges secrets de MLAcademy"

    def handle(self, *args, **options):
        count = 0
        for badge_data in INITIAL_BADGES:
            badge, created = Badge.objects.get_or_create(
                slug=badge_data["slug"],
                defaults=badge_data
            )
            if created:
                count += 1
                self.stdout.write(self.style.SUCCESS(f"Badge créé : {badge.name}"))
            else:
                # Mise à jour des données si existant
                for key, value in badge_data.items():
                    setattr(badge, key, value)
                badge.save()
                self.stdout.write(self.style.NOTICE(f"Badge mis à jour : {badge.name}"))

        self.stdout.write(self.style.SUCCESS(f"✅ Seeding terminé : {count} nouveaux badges créés."))
