import os
import django

# Configuration Django pour que le serveur MCP puisse accéder à la BDD
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "MLBackend.settings")
django.setup()

from mcp.server.fastmcp import FastMCP
from courses.models import Course
from django.contrib.auth import get_user_model

User = get_user_model()

# Création du serveur MCP MLAcademy
mcp = FastMCP("MLAcademy_MCP_Server")

@mcp.tool()
def search_similar_courses(query: str) -> str:
    """
    Recherche des cours existants similaires sur la plateforme.
    Utile pour voir si un sujet a déjà été traité.
    """
    courses = Course.objects.filter(title__icontains=query)
    if not courses.exists():
        return "Aucun cours trouvé pour cette requête."
    
    results = []
    for c in courses[:5]:
        results.append(f"- {c.title} (Niveau: {c.level})")
    
    return "\n".join(results)

@mcp.tool()
def count_courses_by_level(level: str) -> str:
    """
    Retourne le nombre de cours existants pour un niveau donné (ex: 'beginner', 'intermediate', 'advanced').
    """
    count = Course.objects.filter(level=level).count()
    return f"Il y a {count} cours de niveau {level} sur MLAcademy."

@mcp.resource("mlacademy://courses/{course_id}/structure")
def get_course_structure(course_id: int) -> str:
    """
    Ressource: Retourne la structure complète (modules et leçons) d'un cours spécifique.
    """
    try:
        course = Course.objects.prefetch_related('modules__lessons').get(id=course_id)
        structure = f"Structure du cours : {course.title}\nDescription: {course.description}\n"
        for module in course.modules.all():
            structure += f"\nModule: {module.title}\n"
            for lesson in module.lessons.all():
                structure += f"  - Leçon: {lesson.title} ({lesson.get_lesson_type_display()})\n"
        return structure
    except Course.DoesNotExist:
        return "Cours non trouvé."

if __name__ == "__main__":
    # Exécution du serveur (utilise stdio par défaut pour communiquer avec le client)
    mcp.run()
