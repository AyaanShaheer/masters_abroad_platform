from pydantic import BaseModel
from typing import Optional, List


class UserProfileBase(BaseModel):
    highest_degree: Optional[str] = None
    field_of_study: Optional[str] = None
    gpa: Optional[float] = None
    gre_score: Optional[int] = None
    toefl_score: Optional[int] = None
    ielts_score: Optional[float] = None
    preferred_countries: Optional[List[str]] = None
    preferred_programs: Optional[List[str]] = None
    budget_range: Optional[str] = None
    work_experience_years: Optional[int] = 0
    research_experience: Optional[str] = None
    extracurriculars: Optional[str] = None


class UserProfileCreate(UserProfileBase):
    pass


class UserProfileUpdate(UserProfileBase):
    pass


class UserProfile(UserProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
