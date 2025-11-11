from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.models.admission import AdmissionPrediction
from app.models.program import Program
from app.services.ml_service import admission_predictor
from app.services import profile_service
from pydantic import BaseModel

router = APIRouter()


class AdmissionPredictionRequest(BaseModel):
    program_ids: List[int]


class ProgramPrediction(BaseModel):
    program_id: int
    program_name: str
    university_name: str
    country: str
    admission_probability: float
    category: str
    confidence_score: float
    suggestions: List[str]
    
    class Config:
        from_attributes = True


class AdmissionAnalysisResponse(BaseModel):
    overall_profile_score: float
    safety_programs: List[ProgramPrediction]
    target_programs: List[ProgramPrediction]
    reach_programs: List[ProgramPrediction]
    general_suggestions: List[str]


@router.post("/predict", response_model=List[ProgramPrediction])
def predict_admission(
    data: AdmissionPredictionRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Predict admission chances for selected programs."""
    
    # Get user profile
    profile = profile_service.get_profile_by_user_id(db, current_user.id)
    if not profile:
        raise HTTPException(
            status_code=404, 
            detail="Please complete your profile first to get predictions"
        )
    
    # Prepare profile data
    user_profile = {
        'gpa': profile.gpa or 3.0,
        'gre_score': profile.gre_score or 300,
        'toefl_score': profile.toefl_score or 90,
        'work_experience_years': profile.work_experience_years or 0,
        'research_publications': 0,  # You can add this field to profile
        'internships': 0,  # You can add this field to profile
    }
    
    predictions = []
    
    for program_id in data.program_ids:
        # Get program details
        program = db.query(Program).filter(Program.id == program_id).first()
        if not program:
            continue
        
        # Get prediction
        prediction = admission_predictor.predict_admission(user_profile)
        
        # Save to database
        db_prediction = AdmissionPrediction(
            user_id=current_user.id,
            program_id=program_id,
            gpa=user_profile['gpa'],
            gre_score=user_profile['gre_score'],
            toefl_score=user_profile['toefl_score'],
            work_experience=user_profile['work_experience_years'],
            research_publications=user_profile['research_publications'],
            admission_probability=prediction['admission_probability'],
            category=prediction['category'],
            confidence_score=prediction['confidence_score'],
            improvement_suggestions=str(prediction['suggestions']),
        )
        db.add(db_prediction)
        
        predictions.append(ProgramPrediction(
            program_id=program.id,
            program_name=program.program_name,
            university_name=program.university_name,
            country=program.country,
            admission_probability=prediction['admission_probability'],
            category=prediction['category'],
            confidence_score=prediction['confidence_score'],
            suggestions=prediction['suggestions'],
        ))
    
    db.commit()
    
    return predictions


@router.get("/analyze", response_model=AdmissionAnalysisResponse)
def analyze_profile(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Analyze user profile and provide comprehensive admission insights."""
    
    # Get user profile
    profile = profile_service.get_profile_by_user_id(db, current_user.id)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Please complete your profile first"
        )
    
    # Get all programs
    programs = db.query(Program).filter(Program.is_active == True).limit(20).all()
    
    user_profile = {
        'gpa': profile.gpa or 3.0,
        'gre_score': profile.gre_score or 300,
        'toefl_score': profile.toefl_score or 90,
        'work_experience_years': profile.work_experience_years or 0,
        'research_publications': 0,
        'internships': 0,
    }
    
    # Define university tiers (you can move this to database later)
    tier_mapping = {
        'Stanford University': 'Top 10',
        'MIT': 'Top 10',
        'Carnegie Mellon University': 'Top 10',
        'UC Berkeley': 'Top 20',
        'University of Toronto': 'Top 20',
        'University of Oxford': 'Top 10',
        'Imperial College London': 'Top 20',
        'University of Melbourne': 'Top 50',
        'Australian National University': 'Top 50',
        'University of British Columbia': 'Top 50',
        'McGill University': 'Top 50',
        'University of Edinburgh': 'Top 50',
    }
    
    safety = []
    target = []
    reach = []
    
    for program in programs:
        # Determine tier
        tier = tier_mapping.get(program.university_name, 'Top 100')
        
        prediction = admission_predictor.predict_admission(user_profile, tier)
        
        prog_pred = ProgramPrediction(
            program_id=program.id,
            program_name=program.program_name,
            university_name=program.university_name,
            country=program.country,
            admission_probability=prediction['admission_probability'],
            category=prediction['category'],
            confidence_score=prediction['confidence_score'],
            suggestions=[],
        )
        
        if prediction['category'] == 'Safety':
            safety.append(prog_pred)
        elif prediction['category'] == 'Target':
            target.append(prog_pred)
        else:
            reach.append(prog_pred)
    
    # Sort by probability
    safety.sort(key=lambda x: x.admission_probability, reverse=True)
    target.sort(key=lambda x: x.admission_probability, reverse=True)
    reach.sort(key=lambda x: x.admission_probability, reverse=True)
    
    # Calculate overall profile score
    overall_score = (
        (user_profile['gpa'] / 4.0) * 30 +
        (user_profile['gre_score'] / 340) * 30 +
        (user_profile['toefl_score'] / 120) * 20 +
        (min(user_profile['work_experience_years'], 4) / 4) * 20
    )
    
    # Get general suggestions
    general_prediction = admission_predictor.predict_admission(user_profile, 'Top 50')
    
    return AdmissionAnalysisResponse(
        overall_profile_score=round(overall_score, 2),
        safety_programs=safety[:5],
        target_programs=target[:5],
        reach_programs=reach[:5],
        general_suggestions=general_prediction['suggestions']
    )



@router.get("/history")
def get_prediction_history(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's prediction history."""
    
    predictions = db.query(AdmissionPrediction).filter(
        AdmissionPrediction.user_id == current_user.id
    ).order_by(AdmissionPrediction.created_at.desc()).limit(50).all()
    
    result = []
    for pred in predictions:
        program = db.query(Program).filter(Program.id == pred.program_id).first()
        if program:
            result.append({
                'id': pred.id,
                'program_name': program.program_name,
                'university_name': program.university_name,
                'admission_probability': pred.admission_probability,
                'category': pred.category,
                'created_at': pred.created_at.isoformat(),
            })
    
    return result
