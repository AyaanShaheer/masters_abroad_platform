from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path

# Get the backend directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    # App Config
    APP_NAME: str = "Masters Abroad Platform"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str
    
    # Redis
    REDIS_URL: str
    
    # JWT Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = str(BASE_DIR / ".env")
        env_file_encoding = 'utf-8'
        case_sensitive = True


settings = Settings()
