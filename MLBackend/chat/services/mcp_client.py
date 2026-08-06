import os
import asyncio
import json
from openai import AsyncOpenAI
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

class MCPClient:
    def __init__(self):
        # Configuration OpenAI custom (ex: IMOLE / LewisNote)
        api_key = os.environ.get("API_KEY_IMOLE")
        base_url = os.environ.get("URL_BASE")
        
        self.llm_client = AsyncOpenAI(api_key=api_key, base_url=base_url)
        self.model = "gpt-5.4-mini" # Modèle utilisé dans community_chat

    async def _run_mcp_chat(self, system_prompt: str, messages: list):
        """
        Exécute le chat avec le LLM en lui donnant accès aux outils du serveur MCP.
        Gère automatiquement la boucle de Tool Calling.
        """
        # Configuration du serveur MCP natif (chemin vers server.py)
        # Assumons que ce script est exécuté depuis la racine de MLBackend ou du conteneur
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        server_path = os.path.join(base_dir, "MCP", "server.py")
        
        server_params = StdioServerParameters(
            command="python",
            args=[server_path],
            env={**os.environ} # Passer l'environnement pour Django
        )

        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                
                # Récupération des outils (Tools) disponibles
                tools_response = await session.list_tools()
                
                # Conversion des outils MCP au format OpenAI Functions/Tools
                openai_tools = []
                for tool in tools_response.tools:
                    # Le MCP jsonSchema correspond directement aux parameters OpenAI
                    openai_tools.append({
                        "type": "function",
                        "function": {
                            "name": tool.name,
                            "description": tool.description,
                            "parameters": tool.inputSchema
                        }
                    })

                full_messages = [{"role": "system", "content": system_prompt}] + messages
                
                # Boucle principale (Tool Calling)
                while True:
                    # On évite de passer tools=[] si vide pour éviter des erreurs API
                    kwargs = {
                        "model": self.model,
                        "messages": full_messages,
                    }
                    if openai_tools:
                        kwargs["tools"] = openai_tools

                    response = await self.llm_client.chat.completions.create(**kwargs)
                    response_message = response.choices[0].message
                    
                    if not response_message.tool_calls:
                        # Le LLM a répondu avec du texte final
                        return response_message.content

                    # Ajouter la réponse du LLM contenant les appels d'outils
                    full_messages.append(response_message.model_dump(exclude_unset=True))
                    
                    # Exécuter les outils demandés par le LLM
                    for tool_call in response_message.tool_calls:
                        tool_name = tool_call.function.name
                        tool_args = json.loads(tool_call.function.arguments)
                        
                        try:
                            # Appel au serveur MCP pour exécuter l'outil
                            result = await session.call_tool(tool_name, tool_args)
                            
                            # Formatage du résultat MCP pour OpenAI
                            # Un tool_result contient text ou image
                            content = "\\n".join([item.text for item in result.content if item.type == "text"])
                            
                            full_messages.append({
                                "role": "tool",
                                "tool_call_id": tool_call.id,
                                "name": tool_name,
                                "content": content
                            })
                        except Exception as e:
                            # En cas d'erreur de l'outil, on informe le LLM
                            full_messages.append({
                                "role": "tool",
                                "tool_call_id": tool_call.id,
                                "name": tool_name,
                                "content": f"Erreur lors de l'exécution: {str(e)}"
                            })

    def chat_sync(self, system_prompt: str, messages: list) -> str:
        """Wrapper synchrone pour Django"""
        from asgiref.sync import async_to_sync
        return async_to_sync(self._run_mcp_chat)(system_prompt, messages)
