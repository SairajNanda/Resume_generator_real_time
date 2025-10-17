from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.achievement import Internship, Course, Hackathon, Project, Skill, UserSkill
from app.schemas.achievement import (
    InternshipCreate, InternshipResponse,
    CourseCreate, CourseResponse,
    HackathonCreate, HackathonResponse,
    ProjectCreate, ProjectResponse,
    UserSkillCreate, UserSkillResponse,
    SkillResponse
)
from app.auth import get_current_user

router = APIRouter(prefix="/achievements", tags=["Achievements"])


# Internships
@router.get("/internships", response_model=List[InternshipResponse])
def get_internships(current_user: User = Depends(get_current_user)):
    """Get all internships for current user"""
    return current_user.internships


@router.post("/internships", response_model=InternshipResponse, status_code=status.HTTP_201_CREATED)
def create_internship(
    internship_data: InternshipCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new internship"""
    
    db_internship = Internship(
        user_id=current_user.id,
        **internship_data.dict()
    )
    
    db.add(db_internship)
    db.commit()
    db.refresh(db_internship)
    
    return db_internship


@router.delete("/internships/{internship_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_internship(
    internship_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an internship"""
    
    internship = db.query(Internship).filter(
        Internship.id == internship_id,
        Internship.user_id == current_user.id
    ).first()
    
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    db.delete(internship)
    db.commit()


# Courses
@router.get("/courses", response_model=List[CourseResponse])
def get_courses(current_user: User = Depends(get_current_user)):
    """Get all courses for current user"""
    return current_user.courses


@router.post("/courses", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(
    course_data: CourseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new course"""
    
    db_course = Course(
        user_id=current_user.id,
        **course_data.dict()
    )
    
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    
    return db_course


@router.delete("/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a course"""
    
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.user_id == current_user.id
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    db.delete(course)
    db.commit()


# Hackathons
@router.get("/hackathons", response_model=List[HackathonResponse])
def get_hackathons(current_user: User = Depends(get_current_user)):
    """Get all hackathons for current user"""
    return current_user.hackathons


@router.post("/hackathons", response_model=HackathonResponse, status_code=status.HTTP_201_CREATED)
def create_hackathon(
    hackathon_data: HackathonCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new hackathon entry"""
    
    db_hackathon = Hackathon(
        user_id=current_user.id,
        **hackathon_data.dict()
    )
    
    db.add(db_hackathon)
    db.commit()
    db.refresh(db_hackathon)
    
    return db_hackathon


@router.delete("/hackathons/{hackathon_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hackathon(
    hackathon_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a hackathon"""
    
    hackathon = db.query(Hackathon).filter(
        Hackathon.id == hackathon_id,
        Hackathon.user_id == current_user.id
    ).first()
    
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")
    
    db.delete(hackathon)
    db.commit()


# Projects
@router.get("/projects", response_model=List[ProjectResponse])
def get_projects(current_user: User = Depends(get_current_user)):
    """Get all projects for current user"""
    return current_user.projects


@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new project"""
    
    db_project = Project(
        user_id=current_user.id,
        **project_data.dict()
    )
    
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    return db_project


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a project"""
    
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()


# Skills
@router.get("/skills", response_model=List[UserSkillResponse])
def get_skills(current_user: User = Depends(get_current_user)):
    """Get all skills for current user"""
    return current_user.skills


@router.post("/skills", response_model=UserSkillResponse, status_code=status.HTTP_201_CREATED)
def create_skill(
    skill_data: UserSkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a skill to current user"""
    
    # Get or create skill
    skill = db.query(Skill).filter(Skill.name == skill_data.skill_name).first()
    if not skill:
        skill = Skill(name=skill_data.skill_name, category=skill_data.category)
        db.add(skill)
        db.commit()
        db.refresh(skill)
    
    # Check if user already has this skill
    existing = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id,
        UserSkill.skill_id == skill.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Skill already added")
    
    # Create user skill
    db_user_skill = UserSkill(
        user_id=current_user.id,
        skill_id=skill.id,
        proficiency_level=skill_data.proficiency_level,
        years_of_experience=skill_data.years_of_experience
    )
    
    db.add(db_user_skill)
    db.commit()
    db.refresh(db_user_skill)
    
    return db_user_skill


@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a skill from current user"""
    
    user_skill = db.query(UserSkill).filter(
        UserSkill.id == skill_id,
        UserSkill.user_id == current_user.id
    ).first()
    
    if not user_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    db.delete(user_skill)
    db.commit()

