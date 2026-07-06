"""
Service Tuteur IA — MLAcademy
Communique avec l'API OpenAI pour fournir un assistant pédagogique contextuel.
"""
import os
from openai import OpenAI

# Client OpenAI initialisé avec la clé du .env
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", ""))

SYSTEM_PROMPT_TEMPLATE = """Tu es le Tuteur IA officiel de la plateforme MLAcademy, une plateforme africaine d'apprentissage du Machine Learning et de la Data Science.

Ton rôle :
- Tu assistes l'étudiant dans sa compréhension de la leçon en cours.
- Tu réponds en français par défaut, sauf si l'étudiant t'écrit en anglais.
- Tu es pédagogique, patient, encourageant et professionnel.
- Tu utilises des exemples concrets et du code Python quand c'est pertinent.
- Tu structures tes réponses avec du Markdown (titres, listes, blocs de code).
- Tu NE fournis JAMAIS directement la solution complète d'un exercice. Tu guides l'étudiant étape par étape.
- Si la question sort du cadre de la leçon, tu le signales poliment et tu ramènes la discussion vers le sujet de la leçon.

=== CONTEXTE DE LA LEÇON EN COURS ===
Module : {module_title}
Leçon : {lesson_title}
Type : {lesson_type}

Contenu de la leçon :
{lesson_content}

{code_context}
=== FIN DU CONTEXTE ===

Utilise ce contexte pour répondre avec précision aux questions de l'étudiant. Si tu ne connais pas la réponse, dis-le honnêtement plutôt que d'inventer."""


def build_system_prompt(lesson):
    """
    Construit le prompt système enrichi avec le contenu de la leçon.
    """
    code_context = ""
    if lesson.starter_code:
        code_context += f"\nCode de démarrage fourni à l'étudiant :\n"""python\n{lesson.starter_code}\n"""\n"
    
    return SYSTEM_PROMPT_TEMPLATE.format(
        module_title=lesson.module.title,
        lesson_title=lesson.title,
        lesson_type=lesson.get_lesson_type_display(),
        lesson_content=lesson.content[:6000] if lesson.content else "(Aucun contenu textuel pour cette leçon)",
        code_context=code_context,
    )


def chat_with_tutor(lesson, conversation_history: list[dict]) -> str:
    """
    Envoie la conversation à l'API OpenAI avec le contexte de la leçon.
    
    Args:
        lesson: Instance du modèle Lesson
        conversation_history: Liste de dicts [{"role": "user"|"assistant", "content": "..."}]
    
    Returns:
        La réponse textuelle de l'IA.
    """
    system_prompt = build_system_prompt(lesson)
    
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(conversation_history)
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # Excellent rapport qualité/prix pour le tutorat
        messages=messages,
        max_tokens=2048,
        temperature=0.7,
    )
    
    return response.choices[0].message.content
