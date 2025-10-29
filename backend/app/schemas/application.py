from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.application import ApplicationStatus


class ApplicationBase(BaseModel):
    program_id: int
    status: ApplicationStatus = ApplicationStatus.INTERESTED
    notes: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatus] = None
    notes: Optional[str] = None


class Application(ApplicationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
