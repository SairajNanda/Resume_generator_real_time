from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class ResumeBase(BaseModel):
    title: str = "My Resume"
    template: str = "modern"
    summary: Optional[str] = None
    is_ai_generated_summary: bool = True
    configuration: Optional[Dict[str, Any]] = None
    is_public: bool = False


class ResumeCreate(ResumeBase):
    pass


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    template: Optional[str] = None
    summary: Optional[str] = None
    is_ai_generated_summary: Optional[bool] = None
    configuration: Optional[Dict[str, Any]] = None
    is_public: Optional[bool] = None


class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    public_url_slug: Optional[str]
    view_count: int
    last_generated_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ResumeFullResponse(ResumeResponse):
    """Resume with all user data included"""
    user_data: Dict[str, Any]
    
    class Config:
        from_attributes = True

