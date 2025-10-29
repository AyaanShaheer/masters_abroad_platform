from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.user import User, UserRole
from app.models.program import Program
from app.models.scholarship import Scholarship
from app.core.security import get_password_hash
from datetime import datetime, timedelta


def seed_data():
    db: Session = SessionLocal()
    
    try:
        # Create admin user
        admin = User(
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            role=UserRole.ADMIN,
            is_active=True
        )
        db.add(admin)
        
        # Create regular user
        user = User(
            email="user@example.com",
            hashed_password=get_password_hash("user123"),
            full_name="Test User",
            role=UserRole.USER,
            is_active=True
        )
        db.add(user)
        
        # Create sample programs
        programs = [
            Program(
                university_name="Stanford University",
                program_name="MS in Computer Science",
                degree_type="Masters",
                country="USA",
                city="Stanford",
                field_of_study="Computer Science",
                duration_months=24,
                tuition_fee_usd=55000,
                application_fee_usd=125,
                min_gpa=3.5,
                min_gre=320,
                min_toefl=100,
                min_ielts=7.0,
                description="World-class CS program with focus on AI and ML",
                website_url="https://cs.stanford.edu",
                application_deadline=datetime.now() + timedelta(days=180)
            ),
            Program(
                university_name="MIT",
                program_name="MS in Data Science",
                degree_type="Masters",
                country="USA",
                city="Cambridge",
                field_of_study="Data Science",
                duration_months=18,
                tuition_fee_usd=58000,
                application_fee_usd=100,
                min_gpa=3.7,
                min_gre=325,
                min_toefl=105,
                min_ielts=7.5,
                description="Cutting-edge data science program",
                website_url="https://mit.edu",
                application_deadline=datetime.now() + timedelta(days=150)
            ),
            Program(
                university_name="University of Toronto",
                program_name="MS in Artificial Intelligence",
                degree_type="Masters",
                country="Canada",
                city="Toronto",
                field_of_study="Artificial Intelligence",
                duration_months=16,
                tuition_fee_usd=35000,
                application_fee_usd=150,
                min_gpa=3.3,
                min_gre=310,
                min_toefl=93,
                min_ielts=6.5,
                description="Leading AI research program",
                website_url="https://utoronto.ca",
                application_deadline=datetime.now() + timedelta(days=200)
            )
        ]
        
        for program in programs:
            db.add(program)
        
        # Create sample scholarships
        scholarships = [
            Scholarship(
                scholarship_name="Fulbright Scholarship",
                provider="US Department of State",
                country="USA",
                applicable_programs=["Computer Science", "Data Science", "Engineering"],
                amount_usd=50000,
                coverage_type="Full",
                eligible_countries=["India", "Pakistan", "Bangladesh", "Nepal"],
                min_gpa=3.5,
                required_tests=["GRE", "TOEFL"],
                description="Prestigious scholarship for international students",
                requirements="Academic excellence, leadership potential",
                application_process="Online application through Fulbright website",
                website_url="https://fulbright.org",
                application_deadline=datetime.now() + timedelta(days=120)
            ),
            Scholarship(
                scholarship_name="Ontario Graduate Scholarship",
                provider="Government of Ontario",
                country="Canada",
                applicable_programs=["All programs"],
                amount_usd=15000,
                coverage_type="Partial",
                eligible_countries=["All"],
                min_gpa=3.7,
                required_tests=[],
                description="Merit-based scholarship for graduate studies in Ontario",
                requirements="Academic excellence",
                application_process="Through university application",
                website_url="https://osap.gov.on.ca",
                application_deadline=datetime.now() + timedelta(days=90)
            )
        ]
        
        for scholarship in scholarships:
            db.add(scholarship)
        
        db.commit()
        print("✅ Sample data seeded successfully!")
        print("\n📧 Login credentials:")
        print("Admin: admin@example.com / admin123")
        print("User: user@example.com / user123")
        
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
