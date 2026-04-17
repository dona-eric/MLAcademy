from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel
from typing import Optional
import os

app = FastAPI(
    title="MLAcademy Python Service",
    description="Exécution sécurisée de code Python pour les notebooks interactifs",
    version="0.1.0",
    docs_url="/docs" if os.getenv("ENV") != "production" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class CodeExecutionRequest(BaseModel):
    code: str
    language: str = "python"
    timeout: int = 10
    session_id: Optional[str] = None

class CodeExecutionResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int
    execution_time_ms: int
    plots: list[str] = []

@app.get("/health")
async def health():
    return {"status": "ok", "service": "mlacademy-python"}

@app.post("/execute", response_model=CodeExecutionResponse)
async def execute_code(request: CodeExecutionRequest):
    """Exécute du code Python dans un sandbox isolé."""
    from src.services.executor import run_code_sandbox
    return await run_code_sandbox(request)

@app.post("/validate")
async def validate_code(request: CodeExecutionRequest):
    """Valide la syntaxe du code sans l'exécuter."""
    import ast
    try:
        ast.parse(request.code)
        return {"valid": True}
    except SyntaxError as e:
        return {"valid": False, "error": str(e)}
