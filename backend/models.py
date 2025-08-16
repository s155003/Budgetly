from pydantic import BaseModel, Field
from typing import List

class RetirementInput(BaseModel):
    age: int = Field(..., ge=0, lt=120)
    income: float = Field(..., ge=0)
    savings: float = Field(..., ge=0)
    risk_level: str = Field(..., pattern="^(low|medium|high)$")

class RetirementResult(BaseModel):
    projected_savings: float

class AskAdvisorInput(BaseModel):
    prompt: str

class Article(BaseModel):
    title: str
    url: str

class ArticlesResponse(BaseModel):
    items: List[Article]
