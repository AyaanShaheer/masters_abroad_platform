from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.models.scraper import ScrapedScholarship, UserSubscription
from app.services.scraper_service import scraper_service
from app.services.email_service import send_scholarship_alert
from pydantic import BaseModel

router = APIRouter()


class SubscriptionCreate(BaseModel):
    countries: List[str] = []
    keywords: List[str] = []


class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    email: str
    countries: List[str]
    keywords: List[str]
    is_active: bool
    
    class Config:
        from_attributes = True


@router.post("/scrape/trigger")
def trigger_scraping(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Manually trigger scholarship scraping (admin only)."""
    if current_user.role != "admin":
        return {"error": "Admin access required"}
    
    # Run scraping in background
    background_tasks.add_task(run_scraping_task, db)
    
    return {
        "message": "Scraping task started",
        "status": "running"
    }


def run_scraping_task(db: Session):
    """Background task to scrape scholarships."""
    try:
        new_scholarships = scraper_service.scrape_all_sources(db)
        
        # Send notifications to subscribed users
        if new_scholarships:
            subscriptions = db.query(UserSubscription).filter(
                UserSubscription.is_active == True
            ).all()
            
            for subscription in subscriptions:
                # Filter scholarships based on user preferences
                relevant = [
                    s for s in new_scholarships
                    if not subscription.countries or s.get("country") in subscription.countries
                ]
                
                if relevant:
                    send_scholarship_alert(
                        subscription.email,
                        relevant,
                        subscription.email.split("@")[0]
                    )
        
        return {"scraped": len(new_scholarships)}
    except Exception as e:
        print(f"Error in scraping task: {e}")


@router.get("/scraped", response_model=List[dict])
def get_scraped_scholarships(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get list of scraped scholarships."""
    scholarships = db.query(ScrapedScholarship).offset(skip).limit(limit).all()
    
    return [
        {
            "id": s.id,
            "source_name": s.source_name,
            "title": s.title,
            "description": s.description,
            "amount": s.amount,
            "deadline": s.deadline,
            "country": s.country,
            "created_at": s.created_at.isoformat()
        }
        for s in scholarships
    ]


@router.post("/subscribe", response_model=SubscriptionResponse)
def subscribe_to_alerts(
    subscription: SubscriptionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Subscribe to scholarship alerts."""
    # Check if already subscribed
    existing = db.query(UserSubscription).filter(
        UserSubscription.user_id == current_user.id
    ).first()
    
    if existing:
        # Update existing subscription
        existing.countries = subscription.countries
        existing.keywords = subscription.keywords
        existing.is_active = True
        db.commit()
        return existing
    
    # Create new subscription
    new_subscription = UserSubscription(
        user_id=current_user.id,
        email=current_user.email,
        countries=subscription.countries,
        keywords=subscription.keywords,
        is_active=True
    )
    db.add(new_subscription)
    db.commit()
    db.refresh(new_subscription)
    
    return new_subscription


@router.get("/subscription", response_model=SubscriptionResponse)
def get_subscription(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's subscription."""
    subscription = db.query(UserSubscription).filter(
        UserSubscription.user_id == current_user.id
    ).first()
    
    if not subscription:
        return {
            "id": 0,
            "user_id": current_user.id,
            "email": current_user.email,
            "countries": [],
            "keywords": [],
            "is_active": False
        }
    
    return subscription


@router.delete("/subscription")
def unsubscribe(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Unsubscribe from scholarship alerts."""
    subscription = db.query(UserSubscription).filter(
        UserSubscription.user_id == current_user.id
    ).first()
    
    if subscription:
        subscription.is_active = False
        db.commit()
    
    return {"message": "Unsubscribed successfully"}
