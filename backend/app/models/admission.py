from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from datetime import datetime
from app.database.session import Base


class AdmissionPrediction(Base):
    __tablename__ = "admission_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
    
    # Input Features
    gpa = Column(Float)
    gre_score = Column(Integer)
    toefl_score = Column(Integer)
    work_experience = Column(Integer)
    research_publications = Column(Integer)
    
    # Predictions
    admission_probability = Column(Float)  # 0-100%
    category = Column(String)  # Safety, Target, Reach
    confidence_score = Column(Float)
    
    # Comparison Data
    avg_admitted_gpa = Column(Float)
    avg_admitted_gre = Column(Integer)
    percentile_rank = Column(Float)
    
    # Suggestions
    improvement_suggestions = Column(String)
    
    created_at = Column(DateTime, default=datetime.utcnow)


class AdmissionDataPoint(Base):
    """Historical admission data for training ML model"""
    __tablename__ = "admission_data_points"
    
    id = Column(Integer, primary_key=True, index=True)
    program_id = Column(Integer, ForeignKey("programs.id"))
    university_tier = Column(String)  # Top 10, Top 50, Top 100
    
    # Applicant Profile
    gpa = Column(Float)
    gre_quant = Column(Integer)
    gre_verbal = Column(Integer)
    gre_total = Column(Integer)
    toefl_score = Column(Integer)
    work_experience_months = Column(Integer)
    research_publications = Column(Integer)
    internships = Column(Integer)
    
    # Outcome
    admitted = Column(Boolean)  # True if admitted
    
    # Additional Info
    field_of_study = Column(String)
    country = Column(String)
    year = Column(Integer)
    
    created_at = Column(DateTime, default=datetime.utcnow)
