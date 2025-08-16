from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from models import RetirementInput, RetirementResult, AskAdvisorInput, ArticlesResponse, Article
from retirement import project_savings_to_65
from articles import get_articles_for_age
from advisor import ask_advisor

app = FastAPI(title="Budgetly Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/retirement-plan", response_model=RetirementResult)
def retirement_plan(payload: RetirementInput):
    projected = project_savings_to_65(payload.age, payload.savings, payload.risk_level)
    return {"projected_savings": projected}

@app.post("/ask-advisor")
def ask_advisor_route(body: AskAdvisorInput):
    answer = ask_advisor(body.prompt)
    return {"response": answer}

@app.get("/recommended-articles", response_model=ArticlesResponse)
def recommended_articles(age: int = Query(..., ge=0, lt=120)):
    items = [Article(**a) for a in get_articles_for_age(age)]
    return {"items": items}
