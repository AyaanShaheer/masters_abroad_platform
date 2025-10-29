from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.scholarship import Scholarship
from app.schemas.scholarship import ScholarshipCreate, ScholarshipUpdate


def get_scholarship(db: Session, scholarship_id: int) -> Optional[Scholarship]:
    """Get scholarship by ID."""
    return db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()


def get_scholarships(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    country: Optional[str] = None
) -> List[Scholarship]:
    """Get scholarships with optional filters."""
    query = db.query(Scholarship).filter(Scholarship.is_active == True)
    
    if country:
        query = query.filter(Scholarship.country == country)
    
    return query.offset(skip).limit(limit).all()


def create_scholarship(db: Session, scholarship: ScholarshipCreate) -> Scholarship:
    """Create new scholarship."""
    db_scholarship = Scholarship(**scholarship.model_dump())
    db.add(db_scholarship)
    db.commit()
    db.refresh(db_scholarship)
    return db_scholarship


def update_scholarship(db: Session, scholarship_id: int, scholarship_update: ScholarshipUpdate) -> Optional[Scholarship]:
    """Update scholarship."""
    db_scholarship = get_scholarship(db, scholarship_id)
    if not db_scholarship:
        return None
    
    update_data = scholarship_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_scholarship, field, value)
    
    db.commit()
    db.refresh(db_scholarship)
    return db_scholarship


def delete_scholarship(db: Session, scholarship_id: int) -> bool:
    """Soft delete scholarship."""
    db_scholarship = get_scholarship(db, scholarship_id)
    if not db_scholarship:
        return False
    
    db_scholarship.is_active = False
    db.commit()
    return True
