from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.models.sop import SOP
from app.models.program import Program
from app.schemas.sop import (
    SOPGenerate, SOPAnalyze, SOPImprove,
    SOPResponse, SOPAnalysisResponse, SOPCreateUpdate
)
from app.services.sop_service import sop_service
from app.services import profile_service

router = APIRouter()


@router.post("/generate")
def generate_sop(
    data: SOPGenerate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate AI-powered SOP based on user profile."""
    
    # Get user profile
    profile = profile_service.get_profile_by_user_id(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Please create your profile first")
    
    # Get program details if specified
    program_details = None
    if data.program_id:
        program = db.query(Program).filter(Program.id == data.program_id).first()
        if program:
            program_details = {
                'university_name': program.university_name,
                'program_name': program.program_name,
                'country': program.country,
                'field_of_study': program.field_of_study,
            }
    
    # Prepare user profile data
    user_profile = {
        'full_name': current_user.full_name,
        'field_of_study': profile.field_of_study,
        'highest_degree': profile.highest_degree,
        'gpa': profile.gpa,
        'work_experience_years': profile.work_experience_years,
        'research_experience': profile.research_experience,
        'extracurriculars': profile.extracurriculars,
    }
    
    # Generate SOP
    sop_text = sop_service.generate_sop(user_profile, program_details)
    
    # Save to database
    sop = SOP(
        user_id=current_user.id,
        title=f"SOP for {program_details['program_name'] if program_details else 'Graduate Program'}",
        content=sop_text,
        program_id=data.program_id,
        is_generated=True,
        word_count=len(sop_text.split())
    )
    db.add(sop)
    db.commit()
    db.refresh(sop)
    
    return {
        "sop_id": sop.id,
        "content": sop_text,
        "word_count": len(sop_text.split())
    }


@router.post("/analyze", response_model=SOPAnalysisResponse)
def analyze_sop(
    data: SOPAnalyze,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Analyze SOP and provide detailed feedback."""
    
    # Analyze SOP
    analysis = sop_service.analyze_sop(data.sop_text)
    
    if "error" in analysis:
        raise HTTPException(status_code=500, detail=analysis["error"])
    
    # Save analysis to database
    sop = SOP(
        user_id=current_user.id,
        title="Analyzed SOP",
        content=data.sop_text,
        overall_score=analysis['overall_score'],
        clarity_score=analysis['clarity_score'],
        motivation_score=analysis['motivation_score'],
        coherence_score=analysis['coherence_score'],
        relevance_score=analysis['relevance_score'],
        grammar_score=analysis['grammar_score'],
        strengths=analysis['strengths'],
        weaknesses=analysis['weaknesses'],
        suggestions=analysis['suggestions'],
        word_count=analysis['word_count'],
        reading_level=analysis['reading_level'],
        is_generated=False
    )
    db.add(sop)
    db.commit()
    
    return analysis


@router.post("/improve/{sop_id}")
def improve_sop(
    sop_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate improved version of SOP."""
    
    # Get SOP
    sop = db.query(SOP).filter(
        SOP.id == sop_id,
        SOP.user_id == current_user.id
    ).first()
    
    if not sop:
        raise HTTPException(status_code=404, detail="SOP not found")
    
    # Prepare analysis for improvement
    analysis = {
        'weaknesses': sop.weaknesses or [],
        'suggestions': sop.suggestions or [],
    }
    
    # Generate improved version
    improved_text = sop_service.improve_sop(sop.content, analysis)
    
    # Save as new version
    new_sop = SOP(
        user_id=current_user.id,
        title=f"{sop.title} (Improved v{sop.version + 1})",
        content=improved_text,
        program_id=sop.program_id,
        is_generated=True,
        version=sop.version + 1,
        word_count=len(improved_text.split())
    )
    db.add(new_sop)
    db.commit()
    db.refresh(new_sop)
    
    return {
        "sop_id": new_sop.id,
        "content": improved_text,
        "word_count": len(improved_text.split())
    }


@router.get("/", response_model=List[SOPResponse])
def get_user_sops(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all SOPs for current user."""
    
    sops = db.query(SOP).filter(SOP.user_id == current_user.id).order_by(SOP.created_at.desc()).all()
    return sops


@router.get("/{sop_id}", response_model=SOPResponse)
def get_sop(
    sop_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific SOP."""
    
    sop = db.query(SOP).filter(
        SOP.id == sop_id,
        SOP.user_id == current_user.id
    ).first()
    
    if not sop:
        raise HTTPException(status_code=404, detail="SOP not found")
    
    return sop


@router.put("/{sop_id}")
def update_sop(
    sop_id: int,
    data: SOPCreateUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update SOP."""
    
    sop = db.query(SOP).filter(
        SOP.id == sop_id,
        SOP.user_id == current_user.id
    ).first()
    
    if not sop:
        raise HTTPException(status_code=404, detail="SOP not found")
    
    sop.title = data.title
    sop.content = data.content
    sop.program_id = data.program_id
    sop.word_count = len(data.content.split())
    
    db.commit()
    return {"message": "SOP updated successfully"}


@router.delete("/{sop_id}")
def delete_sop(
    sop_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete SOP."""
    
    sop = db.query(SOP).filter(
        SOP.id == sop_id,
        SOP.user_id == current_user.id
    ).first()
    
    if not sop:
        raise HTTPException(status_code=404, detail="SOP not found")
    
    db.delete(sop)
    db.commit()
    
    return {"message": "SOP deleted successfully"}
