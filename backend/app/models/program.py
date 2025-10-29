from sqlalchemy import Column, Integer, String, Float, Text, Boolean, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base


class Program(Base):
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True)
    university_name = Column(String, nullable=False, index=True)
    program_name = Column(String, nullable=False, index=True)
    degree_type = Column(String, nullable=False)  # Masters, PhD, etc.
    
    # Location
    country = Column(String, nullable=False, index=True)
    city = Column(String, nullable=True)
    
    # Program Details
    field_of_study = Column(String, nullable=False, index=True)
    duration_months = Column(Integer, nullable=True)
    tuition_fee_usd = Column(Float, nullable=True)
    application_fee_usd = Column(Float, nullable=True)
    
    # Requirements
    min_gpa = Column(Float, nullable=True)
    min_gre = Column(Integer, nullable=True)
    min_toefl = Column(Integer, nullable=True)
    min_ielts = Column(Float, nullable=True)
    
    # Additional Info
    description = Column(Text, nullable=True)
    website_url = Column(String, nullable=True)
    application_deadline = Column(DateTime, nullable=True)
    requirements_details = Column(JSON, nullable=True)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    applications = relationship("Application", back_populates="program", cascade="all, delete-orphan")
