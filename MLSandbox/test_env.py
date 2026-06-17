import os
import httpx
import base64
from dotenv import load_dotenv

load_dotenv()

JUDGE0_URL = os.getenv("JUDGE0_URL", "http://localhost:2358")
print("Using JUDGE0_URL:", JUDGE0_URL)

payload = {
    "source_code": base64.b64encode("print(123)".encode()).decode(),
    "language_id": 71,  # Python
}

try:
    print("Sending POST request to Judge0...")
    response = httpx.post(
        f"{JUDGE0_URL}/submissions/?base64_encoded=true&wait=true",
        json=payload,
        timeout=10.0
    )
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("Error contacting Judge0:", type(e), str(e))
