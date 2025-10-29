from sqlalchemy import Column, Integer, String, Float, Text, Boolean, JSON, DateTime
from datetime import datetime
from app.database.session import Base


class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(Integer, primary_key=True, index=True)
    scholarship_name = Column(String, nullable=False, index=True)
    provider = Column(String, nullable=False)
    
    # Location
    country = Column(String, nullable=False, index=True)
    applicable_programs = Column(JSON, nullable=True)  # List of program fields
    
    # Financial Details
    amount_usd = Column(Float, nullable=True)
    coverage_type = Column(String, nullable=True)  # Full, Partial, Tuition-only, etc.
    
    # Eligibility
    eligible_countries = Column(JSON, nullable=True)  # Student nationalities
    min_gpa = Column(Float, nullable=True)
    required_tests = Column(JSON, nullable=True)  # GRE, TOEFL, etc.
    
    # Details
    description = Column(Text, nullable=True)
    requirements = Column(Text, nullable=True)
    application_process = Column(Text, nullable=True)
    website_url = Column(String, nullable=True)
    
    # Dates
    application_deadline = Column(DateTime, nullable=True)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
