from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    database_url: str = "sqlite:///./resume_system.db"
    secret_key: str = "your-secret-key-please-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    openai_api_key: Optional[str] = None
    hf_token: Optional[str] = None
    
    class Config:
        env_file = ".env"


settings = Settings()

