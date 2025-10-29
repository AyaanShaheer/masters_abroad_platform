from sqlalchemy.orm import Session
from typing import Optional
from app.models.profile import UserProfile
from app.schemas.profile import UserProfileCreate, UserProfileUpdate


def get_profile_by_user_id(db: Session, user_id: int) -> Optional[UserProfile]:
    """Get user profile by user ID."""
    return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()


def create_profile(db: Session, user_id: int, profile: UserProfileCreate) -> UserProfile:
    """Create user profile."""
    db_profile = UserProfile(
        user_id=user_id,
        **profile.model_dump()
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def update_profile(db: Session, user_id: int, profile_update: UserProfileUpdate) -> Optional[UserProfile]:
    """Update user profile."""
    db_profile = get_profile_by_user_id(db, user_id)
    if not db_profile:
        return None
    
    update_data = profile_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_profile, field, value)
    
    db.commit()
    db.refresh(db_profile)
    return db_profile
