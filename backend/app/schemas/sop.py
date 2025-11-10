from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class SOPGenerate(BaseModel):
    program_id: Optional[int] = None
    additional_info: Optional[str] = None


class SOPAnalyze(BaseModel):
    sop_text: str


class SOPImprove(BaseModel):
    sop_id: int


class SOPAnalysisResponse(BaseModel):
    overall_score: float
    clarity_score: float
    motivation_score: float
    coherence_score: float
    relevance_score: float
    grammar_score: float
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    word_count: int
    reading_level: str
    summary: Optional[str] = None


class SOPResponse(BaseModel):
    id: int
    title: str
    content: str
    program_id: Optional[int]
    overall_score: Optional[float]
    word_count: Optional[int]
    is_generated: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class SOPCreateUpdate(BaseModel):
    title: str
    content: str
    program_id: Optional[int] = None
