from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database.session import Base


class ApplicationStatus(str, enum.Enum):
    INTERESTED = "interested"
    APPLIED = "applied"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
    
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.INTERESTED, nullable=False)
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="applications")
    program = relationship("Program", back_populates="applications")
