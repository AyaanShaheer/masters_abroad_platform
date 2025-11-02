from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.schemas.chat import ChatMessageCreate, ChatMessageResponse
from app.services.chat_service import chat_service

router = APIRouter()


@router.post("/", response_model=ChatMessageResponse)
def send_message(
    message: ChatMessageCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Send a chat message and get AI response."""
    result = chat_service.chat(
        user_id=current_user.id,
        message=message.message,
        session_id=message.session_id
    )
    
    return {
        "response": result["response"],
        "sources_count": result["sources_count"],
        "session_id": message.session_id
    }


@router.delete("/session")
def clear_session(
    session_id: str = "default",
    current_user: User = Depends(get_current_active_user)
):
    """Clear chat session history."""
    chat_service.clear_history(current_user.id, session_id)
    return {"message": "Chat session cleared successfully"}
