from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class ScholarshipBase(BaseModel):
    scholarship_name: str
    provider: str
    country: str
    applicable_programs: Optional[List[str]] = None
    amount_usd: Optional[float] = None
    coverage_type: Optional[str] = None
    eligible_countries: Optional[List[str]] = None
    min_gpa: Optional[float] = None
    required_tests: Optional[List[str]] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    application_process: Optional[str] = None
    website_url: Optional[str] = None
    application_deadline: Optional[datetime] = None


class ScholarshipCreate(ScholarshipBase):
    pass


class ScholarshipUpdate(BaseModel):
    scholarship_name: Optional[str] = None
    provider: Optional[str] = None
    country: Optional[str] = None
    applicable_programs: Optional[List[str]] = None
    amount_usd: Optional[float] = None
    coverage_type: Optional[str] = None
    eligible_countries: Optional[List[str]] = None
    min_gpa: Optional[float] = None
    required_tests: Optional[List[str]] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    application_process: Optional[str] = None
    website_url: Optional[str] = None
    application_deadline: Optional[datetime] = None
    is_active: Optional[bool] = None


class Scholarship(ScholarshipBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
