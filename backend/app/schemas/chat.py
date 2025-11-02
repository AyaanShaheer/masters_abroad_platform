from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ChatMessageCreate(BaseModel):
    message: str
    session_id: Optional[str] = "default"


class ChatMessageResponse(BaseModel):
    response: str
    sources_count: int
    session_id: str


class ChatHistoryResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
