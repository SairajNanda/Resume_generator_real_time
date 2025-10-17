from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.user import User
from app.services.ai_service import ai_service


class ResumeService:
    """Service for resume-related business logic"""
    
    @staticmethod
    def get_user_complete_data(db: Session, user: User) -> Dict[str, Any]:
        """Get all user data needed for resume generation"""
        
        return {
            'id': user.id,
            'email': user.email,
            'full_name': user.full_name,
            'phone': user.phone,
            'location': user.location,
            'linkedin_url': user.linkedin_url,
            'github_url': user.github_url,
            'portfolio_url': user.portfolio_url,
            'bio': user.bio,
            'internships': [
                {
                    'id': i.id,
                    'company_name': i.company_name,
                    'position': i.position,
                    'location': i.location,
                    'start_date': i.start_date.isoformat() if i.start_date else None,
                    'end_date': i.end_date.isoformat() if i.end_date else None,
                    'is_current': i.is_current,
                    'description': i.description,
                    'achievements': i.achievements,
                    'skills_used': i.skills_used,
                    'verification_status': i.verification_status.value if hasattr(i.verification_status, 'value') else i.verification_status,
                }
                for i in user.internships
            ],
            'courses': [
                {
                    'id': c.id,
                    'course_name': c.course_name,
                    'platform': c.platform,
                    'instructor': c.instructor,
                    'completion_date': c.completion_date.isoformat() if c.completion_date else None,
                    'duration_hours': c.duration_hours,
                    'grade': c.grade,
                    'description': c.description,
                    'skills_learned': c.skills_learned,
                    'verification_status': c.verification_status.value if hasattr(c.verification_status, 'value') else c.verification_status,
                }
                for c in user.courses
            ],
            'hackathons': [
                {
                    'id': h.id,
                    'hackathon_name': h.hackathon_name,
                    'organizer': h.organizer,
                    'participation_date': h.participation_date.isoformat() if h.participation_date else None,
                    'team_size': h.team_size,
                    'position': h.position,
                    'project_name': h.project_name,
                    'project_description': h.project_description,
                    'technologies_used': h.technologies_used,
                    'verification_status': h.verification_status.value if hasattr(h.verification_status, 'value') else h.verification_status,
                }
                for h in user.hackathons
            ],
            'projects': [
                {
                    'id': p.id,
                    'project_name': p.project_name,
                    'project_type': p.project_type,
                    'start_date': p.start_date.isoformat() if p.start_date else None,
                    'end_date': p.end_date.isoformat() if p.end_date else None,
                    'is_ongoing': p.is_ongoing,
                    'description': p.description,
                    'technologies': p.technologies,
                    'role': p.role,
                    'team_size': p.team_size,
                    'github_url': p.github_url,
                    'live_url': p.live_url,
                    'verification_status': p.verification_status.value if hasattr(p.verification_status, 'value') else p.verification_status,
                }
                for p in user.projects
            ],
            'skills': [
                {
                    'id': us.id,
                    'skill': {
                        'id': us.skill.id,
                        'name': us.skill.name,
                        'category': us.skill.category,
                    },
                    'proficiency_level': us.proficiency_level,
                    'years_of_experience': us.years_of_experience,
                    'verified_count': us.verified_count,
                }
                for us in user.skills
            ],
        }
    
    @staticmethod
    def generate_ai_summary(user_data: Dict[str, Any]) -> str:
        """Generate AI-powered resume summary"""
        return ai_service.generate_resume_summary(user_data)


resume_service = ResumeService()

