import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MLBackend.settings')
django.setup()

from community.models import Category, Channel, Company, JobOffer

def seed_community():
    print("Seeding Community...")
    
    # Categories
    tech_cat, _ = Category.objects.get_or_create(name="LABS TECHNIQUES", order=1)
    career_cat, _ = Category.objects.get_or_create(name="CARRIÈRE & TALENTS", order=2)
    lounge_cat, _ = Category.objects.get_or_create(name="LE LOUNGE", order=3)
    
    # Channels
    channels = [
        (tech_cat, "vision-artificielle", "Recherches et projets en CV", "eye", 1),
        (tech_cat, "nlp-transformers", "Discussions sur le langage", "message-square", 2),
        (tech_cat, "mlops-deploy", "Mise en production", "cpu", 3),
        
        (career_cat, "offres-emplois", "Annonces exclusives", "briefcase", 1),
        (career_cat, "revue-cv", "Aide à l'optimisation", "file-text", 2),
        (career_cat, "conseils-mentors", "Espace de partage", "shield-check", 3),
        
        (lounge_cat, "general", "Discussion libre", "hash", 1),
        (lounge_cat, "evenements", "Meetups et hackathons", "calendar", 2),
        (lounge_cat, "ressources-ia", "Veille technologique", "sparkles", 3),
    ]
    
    for cat, name, desc, icon, order in channels:
        Channel.objects.get_or_create(
            name=name,
            defaults={
                'category': cat,
                'description': desc,
                'icon': icon,
                'order': order
            }
        )
        
    # Companies
    tech_corp, _ = Company.objects.get_or_create(
        name="TechAfrica AI",
        defaults={
            'description': "Leader de l'IA au Bénin",
            'location': "Cotonou",
            'is_verified': True
        }
    )
    
    # Jobs
    JobOffer.objects.get_or_create(
        title="Data Scientist (H/F)",
        company=tech_corp,
        defaults={
            'description': "Nous recherchons un talent passionné par le ML.",
            'requirements': "Python, PyTorch, Scikit-learn",
            'location': "Hybride / Cotonou",
            'contract_type': "CDI",
            'salary_range': "400k - 800k CFA"
        }
    )

    print("Seed complete!")

if __name__ == "__main__":
    seed_community()
