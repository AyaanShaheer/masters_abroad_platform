from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON
from datetime import datetime
from app.database.session import Base


class ScrapedScholarship(Base):
    __tablename__ = "scraped_scholarships"
    
    id = Column(Integer, primary_key=True, index=True)
    source_url = Column(String, nullable=False)
    source_name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    amount = Column(String)
    deadline = Column(String)
    country = Column(String)
    raw_data = Column(JSON)
    is_notified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class UserSubscription(Base):
    __tablename__ = "user_subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    email = Column(String, nullable=False)
    countries = Column(JSON)  # List of interested countries
    keywords = Column(JSON)  # List of keywords to monitor
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
