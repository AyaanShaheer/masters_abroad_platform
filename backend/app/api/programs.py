from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_admin_user
from app.schemas.program import Program, ProgramCreate, ProgramUpdate
from app.services import program_service

router = APIRouter()


@router.get("/", response_model=List[Program])
def list_programs(
    skip: int = 0,
    limit: int = 100,
    country: Optional[str] = Query(None),
    field_of_study: Optional[str] = Query(None),
    university_name: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """List all programs with optional filters."""
    programs = program_service.get_programs(
        db, skip=skip, limit=limit,
        country=country,
        field_of_study=field_of_study,
        university_name=university_name
    )
    return programs


@router.get("/{program_id}", response_model=Program)
def get_program(program_id: int, db: Session = Depends(get_db)):
    """Get program by ID."""
    program = program_service.get_program(db, program_id)
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program


@router.post("/", response_model=Program)
def create_program(
    program: ProgramCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Create new program (Admin only)."""
    return program_service.create_program(db, program)


@router.put("/{program_id}", response_model=Program)
def update_program(
    program_id: int,
    program_update: ProgramUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update program (Admin only)."""
    updated_program = program_service.update_program(db, program_id, program_update)
    if not updated_program:
        raise HTTPException(status_code=404, detail="Program not found")
    return updated_program


@router.delete("/{program_id}")
def delete_program(
    program_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete program (Admin only)."""
    success = program_service.delete_program(db, program_id)
    if not success:
        raise HTTPException(status_code=404, detail="Program not found")
    return {"message": "Program deleted successfully"}
