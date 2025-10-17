from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False, default="My Resume")
    template = Column(String, default="modern")  # modern, classic, minimal, creative
    summary = Column(Text, nullable=True)  # AI-generated or custom
    is_ai_generated_summary = Column(Integer, default=1)  # Boolean as int
    
    # Customization options (JSON)
    configuration = Column(JSON, nullable=True)
    # Example: {"show_photo": true, "color_scheme": "blue", "sections": [...]}
    
    # Metadata
    is_public = Column(Integer, default=0)  # Boolean as int
    public_url_slug = Column(String, unique=True, nullable=True, index=True)
    view_count = Column(Integer, default=0)
    last_generated_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="resumes")

