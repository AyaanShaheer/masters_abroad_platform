from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import logging
from app.database.session import SessionLocal
from app.services.scraper_service import scraper_service
from app.models.scraper import UserSubscription
from app.services.email_service import send_scholarship_alert

logger = logging.getLogger(__name__)


def scheduled_scraping_job():
    """Job to run scholarship scraping automatically."""
    logger.info("🕐 Running scheduled scholarship scraping...")
    
    db = SessionLocal()
    try:
        # Scrape scholarships
        new_scholarships = scraper_service.scrape_all_sources(db)
        logger.info(f"✅ Found {len(new_scholarships)} new scholarships")
        
        # Send notifications to subscribed users
        if new_scholarships:
            subscriptions = db.query(UserSubscription).filter(
                UserSubscription.is_active == True
            ).all()
            
            logger.info(f"📧 Sending notifications to {len(subscriptions)} subscribers")
            
            for subscription in subscriptions:
                # Filter by user preferences
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
        
    except Exception as e:
        logger.error(f"❌ Error in scheduled scraping: {e}")
    finally:
        db.close()


def start_scheduler():
    """Start the background scheduler."""
    scheduler = BackgroundScheduler()
    
    # Run every day at 9 AM
    scheduler.add_job(
        scheduled_scraping_job,
        trigger=CronTrigger(hour=9, minute=0),
        id="scholarship_scraping",
        name="Daily Scholarship Scraping",
        replace_existing=True
    )
    
    # For testing: run every 5 minutes (comment out in production)
    # scheduler.add_job(
    #     scheduled_scraping_job,
    #     trigger=CronTrigger(minute="*/5"),
    #     id="test_scraping",
    #     name="Test Scraping (Every 5 min)",
    #     replace_existing=True
    # )
    
    scheduler.start()
    logger.info("✅ Scheduler started - will run daily at 9 AM")
    
    return scheduler


# Initialize scheduler when module is imported
scheduler = start_scheduler()
