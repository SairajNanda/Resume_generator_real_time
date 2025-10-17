from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum


class VerificationStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


class Internship(Base):
    __tablename__ = "internships"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_name = Column(String, nullable=False)
    position = Column(String, nullable=False)
    location = Column(String, nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    is_current = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    achievements = Column(Text, nullable=True)
    skills_used = Column(String, nullable=True)  # Comma-separated
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING)
    certificate_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="internships")


class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_name = Column(String, nullable=False)
    platform = Column(String, nullable=False)  # Coursera, Udemy, etc.
    instructor = Column(String, nullable=True)
    completion_date = Column(DateTime, nullable=True)
    duration_hours = Column(Integer, nullable=True)
    grade = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    skills_learned = Column(String, nullable=True)  # Comma-separated
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING)
    certificate_url = Column(String, nullable=True)
    certificate_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="courses")


class Hackathon(Base):
    __tablename__ = "hackathons"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    hackathon_name = Column(String, nullable=False)
    organizer = Column(String, nullable=False)
    participation_date = Column(DateTime, nullable=False)
    team_size = Column(Integer, nullable=True)
    position = Column(String, nullable=True)  # Winner, Runner-up, Participant
    project_name = Column(String, nullable=True)
    project_description = Column(Text, nullable=True)
    technologies_used = Column(String, nullable=True)  # Comma-separated
    project_url = Column(String, nullable=True)
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING)
    certificate_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="hackathons")


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_name = Column(String, nullable=False)
    project_type = Column(String, nullable=True)  # Personal, Academic, Professional
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    is_ongoing = Column(Boolean, default=False)
    description = Column(Text, nullable=False)
    technologies = Column(String, nullable=True)  # Comma-separated
    role = Column(String, nullable=True)
    team_size = Column(Integer, nullable=True)
    github_url = Column(String, nullable=True)
    live_url = Column(String, nullable=True)
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="projects")


class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    category = Column(String, nullable=True)  # Programming, Framework, Tool, Soft Skill, etc.
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user_skills = relationship("UserSkill", back_populates="skill")


class UserSkill(Base):
    __tablename__ = "user_skills"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    proficiency_level = Column(String, nullable=True)  # Beginner, Intermediate, Advanced, Expert
    years_of_experience = Column(Integer, nullable=True)
    verified_count = Column(Integer, default=0)  # How many times verified across platforms
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="skills")
    skill = relationship("Skill", back_populates="user_skills")

