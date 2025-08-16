import os
import requests
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

SYSTEM_PROMPT = "You're a friendly and helpful retirement advisor."

def ask_advisor(prompt: str) -> str:
    prompt = (prompt or "").strip()
    if not prompt:
        return "Please provide a question about retirement planning, saving, or investing."

    if not OPENAI_API_KEY:
        return ("(Advisor in fallback mode) Tip: automate monthly savings, build a 3–6 month emergency fund, "
                "and keep a diversified allocation aligned with your risk tolerance.")

    try:
        resp = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.4,
            },
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        return f"(Temporary advisor fallback) Consider raising contributions yearly. Details: {e}"
