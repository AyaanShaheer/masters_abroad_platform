import logging
from app.services.ml_service import admission_predictor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    """Train the admission prediction model with realistic data."""
    logger.info("🚀 Training Realistic Admission Prediction Model...")
    
    # Train with more samples for better accuracy
    accuracy = admission_predictor.train_model()
    
    logger.info(f"✅ Model trained successfully with {accuracy:.2%} accuracy")
    logger.info("Model saved to ml_models/")
    
    # Test predictions
    logger.info("\n📊 Testing sample predictions:")
    
    test_profiles = [
        {
            'name': 'Excellent Student',
            'gpa': 3.9,
            'gre_score': 330,
            'toefl_score': 115,
            'work_experience_years': 3,
            'research_publications': 2,
            'internships': 3,
        },
        {
            'name': 'Good Student',
            'gpa': 3.5,
            'gre_score': 320,
            'toefl_score': 100,
            'work_experience_years': 2,
            'research_publications': 0,
            'internships': 2,
        },
        {
            'name': 'Average Student',
            'gpa': 3.0,
            'gre_score': 305,
            'toefl_score': 90,
            'work_experience_years': 1,
            'research_publications': 0,
            'internships': 1,
        }
    ]
    
    for profile in test_profiles:
        logger.info(f"\n{profile['name']}:")
        logger.info(f"  GPA: {profile['gpa']}, GRE: {profile['gre_score']}, TOEFL: {profile['toefl_score']}")
        
        for tier in ['Top 10', 'Top 20', 'Top 50']:
            pred = admission_predictor.predict_admission(profile, tier)
            logger.info(f"  {tier}: {pred['admission_probability']:.1f}% ({pred['category']})")


if __name__ == "__main__":
    main()
