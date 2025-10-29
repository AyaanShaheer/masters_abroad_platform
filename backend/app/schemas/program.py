from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class ProgramBase(BaseModel):
    university_name: str
    program_name: str
    degree_type: str
    country: str
    city: Optional[str] = None
    field_of_study: str
    duration_months: Optional[int] = None
    tuition_fee_usd: Optional[float] = None
    application_fee_usd: Optional[float] = None
    min_gpa: Optional[float] = None
    min_gre: Optional[int] = None
    min_toefl: Optional[int] = None
    min_ielts: Optional[float] = None
    description: Optional[str] = None
    website_url: Optional[str] = None
    application_deadline: Optional[datetime] = None
    requirements_details: Optional[Dict[str, Any]] = None


class ProgramCreate(ProgramBase):
    pass


class ProgramUpdate(BaseModel):
    university_name: Optional[str] = None
    program_name: Optional[str] = None
    degree_type: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    field_of_study: Optional[str] = None
    duration_months: Optional[int] = None
    tuition_fee_usd: Optional[float] = None
    application_fee_usd: Optional[float] = None
    min_gpa: Optional[float] = None
    min_gre: Optional[int] = None
    min_toefl: Optional[int] = None
    min_ielts: Optional[float] = None
    description: Optional[str] = None
    website_url: Optional[str] = None
    application_deadline: Optional[datetime] = None
    requirements_details: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class Program(ProgramBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
