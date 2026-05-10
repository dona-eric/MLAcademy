import os
import django

# Assurez-vous que l'environnement Django est chargé si vous exécutez ce script via `python manage.py shell < script.py`
from django.contrib.auth import get_user_model
from courses.models import (
    Category, Module, Lesson, Project, LearningPath, 
    LearningPathCourse, Course, CourseModule, CoursePrerequisite, CertificationExam
)
from django.utils.text import slugify

User = get_user_model()

def create_seed_data():
    print("🚀 Début de la génération du parcours 'Data Science & AWS'...")

    # 1. Créer l'Instructeur principal
    instructor, _ = User.objects.get_or_create(
        email="aws_instructor@mlacademy.com",
        defaults={
            "username": "aws_instructor",
            "first_name": "Yann",
            "last_name": "LeCun (Fake)",
            "is_staff": True,
            "is_superuser": True
        }
    )
    if not instructor.check_password("admin123"):
        instructor.set_password("admin123")
        instructor.save()

    # 2. Créer la Catégorie
    category, _ = Category.objects.get_or_create(
        name="Data Science & Cloud",
        defaults={"icon": "☁️", "description": "Formations avancées combinant la Data Science, l'IA et le Cloud Computing."}
    )

    # 3. Créer la Bibliothèque de Modules Réutilisables
    print("📦 Création de la bibliothèque de modules...")
    modules_data = [
        {"title": "Bases Mathématiques pour la Data Science", "desc": "Algèbre linéaire et calcul différentiel pour comprendre sous le capot."},
        {"title": "Probabilités et Statistiques Appliquées", "desc": "Distributions, tests d'hypothèses, A/B testing."},
        {"title": "Python pour l'analyse de données", "desc": "Numpy, Pandas, Matplotlib, Seaborn."},
        {"title": "Machine Learning Supervisé", "desc": "Régression, Classification, Random Forests, XGBoost."},
        {"title": "Machine Learning Non-Supervisé", "desc": "Clustering (K-Means), PCA, Réduction de dimension."},
        {"title": "Deep Learning avec PyTorch", "desc": "Réseaux de neurones profonds, CNN, RNN."},
        {"title": "Déploiement de Modèles sur AWS SageMaker", "desc": "Industrialisation des modèles ML sur le cloud AWS."},
    ]
    
    created_modules = []
    for m in modules_data:
        mod, _ = Module.objects.get_or_create(
            title=m["title"],
            defaults={
                "description": m["desc"],
                "category": category,
                "author": instructor,
                "estimated_hours": 5.0,
                "is_published": True
            }
        )
        created_modules.append(mod)

    # 4. Remplir les Modules avec des Leçons
    print("📚 Remplissage des modules avec des leçons et quiz...")
    
    # Module 0: Maths
    Lesson.objects.get_or_create(module=created_modules[0], title="Introduction aux Matrices", order=1, lesson_type="video", duration_minutes=15, is_free_preview=True)
    Lesson.objects.get_or_create(module=created_modules[0], title="Quiz d'Algèbre Linéaire", order=2, lesson_type="quiz")
    
    # Module 1: Stats
    Lesson.objects.get_or_create(module=created_modules[1], title="Les Distributions Statistiques", order=1, lesson_type="video", duration_minutes=20)
    Lesson.objects.get_or_create(module=created_modules[1], title="Quiz de probabilités", order=2, lesson_type="quiz")

    # Module 2: Python
    Lesson.objects.get_or_create(module=created_modules[2], title="Manipulation de DataFrames avec Pandas", order=1, lesson_type="notebook", duration_minutes=30, starter_code="import pandas as pd\n\n# Charge le dataset ici\ndf = pd.read_csv('...')")
    
    # Module 3: ML Supervised
    Lesson.objects.get_or_create(module=created_modules[3], title="Comprendre XGBoost", order=1, lesson_type="video", duration_minutes=25)
    Lesson.objects.get_or_create(module=created_modules[3], title="Implémentation Random Forest", order=2, lesson_type="notebook", starter_code="from sklearn.ensemble import RandomForestClassifier")

    # Module 4: ML Unsupervised
    Lesson.objects.get_or_create(module=created_modules[4], title="K-Means de A à Z", order=1, lesson_type="video", duration_minutes=15)

    # Module 5: Deep Learning
    Lesson.objects.get_or_create(module=created_modules[5], title="Architecture d'un CNN", order=1, lesson_type="video", duration_minutes=35)
    Lesson.objects.get_or_create(module=created_modules[5], title="Création d'un CNN PyTorch", order=2, lesson_type="notebook", starter_code="import torch.nn as nn\n\nclass Net(nn.Module):\n    pass")

    # Module 6: AWS
    Lesson.objects.get_or_create(module=created_modules[6], title="Introduction à AWS SageMaker", order=1, lesson_type="video", duration_minutes=25)
    Lesson.objects.get_or_create(module=created_modules[6], title="Déployer un Endpoint SageMaker", order=2, lesson_type="exercise", starter_code="import boto3\nimport sagemaker")

    # 5. Créer les Projets des Modules (Finaux & Capstone)
    print("🛠 Création des projets de modules...")
    Project.objects.get_or_create(module=created_modules[2], title="Analyse Exploratoire des Ventes", defaults={"description": "Faire l'EDA d'un dataset.", "instructions": "Utilisez Pandas et Seaborn.", "is_final": True})
    Project.objects.get_or_create(module=created_modules[5], title="Classification d'Images Médicales", defaults={"description": "Modèle CNN PyTorch", "instructions": "Précision > 90%", "is_final": True})
    
    capstone, _ = Project.objects.get_or_create(
        module=created_modules[6], 
        title="Projet Capstone : Pipeline ML end-to-end sur AWS",
        defaults={
            "description": "Construire un pipeline CI/CD de machine learning avec MLOps sur AWS SageMaker.",
            "instructions": "Vous devez entraîner le modèle, l'évaluer et déployer un endpoint d'inférence sécurisé.",
            "is_capstone": True,
            "passing_score": 85
        }
    )

    # 6. Créer les Cours (qui regroupent les modules)
    print("📘 Création des Cours...")
    c1, _ = Course.objects.get_or_create(title="Mathématiques et Statistiques pour l'IA", defaults={"instructor": instructor, "category": category, "is_published": True, "level": "beginner"})
    c2, _ = Course.objects.get_or_create(title="Masterclass Python Data Science", defaults={"instructor": instructor, "category": category, "is_published": True, "level": "intermediate"})
    c3, _ = Course.objects.get_or_create(title="Machine Learning Pratique", defaults={"instructor": instructor, "category": category, "is_published": True, "level": "intermediate"})
    c4, _ = Course.objects.get_or_create(title="Deep Learning & Réseaux de Neurones", defaults={"instructor": instructor, "category": category, "is_published": True, "level": "advanced"})
    c5, _ = Course.objects.get_or_create(title="MLOps & AWS SageMaker", defaults={"instructor": instructor, "category": category, "is_published": True, "level": "professional"})

    # Jonction Course -> Module
    CourseModule.objects.get_or_create(course=c1, module=created_modules[0], order=1)
    CourseModule.objects.get_or_create(course=c1, module=created_modules[1], order=2)
    CourseModule.objects.get_or_create(course=c2, module=created_modules[2], order=1)
    CourseModule.objects.get_or_create(course=c3, module=created_modules[3], order=1)
    CourseModule.objects.get_or_create(course=c3, module=created_modules[4], order=2)
    CourseModule.objects.get_or_create(course=c4, module=created_modules[5], order=1)
    CourseModule.objects.get_or_create(course=c5, module=created_modules[6], order=1)

    # Prérequis des cours
    CoursePrerequisite.objects.get_or_create(course=c2, required_course=c1)
    CoursePrerequisite.objects.get_or_create(course=c3, required_course=c2)
    CoursePrerequisite.objects.get_or_create(course=c4, required_course=c3)
    CoursePrerequisite.objects.get_or_create(course=c5, required_course=c4)

    # 7. Créer le Learning Path (Parcours)
    print("🎓 Création du Parcours Certifiant...")
    path, _ = LearningPath.objects.get_or_create(
        title="Professional Data Scientist with AWS",
        defaults={
            "short_description": "Devenez un expert Data Scientist et déployez vos modèles à l'échelle avec le Cloud AWS.",
            "description": "Ce parcours intensif vous guide depuis les bases mathématiques jusqu'au déploiement MLOps en production sur Amazon Web Services (AWS SageMaker).",
            "category": category,
            "creator": instructor,
            "level": "professional",
            "estimated_weeks": 24,
            "is_published": True,
            "is_certifying": True,
            "price": 250000.00
        }
    )

    # Jonction Path -> Course
    LearningPathCourse.objects.get_or_create(learning_path=path, course=c1, order=1, is_required=True)
    LearningPathCourse.objects.get_or_create(learning_path=path, course=c2, order=2, is_required=True)
    LearningPathCourse.objects.get_or_create(learning_path=path, course=c3, order=3, is_required=True)
    LearningPathCourse.objects.get_or_create(learning_path=path, course=c4, order=4, is_required=True)
    LearningPathCourse.objects.get_or_create(learning_path=path, course=c5, order=5, is_required=True)

    path.update_courses_count()

    # 8. Examen de Certification Final
    print("🏆 Création de l'Examen de Certification (Lié au Capstone)...")
    CertificationExam.objects.get_or_create(
        learning_path=path,
        defaults={
            "title": "Examen de Certification: AWS Data Scientist",
            "instructions": "Validez votre Capstone pour obtenir la certification.",
            "passing_score": 85,
            "capstone_project": capstone,
            "is_published": True
        }
    )

    print("✅ Seed terminé avec succès ! Le parcours 'Professional Data Scientist with AWS' est en ligne sur la plateforme.")

if __name__ == "__main__":
    create_seed_data()
