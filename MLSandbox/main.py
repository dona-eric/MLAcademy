import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import CodeExecutionRequest, CodeExecutionResponse
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="MLAcademy Sandbox", version="1.0.0")

# Autoriser les requêtes depuis le frontend (et le backend si nécessaire)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration de l'API Judge0 (Public API par défaut pour le dev)
JUDGE0_URL = os.getenv("JUDGE0_URL", "https://judge0-ce.p.rapidapi.com")
JUDGE0_API_KEY = os.getenv("JUDGE0_API_KEY", "")  # Utile si hébergé sur RapidAPI
JUDGE0_HOST = os.getenv("JUDGE0_HOST", "judge0-ce.p.rapidapi.com")
MOCK_JUDGE0 = os.getenv("MOCK_JUDGE0", "true").lower() == "true"


import base64

def encode_base64(text: str | None) -> str | None:
    if text is None:
        return None
    return base64.b64encode(text.encode("utf-8")).decode("utf-8")

def decode_base64(text: str | None) -> str | None:
    if text is None:
        return None
    try:
        return base64.b64decode(text.encode("utf-8")).decode("utf-8")
    except Exception:
        return text

@app.post("/execute", response_model=CodeExecutionResponse)
async def execute_code(request: CodeExecutionRequest):
    """
    Exécute le code soumis via Judge0 et retourne le résultat.
    Utilise base64 pour la sécurité des caractères.
    """
    headers = {
        "Content-Type": "application/json"
    }
    
    if JUDGE0_API_KEY:
        headers["x-rapidapi-key"] = JUDGE0_API_KEY
        headers["x-rapidapi-host"] = JUDGE0_HOST

    payload = {
        "source_code": encode_base64(request.source_code),
        "language_id": request.language_id,
    }
    # N'envoyer que les champs non-nuls pour éviter les erreurs Judge0
    if request.stdin:
        payload["stdin"] = encode_base64(request.stdin)
    if request.expected_output:
        payload["expected_output"] = encode_base64(request.expected_output)

    if MOCK_JUDGE0:
        return CodeExecutionResponse(
            stdout=f"MOCK OUTPUT: {request.source_code[:50]}...",
            status={"id": 3, "description": "Accepted (Mock)"}
        )

    try:
        async with httpx.AsyncClient() as client:
            # Envoi du code à Judge0
            response = await client.post(
                f"{JUDGE0_URL}/submissions/?base64_encoded=true&wait=true",
                json=payload,
                headers=headers,
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            
            # Formattage et décodage de la réponse
            return CodeExecutionResponse(
                stdout=decode_base64(data.get("stdout")),
                stderr=decode_base64(data.get("stderr")),
                compile_output=decode_base64(data.get("compile_output")),
                time=data.get("time"),
                memory=data.get("memory"),
                token=data.get("token"),
                status=data.get("status", {})
            )
            
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=f"Erreur de l'API Judge0 : {exc.response.text}"
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Impossible de contacter le service d'exécution : {str(exc)}"
        )

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "MLSandbox"}
