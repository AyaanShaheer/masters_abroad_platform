from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.program import Program
from app.models.scholarship import Scholarship
from app.services.vector_service import vector_service
import logging
import hashlib

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def string_to_int_id(text: str) -> int:
    """Convert string to consistent integer ID."""
    # Use hash to create consistent integer from string
    hash_obj = hashlib.md5(text.encode())
    return int(hash_obj.hexdigest()[:8], 16)


def index_programs(db: Session):
    """Index all programs into vector database."""
    programs = db.query(Program).filter(Program.is_active == True).all()
    
    documents = []
    for program in programs:
        text = f"""
Program: {program.program_name}
University: {program.university_name}
Country: {program.country}
City: {program.city}
Field of Study: {program.field_of_study}
Degree Type: {program.degree_type}
Duration: {program.duration_months} months
Tuition Fee: ${program.tuition_fee_usd}
Application Fee: ${program.application_fee_usd}
Minimum GPA: {program.min_gpa}
Minimum GRE: {program.min_gre}
Minimum TOEFL: {program.min_toefl}
Minimum IELTS: {program.min_ielts}
Description: {program.description}
Application Deadline: {program.application_deadline}
        """
        
        # Use hash-based integer ID
        doc_id = string_to_int_id(f"program_{program.id}")
        
        documents.append({
            "id": doc_id,
            "text": text.strip(),
            "type": "program",
            "program_id": program.id,
            "university": program.university_name,
            "program_name": program.program_name,
            "country": program.country,
            "field": program.field_of_study,
        })
    
    vector_service.add_documents(documents)
    logger.info(f"Indexed {len(documents)} programs")


def index_scholarships(db: Session):
    """Index all scholarships into vector database."""
    scholarships = db.query(Scholarship).filter(Scholarship.is_active == True).all()
    
    documents = []
    for scholarship in scholarships:
        text = f"""
Scholarship: {scholarship.scholarship_name}
Provider: {scholarship.provider}
Country: {scholarship.country}
Amount: ${scholarship.amount_usd}
Coverage Type: {scholarship.coverage_type}
Minimum GPA: {scholarship.min_gpa}
Eligible Countries: {', '.join(scholarship.eligible_countries or [])}
Applicable Programs: {', '.join(scholarship.applicable_programs or [])}
Description: {scholarship.description}
Requirements: {scholarship.requirements}
Application Process: {scholarship.application_process}
        """
        
        # Use hash-based integer ID
        doc_id = string_to_int_id(f"scholarship_{scholarship.id}")
        
        documents.append({
            "id": doc_id,
            "text": text.strip(),
            "type": "scholarship",
            "scholarship_id": scholarship.id,
            "scholarship_name": scholarship.scholarship_name,
            "provider": scholarship.provider,
            "country": scholarship.country,
        })
    
    vector_service.add_documents(documents)
    logger.info(f"Indexed {len(documents)} scholarships")


def main():
    """Main indexing function."""
    logger.info("Starting knowledge base indexing...")
    
    db = SessionLocal()
    try:
        # Clear existing data
        logger.info("Clearing existing vectors...")
        vector_service.delete_all()
        
        # Index programs
        logger.info("Indexing programs...")
        index_programs(db)
        
        # Index scholarships
        logger.info("Indexing scholarships...")
        index_scholarships(db)
        
        logger.info("✅ Knowledge base indexing complete!")
        
    except Exception as e:
        logger.error(f"❌ Error during indexing: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
