from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.throttling import ScopedRateThrottle
from .services.mcp_client import MCPClient

class CopilotAutocompleteView(APIView):
    """
    POST /api/chat/autocomplete/
    Fournit l'autocomplétion contextuelle (style Copilot).
    """
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'ai_chat'

    def post(self, request):
        text = request.data.get('text')
        field = request.data.get('field', 'inconnu')
        course_id = request.data.get('course_id')
        
        if not text:
            return Response({"error": "Le texte est requis."}, status=status.HTTP_400_BAD_REQUEST)
            
        system_prompt = (
            "Tu es l'assistant Copilot (autocomplétion en ligne) du Studio MLAcademy. "
            f"L'utilisateur est en train de taper dans le champ : '{field}'. "
            "Ton rôle est EXCLUSIVEMENT de générer la SUITE LOGIQUE (la complétion) du texte qu'il vient de taper. "
            "NE RÉPÈTE PAS le texte original. Génère uniquement ce qui vient après. "
            "Si la phrase te semble complète, tu peux ajouter une courte suite cohérente ou ne rien renvoyer. "
            "N'utilise pas de guillemets autour de la réponse, donne directement la suite brute."
        )
        
        if course_id:
            # Demander explicitement à l'IA d'utiliser le tool pour charger la ressource (la structure du cours)
            # En MCP, on a un tool get_course_structure ou une ressource.
            system_prompt += (
                f"\\n\\nL'identifiant du cours en cours d'édition est {course_id}. "
                "Tu peux utiliser l'outil 'get_course_structure' (s'il existe) pour lire le contenu existant "
                "afin de proposer une suite cohérente avec le reste du cours."
            )
            
        client = MCPClient()
        messages = [{"role": "user", "content": text}]
        
        try:
            completion = client.chat_sync(system_prompt, messages)
            # Nettoyer les guillemets potentiels autour de la complétion
            completion = completion.strip().strip('"').strip("'")
            return Response({"completion": completion})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GlobalAssistantView(APIView):
    """
    POST /api/chat/global/
    Assistant global pour la plateforme (Widget).
    """
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'ai_chat'
    
    def post(self, request):
        message = request.data.get('message')
        chat_history = request.data.get('chatHistory', [])
        
        if not message:
            return Response({"error": "Le message est requis."}, status=status.HTTP_400_BAD_REQUEST)
            
        system_prompt = (
            "Tu es l'Assistant IA global de MLAcademy. "
            "Tu es un expert en Machine Learning, Data Science et développement web. "
            "Tu peux répondre aux questions techniques, orienter les étudiants, et grâce au protocole MCP (Model Context Protocol), "
            "tu as accès à des outils pour interroger la base de données de la plateforme (ex: recherche de cours, statistiques). "
            "N'hésite pas à utiliser les outils à ta disposition si la question de l'utilisateur le nécessite. "
            "Réponds toujours en français (sauf si on te parle anglais), de manière professionnelle et concise, en utilisant du Markdown."
        )
        
        messages = []
        for h in chat_history:
            messages.append({
                "role": "user" if h.get("role") == "user" else "assistant",
                "content": h.get("text", "")
            })
        messages.append({"role": "user", "content": message})
        
        client = MCPClient()
        try:
            reply = client.chat_sync(system_prompt, messages)
            return Response({"reply": reply})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
