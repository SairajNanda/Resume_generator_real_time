from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import secrets
import io

from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeResponse, ResumeFullResponse
from app.auth import get_current_user
from app.services.resume_service import resume_service

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors

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


@router.get("/{resume_id}/export-pdf")
def export_resume_pdf(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export resume as PDF"""
    
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Get complete user data
    user_data = resume_service.get_user_complete_data(db, current_user)
    
    # Create PDF in memory
    buffer = io.BytesIO()
    
    # Create PDF document
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72,
                           topMargin=72, bottomMargin=18)
    
    # Container for PDF elements
    story = []
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=30,
        alignment=TA_CENTER,
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=12,
        spaceBefore=12,
        borderWidth=0,
        borderColor=colors.HexColor('#1e40af'),
        borderPadding=5,
    )
    
    contact_style = ParagraphStyle(
        'ContactStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#4b5563'),
        alignment=TA_CENTER,
    )
    
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#374151'),
        alignment=TA_JUSTIFY,
        spaceAfter=6,
    )
    
    subheading_style = ParagraphStyle(
        'SubheadingStyle',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#111827'),
        spaceAfter=4,
        fontName='Helvetica-Bold',
    )
    
    # Add name (title)
    story.append(Paragraph(user_data['full_name'], title_style))
    
    # Add contact information
    contact_parts = []
    if user_data.get('email'):
        contact_parts.append(user_data['email'])
    if user_data.get('phone'):
        contact_parts.append(user_data['phone'])
    if user_data.get('location'):
        contact_parts.append(user_data['location'])
    
    if contact_parts:
        story.append(Paragraph(' • '.join(contact_parts), contact_style))
        story.append(Spacer(1, 0.1*inch))
    
    # Add links
    links_parts = []
    if user_data.get('linkedin_url'):
        links_parts.append(f'<a href="{user_data["linkedin_url"]}">LinkedIn</a>')
    if user_data.get('github_url'):
        links_parts.append(f'<a href="{user_data["github_url"]}">GitHub</a>')
    if user_data.get('portfolio_url'):
        links_parts.append(f'<a href="{user_data["portfolio_url"]}">Portfolio</a>')
    
    if links_parts:
        story.append(Paragraph(' • '.join(links_parts), contact_style))
    
    story.append(Spacer(1, 0.3*inch))
    
    # Add summary
    if resume.summary:
        story.append(Paragraph('Professional Summary', heading_style))
        story.append(Paragraph(resume.summary, body_style))
        story.append(Spacer(1, 0.2*inch))
    
    # Add Experience (Internships)
    if user_data.get('internships') and len(user_data['internships']) > 0:
        story.append(Paragraph('Experience', heading_style))
        for intern in user_data['internships']:
            # Position and Company
            story.append(Paragraph(f"<b>{intern['position']}</b>", subheading_style))
            company_date = f"{intern['company_name']}"
            if intern.get('start_date'):
                end_date = 'Present' if intern.get('is_current') else (intern.get('end_date', '')[:10] if intern.get('end_date') else '')
                company_date += f" | {intern['start_date'][:10]} - {end_date}"
            story.append(Paragraph(company_date, body_style))
            
            if intern.get('description'):
                story.append(Paragraph(intern['description'], body_style))
            if intern.get('achievements'):
                story.append(Paragraph(f"• {intern['achievements']}", body_style))
            story.append(Spacer(1, 0.15*inch))
        story.append(Spacer(1, 0.1*inch))
    
    # Add Projects
    if user_data.get('projects') and len(user_data['projects']) > 0:
        story.append(Paragraph('Projects', heading_style))
        for project in user_data['projects']:
            story.append(Paragraph(f"<b>{project['project_name']}</b>", subheading_style))
            
            if project.get('start_date'):
                end_date = 'Ongoing' if project.get('is_ongoing') else (project.get('end_date', '')[:10] if project.get('end_date') else '')
                story.append(Paragraph(f"{project['start_date'][:10]} - {end_date}", body_style))
            
            if project.get('description'):
                story.append(Paragraph(project['description'], body_style))
            
            if project.get('technologies'):
                story.append(Paragraph(f"<b>Technologies:</b> {project['technologies']}", body_style))
            
            story.append(Spacer(1, 0.15*inch))
        story.append(Spacer(1, 0.1*inch))
    
    # Add Education/Courses
    if user_data.get('courses') and len(user_data['courses']) > 0:
        story.append(Paragraph('Education & Certifications', heading_style))
        for course in user_data['courses']:
            story.append(Paragraph(f"<b>{course['course_name']}</b>", subheading_style))
            story.append(Paragraph(course['platform'], body_style))
            if course.get('completion_date'):
                story.append(Paragraph(course['completion_date'][:10], body_style))
            story.append(Spacer(1, 0.1*inch))
        story.append(Spacer(1, 0.1*inch))
    
    # Add Skills
    if user_data.get('skills') and len(user_data['skills']) > 0:
        story.append(Paragraph('Skills', heading_style))
        skills_list = [skill['skill']['name'] for skill in user_data['skills']]
        story.append(Paragraph(', '.join(skills_list), body_style))
        story.append(Spacer(1, 0.2*inch))
    
    # Add Hackathons
    if user_data.get('hackathons') and len(user_data['hackathons']) > 0:
        story.append(Paragraph('Hackathons & Competitions', heading_style))
        for hackathon in user_data['hackathons']:
            story.append(Paragraph(f"<b>{hackathon['hackathon_name']}</b>", subheading_style))
            hack_info = hackathon['organizer']
            if hackathon.get('participation_date'):
                hack_info += f" | {hackathon['participation_date'][:10]}"
            story.append(Paragraph(hack_info, body_style))
            if hackathon.get('position'):
                story.append(Paragraph(hackathon['position'], body_style))
            story.append(Spacer(1, 0.1*inch))
    
    # Build PDF
    doc.build(story)
    
    # Get PDF from buffer
    buffer.seek(0)
    
    # Generate filename
    filename = f"{user_data['full_name'].replace(' ', '_')}_Resume.pdf"
    
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

