def project_savings_to_65(age: int, savings: float, risk_level: str) -> float:
    years = max(0, 65 - age)
    rates = {'low': 0.04, 'medium': 0.06, 'high': 0.08}
    rate = rates[risk_level.lower()]
    return round(savings * ((1 + rate) ** years), 2)
