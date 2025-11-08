import logging
from app.database.session import engine, Base
from app.models import user, program, scholarship, application, profile, chat, scraper  # Added scraper

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_database():
    """Initialize database - create all tables."""
    logger.info("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    
    logger.info("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    logger.info("✅ Database initialized successfully!")


if __name__ == "__main__":
    init_database()
