from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationUpdate


def get_application(db: Session, application_id: int) -> Optional[Application]:
    """Get application by ID."""
    return db.query(Application).filter(Application.id == application_id).first()


def get_user_applications(db: Session, user_id: int) -> List[Application]:
    """Get all applications for a user."""
    return db.query(Application).filter(Application.user_id == user_id).all()


def create_application(db: Session, user_id: int, application: ApplicationCreate) -> Application:
    """Create new application."""
    db_application = Application(
        user_id=user_id,
        **application.model_dump()
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application


def update_application(db: Session, application_id: int, user_id: int, application_update: ApplicationUpdate) -> Optional[Application]:
    """Update application."""
    db_application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == user_id
    ).first()
    
    if not db_application:
        return None
    
    update_data = application_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_application, field, value)
    
    db.commit()
    db.refresh(db_application)
    return db_application


def delete_application(db: Session, application_id: int, user_id: int) -> bool:
    """Delete application."""
    db_application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == user_id
    ).first()
    
    if not db_application:
        return False
    
    db.delete(db_application)
    db.commit()
    return True
