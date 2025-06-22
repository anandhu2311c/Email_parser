from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import requests

load_dotenv()

_API_KEY = os.getenv("_API_KEY")

LLM_MODEL = "llama3-8b-8192" 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailRequest(BaseModel):
    email: str
    style: str

@app.post("/rewrite-email/")
async def rewrite_email(data: EmailRequest):
    prompt = f"""
You are an AI email assistant. Rewrite this email in a {data.style} tone:

\"\"\"{data.email}\"\"\"
"""

    headers = {
        "Authorization": f"Bearer {_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": LLM_MODEL,
        "messages": [
            {"role": "system", "content": "You are an email assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 300
    }

    response = requests.post(GROQ_API_URL, headers=headers, json=body)

    if response.status_code == 200:
        result = response.json()
        return {"rewritten_email": result["choices"][0]["message"]["content"].strip()}
    else:
        return {"error": f"Error {response.status_code}: {response.text}"}

@app.get("/")
def root():
    return {"message": "Email Rewriter API is working "}
