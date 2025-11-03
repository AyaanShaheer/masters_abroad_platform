from pydantic import BaseModel
from typing import Dict


class ProgramScores(BaseModel):
    overall_score: float
    academic_match: float
    test_scores: float
    preferences: float
    affordability: float


class ProgramRecommendation(BaseModel):
    program_id: int
    program_name: str
    university_name: str
    country: str
    field_of_study: str
    tuition_fee_usd: float
    duration_months: int
    scores: ProgramScores
    explanation: str
    
    class Config:
        from_attributes = True
