from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from courses.models import Category, Course, Module, Lesson, LearningPath, LearningPathCourse, CourseModule
from learning.models import QuizQuestion, QuizChoice, SkillBadge

User = get_user_model()

class Command(BaseCommand):
    help = "Seed database with high-quality ML/MLOps courses, lessons, quizzes, and learning paths."

    def handle(self, *args, **options):
        self.stdout.write("Starting database seeding...")

        try:
            with transaction.atomic():
                # 1. Get or create a default instructor/admin user
                instructor = User.objects.filter(is_superuser=True).first()
                if not instructor:
                    instructor = User.objects.filter(is_staff=True).first()
                if not instructor:
                    instructor = User.objects.filter(username="dona").first()
                if not instructor:
                    instructor = User.objects.create_superuser(
                        username="dona",
                        email="admin@mlacademy.com",
                        password="AdminPassword123@",
                        first_name="Admin",
                        last_name="Data",
                        email_verified=True,
                        is_instructor=True
                    )
                    self.stdout.write(self.style.SUCCESS("Created superuser/instructor 'dona'"))
                else:
                    if not instructor.is_instructor:
                        instructor.is_instructor = True
                        instructor.save(update_fields=["is_instructor"])
                    self.stdout.write(f"Using existing instructor user: {instructor.email}")

                # 2. Create Categories
                mlops_cat, _ = Category.objects.get_or_create(
                    name="MLOps & Production",
                    defaults={
                        "description": "Pratiques et outils pour déployer et monitorer les modèles de Machine Learning.",
                        "icon": "🚀"
                    }
                )
                nlp_cat, _ = Category.objects.get_or_create(
                    name="NLP & GenAI",
                    defaults={
                        "description": "Architectures de traitement du langage naturel et IA générative.",
                        "icon": "🤖"
                    }
                )

                # 3. Create Learning Path
                path, _ = LearningPath.objects.get_or_create(
                    title="Machine Learning Engineer & MLOps",
                    defaults={
                        "short_description": "Maîtrisez le cycle de vie complet des modèles ML, de la recherche à la production.",
                        "description": "Ce parcours intensif vous guidera à travers les concepts théoriques du Deep Learning, le développement de modèles d'IA, et la mise en production de niveau industriel en utilisant DVC, Docker, FastAPI, CI/CD et Kubernetes.",
                        "category": mlops_cat,
                        "creator": instructor,
                        "level": "intermediate",
                        "estimated_weeks": 12,
                        "is_published": True,
                        "is_certifying": True,
                        "is_free": True
                    }
                )

                # 4. Course 1: Masterclass MLOps
                course1, _ = Course.objects.get_or_create(
                    title="Masterclass MLOps : De la Recherche à la Production",
                    defaults={
                        "short_description": "Maîtrisez le cycle de vie complet des modèles ML : DVC, FastAPI, CI/CD et monitoring.",
                        "description": "Ce cours vous apprendra à versionner vos jeux de données avec DVC, à modulariser vos entraînements, à packager vos modèles sous forme d'API robustes avec FastAPI et à automatiser vos déploiements.",
                        "category": mlops_cat,
                        "instructor": instructor,
                        "level": "advanced",
                        "duration_hours": 20,
                        "is_published": True,
                        "is_free": True,
                        "is_standalone": True
                    }
                )

                # Module 1
                module1, _ = Module.objects.get_or_create(
                    title="Module 1 : Versionnement de données avec DVC",
                    defaults={
                        "description": "Comprendre et appliquer le contrôle de version des datasets volumineux en synergie avec Git.",
                        "category": mlops_cat,
                        "author": instructor,
                        "estimated_hours": 5,
                        "is_published": True
                    }
                )
                
                # Link module to course if not exists
                CourseModule.objects.get_or_create(course=course1, module=module1, defaults={"order": 1})

                # Lesson 1.1 (Video)
                lesson1, _ = Lesson.objects.get_or_create(
                    module=module1,
                    title="Tracking de datasets avec DVC et Git",
                    defaults={
                        "lesson_type": "video",
                        "content": "### Introduction à DVC\nDans cette leçon, nous allons voir comment utiliser Data Version Control (DVC) pour suivre les modifications de nos fichiers de données sans encombrer notre dépôt Git.",
                        "video_url": "https://storage.googleapis.com/mlacademy-videos/dvc-intro.mp4",
                        "duration_minutes": 15,
                        "order": 1,
                        "is_free_preview": True
                    }
                )

                # Lesson 1.2 (Quiz)
                lesson2, _ = Lesson.objects.get_or_create(
                    module=module1,
                    title="Validation des Concepts DVC",
                    defaults={
                        "lesson_type": "quiz",
                        "content": "Testez vos connaissances sur l'architecture et les commandes de base de DVC.",
                        "duration_minutes": 10,
                        "order": 2
                    }
                )

                # Quiz Questions
                q1, _ = QuizQuestion.objects.get_or_create(
                    lesson=lesson2,
                    text="Où DVC stocke-t-il les fichiers de données réels par défaut ?",
                    defaults={
                        "explanation": "DVC utilise un répertoire local caché '.dvc/cache' pour stocker les versions de fichiers de données, puis crée des pointeurs légers (fichiers .dvc) suivis par Git.",
                        "order": 1
                    }
                )
                QuizChoice.objects.get_or_create(question=q1, text="Dans le dépôt Git local sous forme de LFS", defaults={"is_correct": False})
                QuizChoice.objects.get_or_create(question=q1, text="Dans le répertoire cache local .dvc/cache", defaults={"is_correct": True})
                QuizChoice.objects.get_or_create(question=q1, text="Directement hébergés sur GitHub", defaults={"is_correct": False})

                q2, _ = QuizQuestion.objects.get_or_create(
                    lesson=lesson2,
                    text="Quelle commande permet de configurer un stockage distant (S3, GCS, etc.) dans DVC ?",
                    defaults={
                        "explanation": "La commande 'dvc remote add' permet d'associer un dossier ou un bucket distant de stockage comme destination pour la commande 'dvc push'.",
                        "order": 2
                    }
                )
                QuizChoice.objects.get_or_create(question=q2, text="dvc remote add <nom> <url>", defaults={"is_correct": True})
                QuizChoice.objects.get_or_create(question=q2, text="dvc remote connect <url>", defaults={"is_correct": False})
                QuizChoice.objects.get_or_create(question=q2, text="dvc init remote <url>", defaults={"is_correct": False})

                # Lesson 1.3 (Exercise)
                lesson3, _ = Lesson.objects.get_or_create(
                    module=module1,
                    title="Exercice Pratique : Écriture d'un Loader de Données Reproductible",
                    defaults={
                        "lesson_type": "exercise",
                        "content": "### Exercice\nComplétez la fonction `load_data` ci-dessous pour charger un dataset stocké sur un dépôt Git distant à l'aide de l'API Python de DVC.\n\nUtilisez la méthode `dvc.api.get_url()` avec les paramètres corrects pour récupérer l'URL de téléchargement.",
                        "duration_minutes": 25,
                        "order": 3,
                        "starter_code": "import dvc.api\n\ndef load_data():\n    # Écrivez votre logique ici pour charger 'data/dataset.csv' depuis le dépôt 'https://github.com/mlacademy/data-repo'\n    path = ''\n    repo = ''\n    return dvc.api.get_url(path=path, repo=repo)\n",
                        "solution_code": "import dvc.api\n\ndef load_data():\n    path = 'data/dataset.csv'\n    repo = 'https://github.com/mlacademy/data-repo'\n    return dvc.api.get_url(path=path, repo=repo)\n"
                    }
                )

                # 5. Course 2: Fondations du Deep Learning
                course2, _ = Course.objects.get_or_create(
                    title="Fondations du Deep Learning",
                    defaults={
                        "short_description": "Comprenez les réseaux de neurones profonds, de la régression logistique à PyTorch.",
                        "description": "Apprenez à concevoir, entraîner et optimiser des réseaux de neurones convolutifs (CNN) et récurrents (RNN) en écrivant vos propres implémentations puis en migrant vers PyTorch.",
                        "category": nlp_cat,
                        "instructor": instructor,
                        "level": "beginner",
                        "duration_hours": 15,
                        "is_published": True,
                        "is_free": True,
                        "is_standalone": True
                    }
                )

                # Module 2
                module2, _ = Module.objects.get_or_create(
                    title="Module 1 : Le Perceptron Multicouche",
                    defaults={
                        "description": "Découvrez l'unité de base des réseaux de neurones, la rétropropagation du gradient, et les fonctions d'activation.",
                        "category": nlp_cat,
                        "author": instructor,
                        "estimated_hours": 4,
                        "is_published": True
                    }
                )
                
                # Link module to course if not exists
                CourseModule.objects.get_or_create(course=course2, module=module2, defaults={"order": 1})

                # Lesson 2.1 (Video)
                lesson2_1, _ = Lesson.objects.get_or_create(
                    module=module2,
                    title="Introduction aux Réseaux de Neurones Artificiels",
                    defaults={
                        "lesson_type": "video",
                        "content": "### Qu'est-ce qu'un neurone artificiel ?\nDans cette leçon, nous allons introduire le concept mathématique d'un neurone artificiel (Perceptron) et comment il s'inspire du cerveau humain.",
                        "video_url": "https://storage.googleapis.com/mlacademy-videos/perceptron-intro.mp4",
                        "duration_minutes": 20,
                        "order": 1,
                        "is_free_preview": True
                    }
                )

                # Lesson 2.2 (Exercise)
                lesson2_2, _ = Lesson.objects.get_or_create(
                    module=module2,
                    title="Exercice Pratique : Écriture d'une fonction d'activation Sigmoïde",
                    defaults={
                        "lesson_type": "exercise",
                        "content": "### Exercice\nLa fonction d'activation Sigmoïde est cruciale pour introduire de la non-linéarité dans notre réseau.\n\nImplémentez la formule mathématique de la Sigmoïde : $f(x) = \\frac{1}{1 + e^{-x}}$ en utilisant le module `math` de Python.",
                        "duration_minutes": 15,
                        "order": 2,
                        "starter_code": "import math\n\ndef sigmoid(x):\n    # Votre code ici\n    return 0.0\n",
                        "solution_code": "import math\n\ndef sigmoid(x):\n    return 1.0 / (1.0 + math.exp(-x))\n"
                    }
                )

                # 6. Link courses to Learning Path
                LearningPathCourse.objects.get_or_create(
                    learning_path=path,
                    course=course1,
                    defaults={"order": 1, "is_required": True}
                )
                LearningPathCourse.objects.get_or_create(
                    learning_path=path,
                    course=course2,
                    defaults={"order": 2, "is_required": True}
                )

                # Update course count for path
                path.update_courses_count()

                # 7. Create Gamification Badges
                SkillBadge.objects.get_or_create(
                    name="Pionnier MLOps",
                    defaults={
                        "icon": "rocket",
                        "badge_type": "technical",
                        "description": "Attribué aux étudiants ayant validé leur premier exercice avec DVC."
                    }
                )
                SkillBadge.objects.get_or_create(
                    name="Apprenti Deep Learner",
                    defaults={
                        "icon": "brain",
                        "badge_type": "technical",
                        "description": "Attribué aux étudiants ayant implémenté avec succès les concepts de neurones de base."
                    }
                )

            self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error seeding database: {str(e)}"))
