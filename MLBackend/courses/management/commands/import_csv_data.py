import csv
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from courses.models import Course, Category
from learning.models import Certificate
from django.utils.dateparse import parse_datetime

User = get_user_model()

class Command(BaseCommand):
    help = 'Importe les données CSV (Cours et Certificats)'

    def handle(self, *args, **kwargs):
        # Création d'une catégorie par défaut pour éviter les erreurs
        category, _ = Category.objects.get_or_create(name="Importés via CSV", slug="import-csv")
        
        # 1. IMPORT COURS
        courses_path = 'data_imports/courses.csv'
        self.stdout.write(self.style.WARNING(f'Importation des cours depuis {courses_path}...'))
        try:
            with open(courses_path, newline='', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    course, created = Course.objects.update_or_create(
                        slug=row['slug'],
                        defaults={
                            'title': row['title'],
                            'short_description': row['short_description'],
                            'description': row['description'],
                            'level': row['level'],
                            'duration_hours': int(row['duration_hours']),
                            'is_published': row['is_published'] == 'True',
                            'is_free': row['is_free'] == 'True',
                            'is_standalone': row['is_standalone'] == 'True',
                            'price': float(row['price']),
                            'prerequisites_text': row.get('prerequisites_text', ''),
                            'syllabus': row.get('syllabus', ''),
                            'category': category
                        }
                    )
                    status = "Créé" if created else "Mis à jour"
                    self.stdout.write(self.style.SUCCESS(f'{status} : {course.title}'))
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'Fichier {courses_path} introuvable.'))


        # 2. IMPORT CERTIFICATS
        certs_path = 'data_imports/certificates.csv'
        self.stdout.write(self.style.WARNING(f'\nImportation des certificats depuis {certs_path}...'))
        try:
            with open(certs_path, newline='', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # Trouver l'utilisateur
                    try:
                        user = User.objects.get(email=row['user_email'])
                    except User.DoesNotExist:
                        self.stdout.write(self.style.ERROR(f"Utilisateur introuvable : {row['user_email']}"))
                        continue
                    
                    # Trouver le cours
                    try:
                        course = Course.objects.get(slug=row['course_slug'])
                    except Course.DoesNotExist:
                        self.stdout.write(self.style.ERROR(f"Cours introuvable : {row['course_slug']}"))
                        continue

                    cert, created = Certificate.objects.update_or_create(
                        certificate_id=row['certificate_id'],
                        defaults={
                            'user': user,
                            'course': course,
                            'cert_type': row['cert_type'],
                            'final_score': int(row['final_score']),
                        }
                    )
                    # Si 'issued_at' est fourni, on le met à jour
                    if row.get('issued_at'):
                        cert.issued_at = parse_datetime(row['issued_at'])
                        cert.save(update_fields=['issued_at'])

                    status = "Créé" if created else "Mis à jour"
                    self.stdout.write(self.style.SUCCESS(f"{status} : Certificat {cert.certificate_id} pour {user.email}"))
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'Fichier {certs_path} introuvable.'))
