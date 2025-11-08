import logging
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.user import User
from app.models.program import Program
from app.models.scholarship import Scholarship
from app.core.security import get_password_hash
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def seed_users(db: Session):
    """Seed sample users."""
    users_data = [
        {
            "email": "admin@example.com",
            "password": "admin123",
            "full_name": "Admin User",
            "role": "admin",
        },
        {
            "email": "user@example.com",
            "password": "user123",
            "full_name": "Test User",
            "role": "user",
        },
    ]
    
    for user_data in users_data:
        existing_user = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing_user:
            user = User(
                email=user_data["email"],
                hashed_password=get_password_hash(user_data["password"]),
                full_name=user_data["full_name"],
                role=user_data["role"],
                is_active=True,
            )
            db.add(user)
    
    db.commit()
    logger.info("✅ Seeded users")


def seed_programs(db: Session):
    """Seed comprehensive program data."""
    programs_data = [
        # USA Programs
        {
            "university_name": "Stanford University",
            "program_name": "MS in Computer Science",
            "degree_type": "Masters",
            "country": "USA",
            "city": "Stanford, CA",
            "field_of_study": "Computer Science",
            "duration_months": 24,
            "tuition_fee_usd": 65000,
            "application_fee_usd": 125,
            "min_gpa": 3.5,
            "min_gre": 320,
            "min_toefl": 100,
            "min_ielts": 7.0,
            "description": "World-class CS program with focus on AI and ML",
            "website_url": "https://cs.stanford.edu",
            "application_deadline": datetime.now() + timedelta(days=180),
        },
        {
            "university_name": "MIT",
            "program_name": "MS in Data Science",
            "degree_type": "Masters",
            "country": "USA",
            "city": "Cambridge, MA",
            "field_of_study": "Data Science",
            "duration_months": 18,
            "tuition_fee_usd": 58000,
            "application_fee_usd": 100,
            "min_gpa": 3.7,
            "min_gre": 325,
            "min_toefl": 105,
            "min_ielts": 7.5,
            "description": "Cutting-edge data science program",
            "website_url": "https://idss.mit.edu",
            "application_deadline": datetime.now() + timedelta(days=150),
        },
        {
            "university_name": "Carnegie Mellon University",
            "program_name": "MS in Machine Learning",
            "degree_type": "Masters",
            "country": "USA",
            "city": "Pittsburgh, PA",
            "field_of_study": "Machine Learning",
            "duration_months": 24,
            "tuition_fee_usd": 62000,
            "application_fee_usd": 100,
            "min_gpa": 3.6,
            "min_gre": 322,
            "min_toefl": 102,
            "min_ielts": 7.0,
            "description": "Top-ranked ML program with industry connections",
            "website_url": "https://www.ml.cmu.edu",
            "application_deadline": datetime.now() + timedelta(days=160),
        },
        {
            "university_name": "UC Berkeley",
            "program_name": "MS in Information Systems",
            "degree_type": "Masters",
            "country": "USA",
            "city": "Berkeley, CA",
            "field_of_study": "Information Systems",
            "duration_months": 20,
            "tuition_fee_usd": 55000,
            "application_fee_usd": 120,
            "min_gpa": 3.4,
            "min_gre": 315,
            "min_toefl": 98,
            "min_ielts": 7.0,
            "description": "Industry-oriented IS program",
            "website_url": "https://www.ischool.berkeley.edu",
            "application_deadline": datetime.now() + timedelta(days=200),
        },
        
        # Canada Programs
        {
            "university_name": "University of Toronto",
            "program_name": "MS in Artificial Intelligence",
            "degree_type": "Masters",
            "country": "Canada",
            "city": "Toronto, ON",
            "field_of_study": "Artificial Intelligence",
            "duration_months": 16,
            "tuition_fee_usd": 35000,
            "application_fee_usd": 125,
            "min_gpa": 3.3,
            "min_gre": 310,
            "min_toefl": 100,
            "min_ielts": 7.0,
            "description": "Leading AI research program",
            "website_url": "https://vectorinstitute.ai",
            "application_deadline": datetime.now() + timedelta(days=170),
        },
        {
            "university_name": "University of British Columbia",
            "program_name": "MS in Computer Science",
            "degree_type": "Masters",
            "country": "Canada",
            "city": "Vancouver, BC",
            "field_of_study": "Computer Science",
            "duration_months": 24,
            "tuition_fee_usd": 32000,
            "application_fee_usd": 100,
            "min_gpa": 3.3,
            "min_gre": 310,
            "min_toefl": 95,
            "min_ielts": 6.5,
            "description": "Comprehensive CS program with co-op opportunities",
            "website_url": "https://www.cs.ubc.ca",
            "application_deadline": datetime.now() + timedelta(days=190),
        },
        {
            "university_name": "McGill University",
            "program_name": "MS in Data Science",
            "degree_type": "Masters",
            "country": "Canada",
            "city": "Montreal, QC",
            "field_of_study": "Data Science",
            "duration_months": 18,
            "tuition_fee_usd": 28000,
            "application_fee_usd": 100,
            "min_gpa": 3.2,
            "min_gre": 308,
            "min_toefl": 93,
            "min_ielts": 6.5,
            "description": "Bilingual program with strong industry ties",
            "website_url": "https://www.mcgill.ca",
            "application_deadline": datetime.now() + timedelta(days=180),
        },
        
        # UK Programs
        {
            "university_name": "University of Oxford",
            "program_name": "MSc in Computer Science",
            "degree_type": "Masters",
            "country": "UK",
            "city": "Oxford",
            "field_of_study": "Computer Science",
            "duration_months": 12,
            "tuition_fee_usd": 45000,
            "application_fee_usd": 75,
            "min_gpa": 3.6,
            "min_gre": None,
            "min_toefl": 100,
            "min_ielts": 7.5,
            "description": "Prestigious one-year intensive program",
            "website_url": "https://www.cs.ox.ac.uk",
            "application_deadline": datetime.now() + timedelta(days=140),
        },
        {
            "university_name": "Imperial College London",
            "program_name": "MSc in Artificial Intelligence",
            "degree_type": "Masters",
            "country": "UK",
            "city": "London",
            "field_of_study": "Artificial Intelligence",
            "duration_months": 12,
            "tuition_fee_usd": 42000,
            "application_fee_usd": 80,
            "min_gpa": 3.5,
            "min_gre": None,
            "min_toefl": 100,
            "min_ielts": 7.0,
            "description": "Top-ranked AI program in London",
            "website_url": "https://www.imperial.ac.uk",
            "application_deadline": datetime.now() + timedelta(days=150),
        },
        {
            "university_name": "University of Edinburgh",
            "program_name": "MSc in Data Science",
            "degree_type": "Masters",
            "country": "UK",
            "city": "Edinburgh",
            "field_of_study": "Data Science",
            "duration_months": 12,
            "tuition_fee_usd": 38000,
            "application_fee_usd": 70,
            "min_gpa": 3.3,
            "min_gre": None,
            "min_toefl": 95,
            "min_ielts": 6.5,
            "description": "Strong research-focused program",
            "website_url": "https://www.ed.ac.uk",
            "application_deadline": datetime.now() + timedelta(days=160),
        },
        
        # Australia Programs
        {
            "university_name": "University of Melbourne",
            "program_name": "Master of Information Technology",
            "degree_type": "Masters",
            "country": "Australia",
            "city": "Melbourne",
            "field_of_study": "Information Technology",
            "duration_months": 24,
            "tuition_fee_usd": 40000,
            "application_fee_usd": 100,
            "min_gpa": 3.0,
            "min_gre": None,
            "min_toefl": 94,
            "min_ielts": 6.5,
            "description": "Comprehensive IT program with specializations",
            "website_url": "https://www.unimelb.edu.au",
            "application_deadline": datetime.now() + timedelta(days=210),
        },
        {
            "university_name": "Australian National University",
            "program_name": "Master of Computing",
            "degree_type": "Masters",
            "country": "Australia",
            "city": "Canberra",
            "field_of_study": "Computing",
            "duration_months": 24,
            "tuition_fee_usd": 38000,
            "application_fee_usd": 100,
            "min_gpa": 3.2,
            "min_gre": None,
            "min_toefl": 95,
            "min_ielts": 6.5,
            "description": "Research-intensive computing program",
            "website_url": "https://www.anu.edu.au",
            "application_deadline": datetime.now() + timedelta(days=200),
        },
    ]
    
    for program_data in programs_data:
        existing_program = db.query(Program).filter(
            Program.university_name == program_data["university_name"],
            Program.program_name == program_data["program_name"]
        ).first()
        
        if not existing_program:
            program = Program(**program_data)
            db.add(program)
    
    db.commit()
    logger.info("✅ Seeded programs")


def seed_scholarships(db: Session):
    """Seed comprehensive scholarship data."""
    scholarships_data = [
        # USA Scholarships
        {
            "scholarship_name": "Fulbright Scholarship",
            "provider": "US Department of State",
            "country": "USA",
            "amount_usd": 50000,
            "coverage_type": "Full Tuition + Living",
            "eligible_countries": ["All Countries"],
            "applicable_programs": ["All Graduate Programs"],
            "min_gpa": 3.5,
            "description": "Premier international exchange program",
            "requirements": "Strong academics, leadership, community service",
            "application_process": "Online application through IIE portal",
            "website_url": "https://foreign.fulbrightonline.org",
            "application_deadline": datetime.now() + timedelta(days=180),
        },
        {
            "scholarship_name": "MIT Presidential Fellowship",
            "provider": "MIT",
            "country": "USA",
            "amount_usd": 45000,
            "coverage_type": "Full Tuition",
            "eligible_countries": ["All Countries"],
            "applicable_programs": ["Science", "Engineering"],
            "min_gpa": 3.7,
            "description": "Merit-based fellowship for exceptional students",
            "requirements": "Exceptional academic record, research potential",
            "application_process": "Automatic consideration with admission",
            "website_url": "https://oge.mit.edu",
            "application_deadline": datetime.now() + timedelta(days=150),
        },
        
        # Canada Scholarships
        {
            "scholarship_name": "Ontario Graduate Scholarship",
            "provider": "Government of Ontario",
            "country": "Canada",
            "amount_usd": 15000,
            "coverage_type": "Partial Tuition",
            "eligible_countries": ["All Countries"],
            "applicable_programs": ["All Graduate Programs"],
            "min_gpa": 3.5,
            "description": "Provincial scholarship for graduate students",
            "requirements": "Strong academics, research proposal",
            "application_process": "Through university portal",
            "website_url": "https://www.osap.gov.on.ca",
            "application_deadline": datetime.now() + timedelta(days=200),
        },
        {
            "scholarship_name": "Vanier Canada Graduate Scholarship",
            "provider": "Government of Canada",
            "country": "Canada",
            "amount_usd": 50000,
            "coverage_type": "Full Coverage",
            "eligible_countries": ["All Countries"],
            "applicable_programs": ["PhD Programs"],
            "min_gpa": 3.7,
            "description": "Prestigious doctoral scholarship",
            "requirements": "Outstanding academic record, leadership",
            "application_process": "Nomination by Canadian university",
            "website_url": "https://vanier.gc.ca",
            "application_deadline": datetime.now() + timedelta(days=170),
        },
        
        # UK Scholarships
        {
            "scholarship_name": "Chevening Scholarship",
            "provider": "UK Government",
            "country": "UK",
            "amount_usd": 40000,
            "coverage_type": "Full Coverage",
            "eligible_countries": ["160+ Countries"],
            "applicable_programs": ["All Masters Programs"],
            "min_gpa": 3.3,
            "description": "UK government's global scholarship program",
            "requirements": "Leadership potential, work experience",
            "application_process": "Online application portal",
            "website_url": "https://www.chevening.org",
            "application_deadline": datetime.now() + timedelta(days=220),
        },
        {
            "scholarship_name": "Rhodes Scholarship",
            "provider": "Rhodes Trust",
            "country": "UK",
            "amount_usd": 60000,
            "coverage_type": "Full Coverage",
            "eligible_countries": ["Selected Countries"],
            "applicable_programs": ["Oxford University"],
            "min_gpa": 3.8,
            "description": "World's most prestigious scholarship",
            "requirements": "Exceptional academics, leadership, character",
            "application_process": "Country-specific selection process",
            "website_url": "https://www.rhodeshouse.ox.ac.uk",
            "application_deadline": datetime.now() + timedelta(days=200),
        },
        
        # Australia Scholarships
        {
            "scholarship_name": "Australia Awards",
            "provider": "Australian Government",
            "country": "Australia",
            "amount_usd": 35000,
            "coverage_type": "Full Coverage",
            "eligible_countries": ["Developing Countries"],
            "applicable_programs": ["All Graduate Programs"],
            "min_gpa": 3.0,
            "description": "Development-focused scholarship",
            "requirements": "Commitment to development goals",
            "application_process": "Online through OASIS portal",
            "website_url": "https://www.australiaawardspacific.org",
            "application_deadline": datetime.now() + timedelta(days=190),
        },
        {
            "scholarship_name": "Melbourne International Fee Remission",
            "provider": "University of Melbourne",
            "country": "Australia",
            "amount_usd": 20000,
            "coverage_type": "Partial Tuition",
            "eligible_countries": ["All Countries"],
            "applicable_programs": ["Research Programs"],
            "min_gpa": 3.5,
            "description": "Merit-based tuition waiver",
            "requirements": "Strong research potential",
            "application_process": "Automatic with admission",
            "website_url": "https://scholarships.unimelb.edu.au",
            "application_deadline": datetime.now() + timedelta(days=180),
        },
    ]
    
    for scholarship_data in scholarships_data:
        existing_scholarship = db.query(Scholarship).filter(
            Scholarship.scholarship_name == scholarship_data["scholarship_name"]
        ).first()
        
        if not existing_scholarship:
            scholarship = Scholarship(**scholarship_data)
            db.add(scholarship)
    
    db.commit()
    logger.info("✅ Seeded scholarships")


def main():
    """Main seeding function."""
    logger.info("🌱 Starting database seeding...")
    
    db = SessionLocal()
    try:
        seed_users(db)
        seed_programs(db)
        seed_scholarships(db)
        logger.info("🎉 Database seeding completed successfully!")
    except Exception as e:
        logger.error(f"❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
