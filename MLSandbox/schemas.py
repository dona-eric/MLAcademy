from pydantic import BaseModel

class CodeExecutionRequest(BaseModel):
    source_code: str
    language_id: int = 71  # Python 3 par défaut
    stdin: str | None = None
    expected_output: str | None = None

class CodeExecutionResponse(BaseModel):
    stdout: str | None = None
    stderr: str | None = None
    compile_output: str | None = None
    time: str | None = None
    memory: int | None = None
    token: str | None = None
    status: dict
