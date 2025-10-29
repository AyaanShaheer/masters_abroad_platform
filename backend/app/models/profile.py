from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database.session import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Academic Details
    highest_degree = Column(String, nullable=True)
    field_of_study = Column(String, nullable=True)
    gpa = Column(Float, nullable=True)
    gre_score = Column(Integer, nullable=True)
    toefl_score = Column(Integer, nullable=True)
    ielts_score = Column(Float, nullable=True)
    
    # Preferences
    preferred_countries = Column(JSON, nullable=True)  # List of countries
    preferred_programs = Column(JSON, nullable=True)   # List of programs
    budget_range = Column(String, nullable=True)
    
    # Additional Info
    work_experience_years = Column(Integer, default=0)
    research_experience = Column(Text, nullable=True)
    extracurriculars = Column(Text, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="profile")
