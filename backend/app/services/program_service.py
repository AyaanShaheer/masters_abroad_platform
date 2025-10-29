from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.program import Program
from app.schemas.program import ProgramCreate, ProgramUpdate


def get_program(db: Session, program_id: int) -> Optional[Program]:
    """Get program by ID."""
    return db.query(Program).filter(Program.id == program_id).first()


def get_programs(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    country: Optional[str] = None,
    field_of_study: Optional[str] = None,
    university_name: Optional[str] = None
) -> List[Program]:
    """Get programs with optional filters."""
    query = db.query(Program).filter(Program.is_active == True)
    
    if country:
        query = query.filter(Program.country == country)
    if field_of_study:
        query = query.filter(Program.field_of_study == field_of_study)
    if university_name:
        query = query.filter(Program.university_name.ilike(f"%{university_name}%"))
    
    return query.offset(skip).limit(limit).all()


def create_program(db: Session, program: ProgramCreate) -> Program:
    """Create new program."""
    db_program = Program(**program.model_dump())
    db.add(db_program)
    db.commit()
    db.refresh(db_program)
    return db_program


def update_program(db: Session, program_id: int, program_update: ProgramUpdate) -> Optional[Program]:
    """Update program."""
    db_program = get_program(db, program_id)
    if not db_program:
        return None
    
    update_data = program_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_program, field, value)
    
    db.commit()
    db.refresh(db_program)
    return db_program


def delete_program(db: Session, program_id: int) -> bool:
    """Soft delete program."""
    db_program = get_program(db, program_id)
    if not db_program:
        return False
    
    db_program.is_active = False
    db.commit()
    return True
