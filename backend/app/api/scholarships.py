from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_admin_user
from app.schemas.scholarship import Scholarship, ScholarshipCreate, ScholarshipUpdate
from app.services import scholarship_service

router = APIRouter()


@router.get("/", response_model=List[Scholarship])
def list_scholarships(
    skip: int = 0,
    limit: int = 100,
    country: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """List all scholarships with optional filters."""
    scholarships = scholarship_service.get_scholarships(
        db, skip=skip, limit=limit, country=country
    )
    return scholarships


@router.get("/{scholarship_id}", response_model=Scholarship)
def get_scholarship(scholarship_id: int, db: Session = Depends(get_db)):
    """Get scholarship by ID."""
    scholarship = scholarship_service.get_scholarship(db, scholarship_id)
    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return scholarship


@router.post("/", response_model=Scholarship)
def create_scholarship(
    scholarship: ScholarshipCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Create new scholarship (Admin only)."""
    return scholarship_service.create_scholarship(db, scholarship)


@router.put("/{scholarship_id}", response_model=Scholarship)
def update_scholarship(
    scholarship_id: int,
    scholarship_update: ScholarshipUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update scholarship (Admin only)."""
    updated_scholarship = scholarship_service.update_scholarship(db, scholarship_id, scholarship_update)
    if not updated_scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return updated_scholarship


@router.delete("/{scholarship_id}")
def delete_scholarship(
    scholarship_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete scholarship (Admin only)."""
    success = scholarship_service.delete_scholarship(db, scholarship_id)
    if not success:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return {"message": "Scholarship deleted successfully"}
