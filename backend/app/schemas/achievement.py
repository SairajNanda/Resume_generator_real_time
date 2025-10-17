from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class InternshipBase(BaseModel):
    company_name: str
    position: str
    location: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    is_current: bool = False
    description: Optional[str] = None
    achievements: Optional[str] = None
    skills_used: Optional[str] = None
    certificate_url: Optional[str] = None


class InternshipCreate(InternshipBase):
    pass


class InternshipResponse(InternshipBase):
    id: int
    user_id: int
    verification_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class CourseBase(BaseModel):
    course_name: str
    platform: str
    instructor: Optional[str] = None
    completion_date: Optional[datetime] = None
    duration_hours: Optional[int] = None
    grade: Optional[str] = None
    description: Optional[str] = None
    skills_learned: Optional[str] = None
    certificate_url: Optional[str] = None
    certificate_id: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseResponse(CourseBase):
    id: int
    user_id: int
    verification_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class HackathonBase(BaseModel):
    hackathon_name: str
    organizer: str
    participation_date: datetime
    team_size: Optional[int] = None
    position: Optional[str] = None
    project_name: Optional[str] = None
    project_description: Optional[str] = None
    technologies_used: Optional[str] = None
    project_url: Optional[str] = None
    certificate_url: Optional[str] = None


class HackathonCreate(HackathonBase):
    pass


class HackathonResponse(HackathonBase):
    id: int
    user_id: int
    verification_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    project_name: str
    project_type: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    is_ongoing: bool = False
    description: str
    technologies: Optional[str] = None
    role: Optional[str] = None
    team_size: Optional[int] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int
    user_id: int
    verification_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None


class SkillCreate(SkillBase):
    pass


class SkillResponse(SkillBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserSkillBase(BaseModel):
    skill_id: int
    proficiency_level: Optional[str] = None
    years_of_experience: Optional[int] = None


class UserSkillCreate(BaseModel):
    skill_name: str
    category: Optional[str] = None
    proficiency_level: Optional[str] = None
    years_of_experience: Optional[int] = None


class UserSkillResponse(BaseModel):
    id: int
    skill: SkillResponse
    proficiency_level: Optional[str]
    years_of_experience: Optional[int]
    verified_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True

