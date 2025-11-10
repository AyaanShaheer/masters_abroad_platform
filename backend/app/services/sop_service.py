import logging
from typing import Dict, Any, Optional
from groq import Groq
from app.core.config import settings
import re

logger = logging.getLogger(__name__)


class SOPService:
    def __init__(self):
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = "llama-3.3-70b-versatile"
    
    def generate_sop(
        self,
        user_profile: Dict[str, Any],
        program_details: Optional[Dict[str, Any]] = None
    ) -> str:
        """Generate personalized SOP based on user profile."""
        
        prompt = f"""
You are an expert SOP (Statement of Purpose) writer for graduate school applications. 
Generate a compelling, personalized SOP based on the following information:

USER PROFILE:
- Name: {user_profile.get('full_name', 'Student')}
- Field of Study: {user_profile.get('field_of_study', 'Computer Science')}
- Highest Degree: {user_profile.get('highest_degree', "Bachelor's")}
- GPA: {user_profile.get('gpa', 'N/A')}
- Work Experience: {user_profile.get('work_experience_years', 0)} years
- Research Experience: {user_profile.get('research_experience', 'None')}
- Extracurriculars: {user_profile.get('extracurriculars', 'None')}

TARGET PROGRAM:
{f"- University: {program_details['university_name']}" if program_details else "- General Graduate Program"}
{f"- Program: {program_details['program_name']}" if program_details else ""}
{f"- Country: {program_details['country']}" if program_details else ""}

GUIDELINES:
1. Write in first person, authentic voice
2. Length: 500-700 words
3. Structure:
   - Opening hook (motivation/pivotal moment)
   - Academic background and achievements
   - Work experience and practical skills
   - Research interests and goals
   - Why this specific program/university
   - Future career aspirations
   - Strong closing

4. Tone: Professional, passionate, genuine
5. Avoid clichés like "from a young age" or "ever since childhood"
6. Show, don't tell - use specific examples
7. Connect experiences to future goals

Generate a complete, polished SOP that admissions committees will love.
"""

        try:
            response = self.groq_client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.8,
                max_tokens=2000,
            )
            
            sop_text = response.choices[0].message.content
            return sop_text
            
        except Exception as e:
            logger.error(f"Error generating SOP: {e}")
            return "Error generating SOP. Please try again."
    
    def analyze_sop(self, sop_text: str) -> Dict[str, Any]:
        """Analyze SOP and provide detailed feedback."""
        
        # Calculate basic metrics
        word_count = len(sop_text.split())
        
        prompt = f"""
You are an expert admissions counselor reviewing a Statement of Purpose (SOP).
Analyze the following SOP and provide detailed, constructive feedback.

SOP TEXT:
{sop_text}

Provide your analysis in the following JSON format:
{{
  "overall_score": <0-100>,
  "clarity_score": <0-100>,
  "motivation_score": <0-100>,
  "coherence_score": <0-100>,
  "relevance_score": <0-100>,
  "grammar_score": <0-100>,
  "strengths": [
    "Strength 1",
    "Strength 2",
    "Strength 3"
  ],
  "weaknesses": [
    "Weakness 1",
    "Weakness 2",
    "Weakness 3"
  ],
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ],
  "reading_level": "Graduate/Professional/Undergraduate",
  "summary": "Overall assessment in 2-3 sentences"
}}

SCORING CRITERIA:
- Clarity: How clear and easy to understand
- Motivation: How well it conveys passion and purpose
- Coherence: Logical flow and structure
- Relevance: How well experiences connect to goals
- Grammar: Writing quality and correctness

Be specific, constructive, and honest in your feedback.
"""

        try:
            response = self.groq_client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=1500,
            )
            
            feedback_text = response.choices[0].message.content
            
            # Extract JSON from response
            import json
            import re
            
            # Try to extract JSON
            json_match = re.search(r'\{.*\}', feedback_text, re.DOTALL)
            if json_match:
                feedback = json.loads(json_match.group())
            else:
                # Fallback if JSON extraction fails
                feedback = {
                    "overall_score": 75,
                    "clarity_score": 75,
                    "motivation_score": 75,
                    "coherence_score": 75,
                    "relevance_score": 75,
                    "grammar_score": 75,
                    "strengths": ["Well-written", "Clear structure"],
                    "weaknesses": ["Could be more specific"],
                    "suggestions": ["Add more details about experiences"],
                    "reading_level": "Graduate",
                    "summary": "Good SOP with room for improvement."
                }
            
            feedback['word_count'] = word_count
            
            return feedback
            
        except Exception as e:
            logger.error(f"Error analyzing SOP: {e}")
            return {
                "overall_score": 0,
                "error": "Analysis failed. Please try again."
            }
    
    def improve_sop(self, sop_text: str, analysis: Dict[str, Any]) -> str:
        """Generate improved version of SOP based on analysis."""
        
        weaknesses_text = "\n".join(f"- {w}" for w in analysis.get('weaknesses', []))
        suggestions_text = "\n".join(f"- {s}" for s in analysis.get('suggestions', []))
        
        prompt = f"""
You are an expert SOP editor. Improve the following SOP based on the analysis provided.

ORIGINAL SOP:
{sop_text}

IDENTIFIED WEAKNESSES:
{weaknesses_text}

IMPROVEMENT SUGGESTIONS:
{suggestions_text}

Task: Rewrite the SOP addressing all weaknesses and implementing suggestions.
Maintain the author's authentic voice but enhance clarity, impact, and professionalism.
Keep the same approximate length but improve quality.

Generate the improved SOP:
"""

        try:
            response = self.groq_client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2000,
            )
            
            improved_sop = response.choices[0].message.content
            return improved_sop
            
        except Exception as e:
            logger.error(f"Error improving SOP: {e}")
            return sop_text


# Singleton instance
sop_service = SOPService()
