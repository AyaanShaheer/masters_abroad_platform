from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.models.user import User
from app.schemas.user import User as UserSchema, UserUpdate
from app.schemas.profile import UserProfile, UserProfileCreate, UserProfileUpdate
from app.services import user_service, profile_service

router = APIRouter()


@router.get("/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Get current user info."""
    return current_user


@router.put("/me", response_model=UserSchema)
def update_user_me(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update current user."""
    updated_user = user_service.update_user(db, current_user.id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@router.get("/me/profile", response_model=UserProfile)
def read_user_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get current user's profile."""
    profile = profile_service.get_profile_by_user_id(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.post("/me/profile", response_model=UserProfile, status_code=status.HTTP_201_CREATED)
def create_user_profile(
    profile: UserProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create user profile."""
    existing_profile = profile_service.get_profile_by_user_id(db, current_user.id)
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists")
    return profile_service.create_profile(db, current_user.id, profile)


@router.put("/me/profile", response_model=UserProfile)
def update_user_profile(
    profile_update: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update user profile."""
    updated_profile = profile_service.update_profile(db, current_user.id, profile_update)
    if not updated_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return updated_profile
