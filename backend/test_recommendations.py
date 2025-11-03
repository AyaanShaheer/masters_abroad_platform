from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.services.recommendation_service import recommendation_service
from app.services import profile_service
from app.schemas.profile import UserProfileCreate

def test_recommendations():
    db = SessionLocal()
    
    try:
        # Get or create test user profile
        user_id = 2  # Change to your user ID
        
        profile = profile_service.get_profile_by_user_id(db, user_id)
        if not profile:
            print("Creating test profile...")
            profile_data = UserProfileCreate(
                highest_degree="Bachelor's",
                field_of_study="Computer Science",
                gpa=3.7,
                gre_score=325,
                toefl_score=105,
                ielts_score=None,
                preferred_countries=["USA", "Canada"],
                preferred_programs=["Computer Science", "Data Science"],
                budget_range="40000-60000",
                work_experience_years=2,
                research_experience="Published 2 papers in ML",
                extracurriculars="Coding competitions, hackathons"
            )
            profile = profile_service.create_profile(db, user_id, profile_data)
            print("✅ Profile created")
        
        # Get recommendations
        print("\nGetting recommendations...")
        recommendations = recommendation_service.get_recommendations(db, user_id, limit=5)
        
        print(f"\n📊 Top {len(recommendations)} Recommendations:\n")
        
        for i, rec in enumerate(recommendations, 1):
            program = rec['program']
            scores = rec['scores']
            
            print(f"{i}. {program.program_name} - {program.university_name}")
            print(f"   Overall Score: {scores['overall_score']:.1f}%")
            print(f"   - Academic Match: {scores['academic_match']:.1f}%")
            print(f"   - Test Scores: {scores['test_scores']:.1f}%")
            print(f"   - Preferences: {scores['preferences']:.1f}%")
            print(f"   - Affordability: {scores['affordability']:.1f}%")
            print(f"   Explanation: {rec['explanation']}")
            print()
        
    finally:
        db.close()


if __name__ == "__main__":
    test_recommendations()
