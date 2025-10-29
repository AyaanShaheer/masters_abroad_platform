from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.schemas.application import Application, ApplicationCreate, ApplicationUpdate
from app.services import application_service

router = APIRouter()


@router.get("/", response_model=List[Application])
def list_user_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all applications for current user."""
    return application_service.get_user_applications(db, current_user.id)


@router.post("/", response_model=Application)
def create_application(
    application: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create new application."""
    return application_service.create_application(db, current_user.id, application)


@router.put("/{application_id}", response_model=Application)
def update_application(
    application_id: int,
    application_update: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update application."""
    updated_application = application_service.update_application(
        db, application_id, current_user.id, application_update
    )
    if not updated_application:
        raise HTTPException(status_code=404, detail="Application not found")
    return updated_application


@router.delete("/{application_id}")
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete application."""
    success = application_service.delete_application(db, application_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"message": "Application deleted successfully"}
