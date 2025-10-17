# Database Schema Documentation

## Overview

The Resume System uses a relational database design with the following entities:

## Entity Relationship Diagram

```
┌─────────────┐
│    Users    │
├─────────────┤
│ id (PK)     │
│ email       │◄──────┐
│ password    │       │
│ full_name   │       │
│ phone       │       │
│ location    │       │
│ linkedin    │       │
│ github      │       │
│ portfolio   │       │
│ bio         │       │
└─────────────┘       │
                      │
        ┌─────────────┼─────────────┬─────────────┬─────────────┬─────────────┐
        │             │             │             │             │             │
        │             │             │             │             │             │
┌───────▼──────┐ ┌────▼─────┐ ┌────▼─────┐ ┌─────▼────┐ ┌──────▼─────┐ ┌───▼──────┐
│ Internships  │ │  Courses │ │Hackathons│ │ Projects │ │ UserSkills │ │ Resumes  │
├──────────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├────────────┤ ├──────────┤
│ id (PK)      │ │ id (PK)  │ │ id (PK)  │ │ id (PK)  │ │ id (PK)    │ │ id (PK)  │
│ user_id (FK) │ │user_id   │ │user_id   │ │user_id   │ │ user_id    │ │user_id   │
│ company_name │ │course_nm │ │hackathon │ │project_nm│ │ skill_id───┼─┤title     │
│ position     │ │platform  │ │organizer │ │type      │ │proficiency │ │template  │
│ location     │ │instructor│ │part_date │ │start_date│ │years_exp   │ │summary   │
│ start_date   │ │complt_dt │ │team_size │ │end_date  │ │verified_ct │ │config    │
│ end_date     │ │duration  │ │position  │ │is_ongoing│ └────────────┘ │is_public │
│ is_current   │ │grade     │ │project_nm│ │description                │view_count│
│ description  │ │descriptio│ │project_ds│ │technologies               └──────────┘
│ achievements │ │skills_lrn│ │tech_used │ │role      │
│ skills_used  │ │cert_url  │ │project_ul│ │team_size │
│ verification │ │cert_id   │ │verificatn│ │github_url│
│ cert_url     │ │verificatn│ └──────────┘ │live_url  │
└──────────────┘ └──────────┘              │verificatn│
                                            └──────────┘
                                                 │
                                                 │
                                            ┌────▼─────┐
                                            │  Skills  │
                                            ├──────────┤
                                            │ id (PK)  │
                                            │ name     │
                                            │ category │
                                            └──────────┘
```

## Tables

### 1. Users Table

Stores user account and profile information.

**Columns:**
- `id` (INTEGER, PRIMARY KEY): Unique user identifier
- `email` (STRING, UNIQUE): User's email address (login)
- `hashed_password` (STRING): Bcrypt hashed password
- `full_name` (STRING): User's full name
- `phone` (STRING, NULLABLE): Contact phone number
- `location` (STRING, NULLABLE): City, country location
- `linkedin_url` (STRING, NULLABLE): LinkedIn profile URL
- `github_url` (STRING, NULLABLE): GitHub profile URL
- `portfolio_url` (STRING, NULLABLE): Personal portfolio URL
- `bio` (TEXT, NULLABLE): Personal biography
- `created_at` (DATETIME): Account creation timestamp
- `updated_at` (DATETIME): Last update timestamp

**Relationships:**
- One-to-Many with Internships
- One-to-Many with Courses
- One-to-Many with Hackathons
- One-to-Many with Projects
- One-to-Many with UserSkills
- One-to-Many with Resumes

### 2. Internships Table

Tracks internship experiences.

**Columns:**
- `id` (INTEGER, PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY → users.id)
- `company_name` (STRING): Company/organization name
- `position` (STRING): Job title/role
- `location` (STRING, NULLABLE): Work location
- `start_date` (DATETIME): Internship start date
- `end_date` (DATETIME, NULLABLE): Internship end date
- `is_current` (BOOLEAN): Currently working flag
- `description` (TEXT, NULLABLE): Role description
- `achievements` (TEXT, NULLABLE): Key accomplishments
- `skills_used` (STRING, NULLABLE): Comma-separated skills
- `verification_status` (ENUM): pending/verified/rejected
- `certificate_url` (STRING, NULLABLE): Completion certificate link
- `created_at` (DATETIME)

**Indexes:**
- `user_id` (for fast user lookups)
- `verification_status` (for filtering)

### 3. Courses Table

Stores online courses and certifications.

**Columns:**
- `id` (INTEGER, PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY → users.id)
- `course_name` (STRING): Course title
- `platform` (STRING): Learning platform (Coursera, Udemy, etc.)
- `instructor` (STRING, NULLABLE): Course instructor
- `completion_date` (DATETIME, NULLABLE): When completed
- `duration_hours` (INTEGER, NULLABLE): Course length
- `grade` (STRING, NULLABLE): Score/grade achieved
- `description` (TEXT, NULLABLE): Course description
- `skills_learned` (STRING, NULLABLE): Comma-separated skills
- `verification_status` (ENUM): pending/verified/rejected
- `certificate_url` (STRING, NULLABLE): Certificate link
- `certificate_id` (STRING, NULLABLE): Certificate ID for verification
- `created_at` (DATETIME)

### 4. Hackathons Table

Records hackathon participations.

**Columns:**
- `id` (INTEGER, PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY → users.id)
- `hackathon_name` (STRING): Event name
- `organizer` (STRING): Organizing entity
- `participation_date` (DATETIME): Event date
- `team_size` (INTEGER, NULLABLE): Number of team members
- `position` (STRING, NULLABLE): Winner, Runner-up, etc.
- `project_name` (STRING, NULLABLE): Submitted project name
- `project_description` (TEXT, NULLABLE): Project details
- `technologies_used` (STRING, NULLABLE): Tech stack
- `project_url` (STRING, NULLABLE): Demo/GitHub link
- `verification_status` (ENUM): pending/verified/rejected
- `certificate_url` (STRING, NULLABLE): Certificate link
- `created_at` (DATETIME)

### 5. Projects Table

Manages personal, academic, and professional projects.

**Columns:**
- `id` (INTEGER, PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY → users.id)
- `project_name` (STRING): Project title
- `project_type` (STRING, NULLABLE): Personal/Academic/Professional
- `start_date` (DATETIME): Project start date
- `end_date` (DATETIME, NULLABLE): Project end date
- `is_ongoing` (BOOLEAN): Still in progress flag
- `description` (TEXT): Project description
- `technologies` (STRING, NULLABLE): Tech stack used
- `role` (STRING, NULLABLE): Your role in project
- `team_size` (INTEGER, NULLABLE): Team size
- `github_url` (STRING, NULLABLE): Source code URL
- `live_url` (STRING, NULLABLE): Live demo URL
- `verification_status` (ENUM): pending/verified/rejected
- `created_at` (DATETIME)

### 6. Skills Table

Master list of all skills in the system.

**Columns:**
- `id` (INTEGER, PRIMARY KEY)
- `name` (STRING, UNIQUE): Skill name (e.g., "Python", "React")
- `category` (STRING, NULLABLE): Programming, Framework, Tool, Soft Skill
- `created_at` (DATETIME)

**Note:** This is a lookup table. Skills are shared across users.

### 7. UserSkills Table (Junction Table)

Links users to their skills with proficiency levels.

**Columns:**
- `id` (INTEGER, PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY → users.id)
- `skill_id` (INTEGER, FOREIGN KEY → skills.id)
- `proficiency_level` (STRING, NULLABLE): Beginner/Intermediate/Advanced/Expert
- `years_of_experience` (INTEGER, NULLABLE): Years of practice
- `verified_count` (INTEGER, DEFAULT 0): Times verified across platforms
- `created_at` (DATETIME)

**Composite Unique Index:** (user_id, skill_id) to prevent duplicates

### 8. Resumes Table

Stores resume metadata and configurations.

**Columns:**
- `id` (INTEGER, PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY → users.id)
- `title` (STRING): Resume title/name
- `template` (STRING, DEFAULT 'modern'): modern/classic/minimal/creative
- `summary` (TEXT, NULLABLE): Professional summary (AI-generated or custom)
- `is_ai_generated_summary` (INTEGER/BOOLEAN): Whether summary is AI-made
- `configuration` (JSON, NULLABLE): Custom settings
  ```json
  {
    "show_photo": true,
    "color_scheme": "blue",
    "sections": ["experience", "education", "skills"],
    "font_size": "medium"
  }
  ```
- `is_public` (INTEGER/BOOLEAN): Public visibility flag
- `public_url_slug` (STRING, UNIQUE, NULLABLE): SEO-friendly URL
- `view_count` (INTEGER, DEFAULT 0): Number of views
- `last_generated_at` (DATETIME, NULLABLE): Last time generated
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

## Verification Status Enum

All achievement tables use the same verification status:

```python
class VerificationStatus(str, enum.Enum):
    PENDING = "pending"      # Awaiting verification
    VERIFIED = "verified"    # Confirmed by platform/admin
    REJECTED = "rejected"    # Invalid/fake
```

## Indexes

**Primary Indexes:**
- All tables have PRIMARY KEY on `id`

**Foreign Key Indexes:**
- All `user_id` columns are indexed
- `skill_id` in UserSkills is indexed

**Unique Indexes:**
- `users.email`
- `skills.name`
- `resumes.public_url_slug`

**Composite Indexes:**
- `user_skills(user_id, skill_id)` for fast lookups

## Data Integrity

### Foreign Key Constraints:
- All foreign keys use CASCADE DELETE
- When a user is deleted, all their data is removed

### Not Null Constraints:
- Core fields like `user_id`, `email`, `course_name` cannot be NULL
- Optional fields like `location`, `description` allow NULL

### Unique Constraints:
- Email addresses must be unique
- Skill names must be unique
- Public resume slugs must be unique

## Sample Queries

### Get all achievements for a user:
```sql
SELECT * FROM internships WHERE user_id = ?;
SELECT * FROM courses WHERE user_id = ?;
SELECT * FROM hackathons WHERE user_id = ?;
SELECT * FROM projects WHERE user_id = ?;
```

### Get user with all skills:
```sql
SELECT u.*, s.name, us.proficiency_level
FROM users u
JOIN user_skills us ON u.id = us.user_id
JOIN skills s ON us.skill_id = s.id
WHERE u.id = ?;
```

### Get complete resume data:
```sql
SELECT r.*, u.*
FROM resumes r
JOIN users u ON r.user_id = u.id
WHERE r.id = ?;
```

## Migration Strategy

The current implementation uses SQLAlchemy's `Base.metadata.create_all()` which:
1. Creates tables if they don't exist
2. Does NOT alter existing tables
3. Suitable for development

For production, use Alembic for proper migrations:
```bash
pip install alembic
alembic init migrations
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head
```

## Performance Considerations

1. **Indexes**: All foreign keys are indexed automatically
2. **Queries**: Use SQLAlchemy's lazy loading for related data
3. **Caching**: Consider Redis for user sessions and frequent queries
4. **Pagination**: Implement for large datasets (courses, projects)
5. **Archiving**: Old resumes could be archived after 1 year

## Future Enhancements

1. **Add Education table** for formal degrees
2. **Add Achievements table** for awards/recognition
3. **Add SkillEndorsements** for peer verification
4. **Add ResumeVersions** for history tracking
5. **Add ActivityLog** for audit trail
6. **Add integrations table** for linked accounts (LinkedIn, GitHub)

---

**Database File:** `resume_system.db` (SQLite in development)  
**Recommended Production:** PostgreSQL or MySQL

