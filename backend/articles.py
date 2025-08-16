from typing import List, Dict

EARLY: List[Dict] = [
    {"title": "Start Early: The Power of Compounding", "url": "https://www.investopedia.com/terms/c/compounding.asp"},
    {"title": "401(k) Basics for New Earners", "url": "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits"},
    {"title": "Beginner’s Guide to Roth vs Traditional", "url": "https://www.investopedia.com/roth-ira-vs-traditional-ira-differences-and-how-to-choose-7485838"}
]
MID: List[Dict] = [
    {"title": "Max Out Contributions in Your 40s–50s", "url": "https://www.dol.gov/general/topic/retirement/planparticipant"},
    {"title": "Building a Pre-Retirement Asset Mix", "url": "https://www.bogleheads.org/wiki/Asset_allocation"},
    {"title": "Catch-up Contributions: What to Know", "url": "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-catch-up-contributions"}
]
LATE: List[Dict] = [
    {"title": "Social Security: When to Claim", "url": "https://www.ssa.gov/benefits/retirement/learn/age.html"},
    {"title": "Safe Withdrawal Strategies", "url": "https://www.investopedia.com/terms/f/foursafewithdrawalrate.asp"},
    {"title": "Required Minimum Distributions (RMDs)", "url": "https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs"}
]

def get_articles_for_age(age: int) -> List[Dict]:
    if age < 40:
        return EARLY
    if 40 <= age <= 59:
        return MID
    return LATE
