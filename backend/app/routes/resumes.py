from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import secrets

from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeResponse, ResumeFullResponse
from app.auth import get_current_user
from app.services.resume_service import resume_service

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.get("", response_model=List[ResumeResponse])
def get_resumes(current_user: User = Depends(get_current_user)):
    """Get all resumes for current user"""
    return current_user.resumes


@router.get("/{resume_id}", response_model=ResumeFullResponse)
def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific resume with full data"""
    
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Get complete user data
    user_data = resume_service.get_user_complete_data(db, current_user)
    
    # Convert resume to dict and add user data
    resume_dict = {
        "id": resume.id,
        "user_id": resume.user_id,
        "title": resume.title,
        "template": resume.template,
        "summary": resume.summary,
        "is_ai_generated_summary": bool(resume.is_ai_generated_summary),
        "configuration": resume.configuration,
        "is_public": bool(resume.is_public),
        "public_url_slug": resume.public_url_slug,
        "view_count": resume.view_count,
        "last_generated_at": resume.last_generated_at,
        "created_at": resume.created_at,
        "updated_at": resume.updated_at,
        "user_data": user_data
    }
    
    return resume_dict


@router.post("", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
def create_resume(
    resume_data: ResumeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new resume"""
    
    # Generate AI summary if requested
    summary = resume_data.summary
    if resume_data.is_ai_generated_summary or not summary:
        user_data = resume_service.get_user_complete_data(db, current_user)
        summary = resume_service.generate_ai_summary(user_data)
    
    # Generate public URL slug if public
    public_url_slug = None
    if resume_data.is_public:
        public_url_slug = f"{current_user.full_name.lower().replace(' ', '-')}-{secrets.token_hex(4)}"
    
    db_resume = Resume(
        user_id=current_user.id,
        title=resume_data.title,
        template=resume_data.template,
        summary=summary,
        is_ai_generated_summary=int(resume_data.is_ai_generated_summary),
        configuration=resume_data.configuration,
        is_public=int(resume_data.is_public),
        public_url_slug=public_url_slug,
        last_generated_at=datetime.utcnow()
    )
    
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    
    return db_resume


@router.put("/{resume_id}", response_model=ResumeResponse)
def update_resume(
    resume_id: int,
    resume_update: ResumeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a resume"""
    
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    update_data = resume_update.dict(exclude_unset=True)
    
    # Regenerate AI summary if requested
    if update_data.get('is_ai_generated_summary', False):
        user_data = resume_service.get_user_complete_data(db, current_user)
        update_data['summary'] = resume_service.generate_ai_summary(user_data)
    
    # Update public URL slug if changing to public
    if 'is_public' in update_data and update_data['is_public'] and not resume.public_url_slug:
        update_data['public_url_slug'] = f"{current_user.full_name.lower().replace(' ', '-')}-{secrets.token_hex(4)}"
    
    for field, value in update_data.items():
        if field == 'is_public' or field == 'is_ai_generated_summary':
            setattr(resume, field, int(value))
        else:
            setattr(resume, field, value)
    
    db.commit()
    db.refresh(resume)
    
    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a resume"""
    
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    db.delete(resume)
    db.commit()


@router.post("/{resume_id}/regenerate-summary", response_model=ResumeResponse)
def regenerate_summary(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Regenerate AI summary for a resume"""
    
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Generate new AI summary
    user_data = resume_service.get_user_complete_data(db, current_user)
    new_summary = resume_service.generate_ai_summary(user_data)
    
    resume.summary = new_summary
    resume.is_ai_generated_summary = 1
    resume.last_generated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(resume)
    
    return resume

