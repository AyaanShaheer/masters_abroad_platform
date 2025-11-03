from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.schemas.recommendation import ProgramRecommendation, ProgramScores
from app.services.recommendation_service import recommendation_service

router = APIRouter()


@router.get("/", response_model=List[ProgramRecommendation])
def get_recommendations(
    limit: int = 10,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get personalized program recommendations."""
    recommendations = recommendation_service.get_recommendations(
        db, 
        current_user.id, 
        limit
    )
    
    if not recommendations:
        return []
    
    result = []
    for rec in recommendations:
        program = rec['program']
        result.append({
            'program_id': program.id,
            'program_name': program.program_name,
            'university_name': program.university_name,
            'country': program.country,
            'field_of_study': program.field_of_study,
            'tuition_fee_usd': program.tuition_fee_usd or 0,
            'duration_months': program.duration_months,
            'scores': rec['scores'],
            'explanation': rec['explanation'],
        })
    
    return result
