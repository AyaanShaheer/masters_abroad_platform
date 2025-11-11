import logging
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
from typing import Dict, Any, List, Optional
from pathlib import Path

logger = logging.getLogger(__name__)


class AdmissionPredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.model_path = Path("ml_models")
        self.model_path.mkdir(exist_ok=True)
        
        # Try to load existing model
        self.load_model()
    
    def generate_training_data(self, n_samples: int = 1000) -> pd.DataFrame:
        """Generate synthetic training data for the ML model."""
        np.random.seed(42)
        
        data = []
        
        # Generate realistic admission data
        for _ in range(n_samples):
            # Generate features with realistic distributions
            gpa = np.random.normal(3.5, 0.4)
            gpa = np.clip(gpa, 2.0, 4.0)
            
            gre_total = np.random.normal(315, 10)
            gre_total = np.clip(gre_total, 280, 340)
            
            toefl = np.random.normal(100, 10)
            toefl = np.clip(toefl, 70, 120)
            
            work_exp = np.random.poisson(24)  # months
            work_exp = np.clip(work_exp, 0, 96)
            
            publications = np.random.poisson(1)
            publications = np.clip(publications, 0, 10)
            
            internships = np.random.poisson(2)
            internships = np.clip(internships, 0, 5)
            
            # Calculate admission probability based on features
            # Weighted scoring system
            score = (
                (gpa / 4.0) * 30 +
                (gre_total / 340) * 25 +
                (toefl / 120) * 15 +
                (min(work_exp, 48) / 48) * 15 +
                (min(publications, 5) / 5) * 10 +
                (min(internships, 3) / 3) * 5
            )
            
            # Add randomness
            score += np.random.normal(0, 10)
            
            # Convert to admission decision
            probability = 1 / (1 + np.exp(-0.1 * (score - 50)))
            admitted = probability > np.random.random()
            
            data.append({
                'gpa': gpa,
                'gre_total': gre_total,
                'toefl_score': toefl,
                'work_experience_months': work_exp,
                'research_publications': publications,
                'internships': internships,
                'admitted': int(admitted)
            })
        
        return pd.DataFrame(data)
    
    def train_model(self, data: Optional[pd.DataFrame] = None):
        """Train the admission prediction model."""
        
        if data is None:
            logger.info("Generating synthetic training data...")
            data = self.generate_training_data(n_samples=2000)
        
        # Features and target
        feature_columns = [
            'gpa', 'gre_total', 'toefl_score', 
            'work_experience_months', 'research_publications', 'internships'
        ]
        
        X = data[feature_columns]
        y = data['admitted']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train Gradient Boosting Classifier
        logger.info("Training model...")
        self.model = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        
        logger.info(f"Model trained with accuracy: {accuracy:.2%}")
        logger.info(f"\n{classification_report(y_test, y_pred)}")
        
        # Save model
        self.save_model()
        
        return accuracy
    
    def predict_admission(self, profile: Dict[str, Any], university_tier: str = "Top 50") -> Dict[str, Any]:
        """Predict admission probability for a given profile."""

        if self.model is None:
            logger.warning("Model not trained. Training now...")
        
        # Prepare features
        features = pd.DataFrame([{
        'gpa': profile.get('gpa', 3.0),
        'gre_total': profile.get('gre_score', 300),
        'toefl_score': profile.get('toefl_score', 90),
        'work_experience_months': profile.get('work_experience_years', 0) * 12,
        'research_publications': profile.get('research_publications', 0),
        'internships': profile.get('internships', 0),
    }])
        
        # Scale Features
        features_scaled = self.scaler.transform(features)
    
        # Base prediction
        base_probability = self.model.predict_proba(features_scaled)[0][1] * 100

        # Apply realistic university tier adjustments
        tier_multipliers = {
            "Top 10": 0.3,    # Stanford, MIT - Very difficult
            "Top 20": 0.5,    # CMU, UC Berkeley - Difficult
            "Top 50": 0.7,    # Good universities - Moderate
            "Top 100": 0.9,   # Decent universities - Easier
            "Others": 1.0     # Regular universities - Base rate
    }
        multiplier = tier_multipliers.get(university_tier, 0.7)
        adjusted_probability = base_probability * multiplier

        # Additional realistic constraints
        gpa = profile.get('gpa', 3.0)
        gre = profile.get('gre_score', 300)

        # Hard caos for top unis
        if university_tier == "Top 10":
            #
            if gpa < 3.7 or gre < 320:
                adjusted_probability = min(adjusted_probability, 25)  # Max 25% if below threshold
            if gpa < 3.5 or gre < 310:
                adjusted_probability = min(adjusted_probability, 10)  # Max 10% if significantly below
    
        elif university_tier == "Top 20":
            if gpa < 3.5 or gre < 315:
                adjusted_probability = min(adjusted_probability, 40)
            if gpa < 3.3 or gre < 305:
                adjusted_probability = min(adjusted_probability, 20)
        
        # Final cap - nobady has 100% chance
        adjusted_probability = min(adjusted_probability, 95)

        # Classify
        if adjusted_probability >= 70:
            category = "Safety"
        elif adjusted_probability >= 40:
            category = "Target"
        else:
            category = "Reach"
        
        # Feature importance for suggestions
        feature_importance = dict(zip(
            ['gpa', 'gre_total', 'toefl_score', 'work_experience_months', 
            'research_publications', 'internships'],
            self.model.feature_importances_
    ))
        
        # Generate suggestions
        suggestions = self._generate_suggestions(profile, feature_importance, university_tier)

        return {
        'admission_probability': round(adjusted_probability, 2),
        'category': category,
        'confidence_score': round(max(adjusted_probability, 100 - adjusted_probability), 2),
        'suggestions': suggestions,
        'feature_importance': feature_importance
    }

    



        
    
    
    def _generate_suggestions(
    self, 
    profile: Dict[str, Any], 
    importance: Dict[str, float],
    university_tier: str = "Top 50"
) -> List[str]:
        """Generate personalized improvement suggestions."""
    
        suggestions = []
    
        gpa = profile.get('gpa', 3.0)
        gre = profile.get('gre_score', 300)
        toefl = profile.get('toefl_score', 90)
        work_exp = profile.get('work_experience_years', 0)
        pubs = profile.get('research_publications', 0)
    
        # Tier-specific suggestions
        if university_tier in ['Top 10', 'Top 20']:
            if gpa < 3.7:
                suggestions.append(
                    f"📚 GPA Critical: Your GPA is {gpa}. "
                    f"Top tier universities typically require 3.7+ GPA."
            )
            if gre < 320:
                suggestions.append(
                f"📝 GRE Score Essential: Your score is {gre}. "
                f"Top programs expect 320+ (often 325+)."
            )
            if pubs == 0:
                suggestions.append(
                "🔬 Research Publications Required: Top universities strongly prefer "
                "candidates with research experience and publications."
            )
        else:
            # Regular suggestions for other tiers
            if gpa < 3.5:
                suggestions.append(
                f"📚 Improve GPA: Your current GPA is {gpa}. "
                f"Aim for 3.5+ to strengthen your profile."
            )
        
            if gre < 315:
                suggestions.append(
                f"📝 Boost GRE Score: Your score is {gre}. "
                f"Target 315+ for competitive programs."
            )
    
        if toefl < 100:
            suggestions.append(
            f"🗣️ Improve TOEFL: Your score is {toefl}. "
            f"Aim for 100+ to meet most university requirements."
        )
    
        if work_exp < 2:
            suggestions.append(
            f"💼 Gain Work Experience: You have {work_exp} years. "
            f"2+ years significantly improves admission chances."
        )
    
        if not suggestions:
            suggestions.append(
            "✨ Excellent profile! Focus on strong SOPs and recommendations."
        )
    
        return suggestions

    
    def save_model(self):
        """Save trained model to disk."""
        try:
            joblib.dump(self.model, self.model_path / "admission_model.pkl")
            joblib.dump(self.scaler, self.model_path / "scaler.pkl")
            logger.info("Model saved successfully")
        except Exception as e:
            logger.error(f"Error saving model: {e}")
    
    def load_model(self):
        """Load trained model from disk."""
        try:
            model_file = self.model_path / "admission_model.pkl"
            scaler_file = self.model_path / "scaler.pkl"
            
            if model_file.exists() and scaler_file.exists():
                self.model = joblib.load(model_file)
                self.scaler = joblib.load(scaler_file)
                logger.info("Model loaded successfully")
            else:
                logger.info("No saved model found. Will train on first use.")
        except Exception as e:
            logger.error(f"Error loading model: {e}")


# Singleton instance
admission_predictor = AdmissionPredictor()
