from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.program import Program
from app.models.profile import UserProfile
import logging

logger = logging.getLogger(__name__)


class RecommendationService:
    def __init__(self):
        self.weights = {
            'academic_match': 0.40,
            'test_scores': 0.30,
            'preferences': 0.20,
            'affordability': 0.10,
        }
    
    def calculate_academic_match_score(
        self, 
        profile: UserProfile, 
        program: Program
    ) -> float:
        """Calculate academic match score (0-100)."""
        score = 0.0
        
        # GPA match
        if profile.gpa and program.min_gpa:
            if profile.gpa >= program.min_gpa:
                # Bonus for exceeding minimum
                gpa_ratio = profile.gpa / program.min_gpa
                score += min(40, 30 + (gpa_ratio - 1) * 10)
            else:
                # Penalty for not meeting requirement
                gpa_deficit = (program.min_gpa - profile.gpa) / program.min_gpa
                score += max(0, 30 - (gpa_deficit * 30))
        else:
            score += 20  # Neutral if data missing
        
        # Field of study match
        if profile.field_of_study and program.field_of_study:
            if profile.field_of_study.lower() in program.field_of_study.lower() or \
               program.field_of_study.lower() in profile.field_of_study.lower():
                score += 30
            else:
                # Partial match for related fields
                related_fields = {
                    'computer science': ['data science', 'artificial intelligence', 'software engineering'],
                    'data science': ['computer science', 'artificial intelligence', 'statistics'],
                    'artificial intelligence': ['computer science', 'data science', 'machine learning'],
                }
                user_field = profile.field_of_study.lower()
                program_field = program.field_of_study.lower()
                
                if user_field in related_fields:
                    if any(related in program_field for related in related_fields[user_field]):
                        score += 15
        else:
            score += 15  # Neutral
        
        # Work experience bonus
        if profile.work_experience_years:
            score += min(10, profile.work_experience_years * 2)
        
        # Research experience bonus
        if profile.research_experience:
            score += 10
        
        return min(100, score)
    
    def calculate_test_score_match(
        self, 
        profile: UserProfile, 
        program: Program
    ) -> float:
        """Calculate test score match (0-100)."""
        score = 0.0
        scores_evaluated = 0
        
        # GRE score
        if profile.gre_score and program.min_gre:
            scores_evaluated += 1
            if profile.gre_score >= program.min_gre:
                gre_ratio = profile.gre_score / program.min_gre
                score += min(35, 25 + (gre_ratio - 1) * 10)
            else:
                deficit = (program.min_gre - profile.gre_score) / program.min_gre
                score += max(0, 25 - (deficit * 25))
        
        # TOEFL score
        if profile.toefl_score and program.min_toefl:
            scores_evaluated += 1
            if profile.toefl_score >= program.min_toefl:
                toefl_ratio = profile.toefl_score / program.min_toefl
                score += min(35, 25 + (toefl_ratio - 1) * 10)
            else:
                deficit = (program.min_toefl - profile.toefl_score) / program.min_toefl
                score += max(0, 25 - (deficit * 25))
        
        # IELTS score
        if profile.ielts_score and program.min_ielts:
            scores_evaluated += 1
            if profile.ielts_score >= program.min_ielts:
                ielts_ratio = profile.ielts_score / program.min_ielts
                score += min(35, 25 + (ielts_ratio - 1) * 10)
            else:
                deficit = (program.min_ielts - profile.ielts_score) / program.min_ielts
                score += max(0, 25 - (deficit * 25))
        
        # Normalize based on how many scores were evaluated
        if scores_evaluated > 0:
            return (score / scores_evaluated) * (100 / 35)
        else:
            return 50  # Neutral if no test scores
    
    def calculate_preference_match(
        self, 
        profile: UserProfile, 
        program: Program
    ) -> float:
        """Calculate preference match (0-100)."""
        score = 0.0
        
        # Country preference
        if profile.preferred_countries:
            if program.country in profile.preferred_countries:
                score += 50
            else:
                score += 10  # Some points for considering other countries
        else:
            score += 30  # Neutral
        
        # Program preference
        if profile.preferred_programs:
            program_keywords = program.program_name.lower().split()
            if any(pref.lower() in program.program_name.lower() for pref in profile.preferred_programs):
                score += 50
            elif any(keyword in pref.lower() for pref in profile.preferred_programs for keyword in program_keywords):
                score += 25
        else:
            score += 25  # Neutral
        
        return min(100, score)
    
    def calculate_affordability_score(
        self, 
        profile: UserProfile, 
        program: Program
    ) -> float:
        """Calculate affordability score (0-100)."""
        if not profile.budget_range or not program.tuition_fee_usd:
            return 50  # Neutral if no data
        
        # Parse budget range (e.g., "20000-40000")
        try:
            budget_parts = profile.budget_range.replace('$', '').replace(',', '').split('-')
            if len(budget_parts) == 2:
                min_budget = float(budget_parts[0])
                max_budget = float(budget_parts[1])
                
                tuition = program.tuition_fee_usd
                
                if tuition <= max_budget:
                    # Within budget - higher score for lower cost
                    if tuition <= min_budget:
                        return 100  # Well within budget
                    else:
                        # Scale between min and max budget
                        ratio = (max_budget - tuition) / (max_budget - min_budget)
                        return 60 + (ratio * 40)
                else:
                    # Over budget
                    over_ratio = (tuition - max_budget) / max_budget
                    return max(0, 50 - (over_ratio * 50))
        except:
            return 50
        
        return 50
    
    def calculate_overall_score(
        self, 
        profile: UserProfile, 
        program: Program
    ) -> Dict[str, Any]:
        """Calculate overall recommendation score."""
        academic_score = self.calculate_academic_match_score(profile, program)
        test_score = self.calculate_test_score_match(profile, program)
        preference_score = self.calculate_preference_match(profile, program)
        affordability_score = self.calculate_affordability_score(profile, program)
        
        overall_score = (
            academic_score * self.weights['academic_match'] +
            test_score * self.weights['test_scores'] +
            preference_score * self.weights['preferences'] +
            affordability_score * self.weights['affordability']
        )
        
        return {
            'overall_score': round(overall_score, 2),
            'academic_match': round(academic_score, 2),
            'test_scores': round(test_score, 2),
            'preferences': round(preference_score, 2),
            'affordability': round(affordability_score, 2),
        }
    
    def get_match_explanation(
        self, 
        scores: Dict[str, float], 
        profile: UserProfile, 
        program: Program
    ) -> str:
        """Generate explanation for the match."""
        explanations = []
        
        # Academic match
        if scores['academic_match'] >= 70:
            explanations.append("✓ Strong academic match")
        elif scores['academic_match'] >= 50:
            explanations.append("~ Moderate academic match")
        else:
            explanations.append("✗ Academic requirements may be challenging")
        
        # Test scores
        if scores['test_scores'] >= 70:
            explanations.append("✓ Test scores meet requirements")
        elif scores['test_scores'] >= 50:
            explanations.append("~ Test scores are close to requirements")
        else:
            explanations.append("✗ Test scores below requirements")
        
        # Preferences
        if scores['preferences'] >= 70:
            explanations.append("✓ Matches your preferences")
        
        # Affordability
        if scores['affordability'] >= 70:
            explanations.append("✓ Within your budget")
        elif scores['affordability'] < 50:
            explanations.append("✗ May exceed budget")
        
        return " | ".join(explanations)
    
    def get_recommendations(
        self, 
        db: Session, 
        user_id: int, 
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get personalized program recommendations for a user."""
        from app.services import profile_service
        
        # Get user profile
        profile = profile_service.get_profile_by_user_id(db, user_id)
        if not profile:
            return []
        
        # Get all active programs
        programs = db.query(Program).filter(Program.is_active == True).all()
        
        # Calculate scores for each program
        recommendations = []
        for program in programs:
            scores = self.calculate_overall_score(profile, program)
            explanation = self.get_match_explanation(scores, profile, program)
            
            recommendations.append({
                'program': program,
                'scores': scores,
                'explanation': explanation,
            })
        
        # Sort by overall score
        recommendations.sort(key=lambda x: x['scores']['overall_score'], reverse=True)
        
        return recommendations[:limit]


# Singleton instance
recommendation_service = RecommendationService()
