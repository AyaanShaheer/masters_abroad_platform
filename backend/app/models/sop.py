from sqlalchemy import Column, Integer, String, Text, DateTime, Float, JSON, ForeignKey, Boolean
from datetime import datetime
from app.database.session import Base


class SOP(Base):
    __tablename__ = "sops"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=True)
    
    # AI Analysis Results
    overall_score = Column(Float)
    clarity_score = Column(Float)
    motivation_score = Column(Float)
    coherence_score = Column(Float)
    relevance_score = Column(Float)
    grammar_score = Column(Float)
    
    # Detailed Feedback
    strengths = Column(JSON)  # List of strengths
    weaknesses = Column(JSON)  # List of weaknesses
    suggestions = Column(JSON)  # List of improvement suggestions
    
    word_count = Column(Integer)
    reading_level = Column(String)
    
    is_generated = Column(Boolean, default=False)  # True if AI-generated
    version = Column(Integer, default=1)  # Version tracking
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SOPTemplate(Base):
    __tablename__ = "sop_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    template_text = Column(Text, nullable=False)
    field_of_study = Column(String)
    country = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
