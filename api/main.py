from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import requests

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama3-8b-8192"  # or your preferred Groq model

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
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": GROQ_MODEL,
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
    return {"message": "Email Rewriter API is working with Groq!"}
