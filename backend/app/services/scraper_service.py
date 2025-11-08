import logging
import asyncio
from typing import List, Dict, Any
from bs4 import BeautifulSoup
import requests
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.scraper import ScrapedScholarship
from app.services.email_service import send_scholarship_alert

logger = logging.getLogger(__name__)


class ScholarshipScraper:
    def __init__(self):
        self.sources = [
            {
                "name": "Scholarships.com",
                "url": "https://www.scholarships.com/financial-aid/college-scholarships/scholarships-by-type/graduate-scholarships/",
                "parser": self.parse_scholarships_com
            },
            {
                "name": "FindAMasters",
                "url": "https://www.findamasters.com/funding/listings",
                "parser": self.parse_findamasters
            },
            {
                "name": "ProFellows",
                "url": "https://www.profellow.com/fellowships/",
                "parser": self.parse_profellows
            }
        ]
    
    def scrape_all_sources(self, db: Session) -> List[Dict[str, Any]]:
        """Scrape all configured scholarship sources."""
        results = []
        
        for source in self.sources:
            try:
                logger.info(f"Scraping {source['name']}...")
                scholarships = source["parser"](source["url"])
                
                for scholarship in scholarships:
                    # Check if already exists
                    existing = db.query(ScrapedScholarship).filter(
                        ScrapedScholarship.source_url == source["url"],
                        ScrapedScholarship.title == scholarship["title"]
                    ).first()
                    
                    if not existing:
                        scraped = ScrapedScholarship(
                            source_url=source["url"],
                            source_name=source["name"],
                            title=scholarship["title"],
                            description=scholarship.get("description"),
                            amount=scholarship.get("amount"),
                            deadline=scholarship.get("deadline"),
                            country=scholarship.get("country"),
                            raw_data=scholarship,
                            is_notified=False
                        )
                        db.add(scraped)
                        results.append(scholarship)
                
                db.commit()
                logger.info(f"Found {len(scholarships)} scholarships from {source['name']}")
                
            except Exception as e:
                logger.error(f"Error scraping {source['name']}: {e}")
        
        return results
    
    def parse_scholarships_com(self, url: str) -> List[Dict[str, Any]]:
        """Parse scholarships from Scholarships.com (mock implementation)."""
        # Note: Actual web scraping requires respecting robots.txt and terms of service
        # This is a simplified mock implementation
        scholarships = [
            {
                "title": "Graduate Excellence Award",
                "description": "Merit-based scholarship for outstanding graduate students",
                "amount": "$10,000",
                "deadline": "March 31, 2026",
                "country": "USA"
            },
            {
                "title": "International Student Scholarship",
                "description": "Supporting international students pursuing graduate degrees",
                "amount": "$15,000",
                "deadline": "April 15, 2026",
                "country": "USA"
            }
        ]
        return scholarships
    
    def parse_findamasters(self, url: str) -> List[Dict[str, Any]]:
        """Parse scholarships from FindAMasters (mock implementation)."""
        scholarships = [
            {
                "title": "UK Research Council Scholarship",
                "description": "Funding for research-based masters programs",
                "amount": "£18,000",
                "deadline": "May 1, 2026",
                "country": "UK"
            }
        ]
        return scholarships
    
    def parse_profellows(self, url: str) -> List[Dict[str, Any]]:
        """Parse fellowships from ProFellows (mock implementation)."""
        scholarships = [
            {
                "title": "Global Graduate Fellowship",
                "description": "Fellowship for students from developing countries",
                "amount": "$25,000",
                "deadline": "June 30, 2026",
                "country": "Multiple"
            }
        ]
        return scholarships
    
    def scrape_with_ai(self, url: str, db: Session) -> List[Dict[str, Any]]:
        """
        AI-powered scraping using LLM to extract scholarship info.
        This uses the chatbot's LLM to intelligently parse web pages.
        """
        try:
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract main content
            content = soup.get_text(separator='\n', strip=True)
            
            # Use LLM to extract structured data (simplified)
            # In production, you'd use the Groq API here
            prompt = f"""
            Extract scholarship information from this text:
            
            {content[:2000]}
            
            Return JSON with: title, description, amount, deadline, country
            """
            
            # This would call your LLM service
            # For now, return mock data
            return [{
                "title": "AI-Extracted Scholarship",
                "description": "Scholarship found by AI scraper",
                "amount": "$20,000",
                "deadline": "TBD",
                "country": "Various"
            }]
            
        except Exception as e:
            logger.error(f"Error in AI scraping: {e}")
            return []


# Singleton instance
scraper_service = ScholarshipScraper()
