# Project Structure

Complete file tree of the Resume Building & Career Ecosystem

```
Trial-task/
│
├── README.md                      # Main project overview
├── SETUP.md                       # Detailed setup instructions
├── QUICKSTART.md                  # Quick start guide (5 min setup)
├── TRIAL_TASK_SUMMARY.md         # Trial task completion summary
├── DATABASE_SCHEMA.md             # Database documentation
├── PROJECT_STRUCTURE.md           # This file
├── .gitignore                     # Git ignore rules
│
├── backend/                       # Python FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI app entry point
│   │   ├── config.py             # Configuration settings
│   │   ├── database.py           # Database connection & session
│   │   ├── auth.py               # Authentication utilities (JWT, password)
│   │   │
│   │   ├── models/               # SQLAlchemy ORM Models
│   │   │   ├── __init__.py
│   │   │   ├── user.py          # User model
│   │   │   ├── achievement.py   # Internship, Course, Hackathon, Project, Skill models
│   │   │   └── resume.py        # Resume model
│   │   │
│   │   ├── schemas/              # Pydantic schemas for validation
│   │   │   ├── __init__.py
│   │   │   ├── user.py          # User request/response schemas
│   │   │   ├── achievement.py   # Achievement schemas
│   │   │   └── resume.py        # Resume schemas
│   │   │
│   │   ├── routes/               # API endpoints
│   │   │   ├── __init__.py
│   │   │   ├── auth.py          # /api/auth/* endpoints
│   │   │   ├── users.py         # /api/users/* endpoints
│   │   │   ├── achievements.py  # /api/achievements/* endpoints
│   │   │   └── resumes.py       # /api/resumes/* endpoints
│   │   │
│   │   └── services/             # Business logic
│   │       ├── __init__.py
│   │       ├── ai_service.py    # AI resume generation
│   │       └── resume_service.py # Resume data aggregation
│   │
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example             # Environment variables template
│   ├── .env                     # Actual environment (gitignored)
│   ├── start.sh                 # Linux/macOS startup script
│   ├── start.bat                # Windows startup script
│   └── resume_system.db         # SQLite database (created on first run)
│
└── frontend/                     # Next.js Frontend
    ├── src/
    │   ├── app/                  # Next.js 14 App Router
    │   │   ├── layout.tsx       # Root layout with Navbar
    │   │   ├── page.tsx         # Landing page (/)
    │   │   ├── globals.css      # Global styles
    │   │   │
    │   │   ├── login/
    │   │   │   └── page.tsx     # Login page
    │   │   │
    │   │   ├── register/
    │   │   │   └── page.tsx     # Registration page
    │   │   │
    │   │   ├── dashboard/
    │   │   │   └── page.tsx     # Main dashboard
    │   │   │
    │   │   ├── resume/
    │   │   │   └── [id]/
    │   │   │       └── page.tsx # Resume preview & customization
    │   │   │
    │   │   └── achievements/
    │   │       ├── internships/
    │   │       │   └── page.tsx # Internships management
    │   │       ├── courses/
    │   │       │   └── page.tsx # Courses management
    │   │       ├── hackathons/
    │   │       │   └── page.tsx # Hackathons management
    │   │       ├── projects/
    │   │       │   └── page.tsx # Projects management
    │   │       └── skills/
    │   │           └── page.tsx # Skills management
    │   │
    │   ├── components/           # Reusable React components
    │   │   ├── Button.tsx       # Button component with variants
    │   │   ├── Input.tsx        # Input field with labels & errors
    │   │   ├── Card.tsx         # Card components (Card, CardHeader, etc.)
    │   │   └── Navbar.tsx       # Navigation bar
    │   │
    │   ├── lib/                  # Utility functions
    │   │   ├── api.ts           # Axios API client with interceptors
    │   │   └── utils.ts         # Helper functions (cn, formatDate)
    │   │
    │   └── store/                # Zustand state management
    │       ├── authStore.ts     # Authentication state
    │       └── resumeStore.ts   # Resume & achievements state
    │
    ├── public/                   # Static assets
    │
    ├── package.json              # Node.js dependencies & scripts
    ├── tsconfig.json             # TypeScript configuration
    ├── next.config.js            # Next.js configuration
    ├── tailwind.config.ts        # Tailwind CSS configuration
    ├── postcss.config.js         # PostCSS configuration
    ├── .eslintrc.json           # ESLint configuration
    ├── .env.local.example       # Environment variables template
    └── .env.local               # Actual environment (gitignored)
```

## File Count Summary

### Backend
- **Python files**: 17
- **Config files**: 3
- **Scripts**: 2
- **Total Backend**: ~1,500 lines of code

### Frontend
- **TypeScript/TSX files**: 20
- **Config files**: 6
- **Total Frontend**: ~4,500 lines of code

### Documentation
- **Markdown files**: 6
- **Total Documentation**: ~2,000 lines

**Total Project**: ~8,000 lines of code + documentation

## Key Directories Explained

### Backend Structure

#### `/app/models/`
SQLAlchemy ORM models representing database tables:
- Define schema
- Relationships between tables
- Column types and constraints

#### `/app/schemas/`
Pydantic models for:
- Request validation
- Response serialization
- Type safety at API boundaries

#### `/app/routes/`
FastAPI route handlers:
- HTTP method handlers (GET, POST, PUT, DELETE)
- Request/response processing
- Authentication checks

#### `/app/services/`
Business logic layer:
- AI resume generation
- Data aggregation
- Complex operations

### Frontend Structure

#### `/app/`
Next.js 14 App Router pages:
- File-based routing
- Server and client components
- Layouts and templates

#### `/components/`
Reusable UI components:
- Consistent design system
- Shared across pages
- Props-based customization

#### `/store/`
Zustand state management:
- Global application state
- API call wrappers
- State persistence

#### `/lib/`
Utility functions:
- API client configuration
- Helper functions
- Common utilities

## Configuration Files

### Backend Configuration

**`.env`** - Environment variables
```
DATABASE_URL=...
SECRET_KEY=...
OPENAI_API_KEY=...
```

**`requirements.txt`** - Python dependencies
- FastAPI, Uvicorn
- SQLAlchemy, Pydantic
- Authentication libraries

### Frontend Configuration

**`.env.local`** - Frontend environment
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**`package.json`** - Node.js dependencies
- React, Next.js
- Tailwind CSS
- State management

**`tsconfig.json`** - TypeScript settings
- Strict type checking
- Path aliases (@/...)
- Module resolution

**`tailwind.config.ts`** - Tailwind configuration
- Custom color palette
- Theme extensions
- Plugin configuration

## Data Flow

### Authentication Flow
```
Frontend → API Client (axios) → Backend Route (auth.py)
                                 → Auth Service (password check)
                                 → JWT Token Generation
                                 → Response with Token
Frontend ← Token Storage (localStorage)
```

### Resume Creation Flow
```
Frontend → Create Resume Button
         → API: POST /api/resumes
         → Backend: Resume Route
         → Resume Service: Aggregate User Data
         → AI Service: Generate Summary
         → Database: Save Resume
         → Response: Resume Object
Frontend ← Update State (Zustand)
         ← Navigate to Resume Preview
```

### Achievement Addition Flow
```
Frontend → Achievement Form
         → API: POST /api/achievements/{type}
         → Backend: Validate Data (Pydantic)
         → Database: Save Achievement
         → Response: Created Achievement
Frontend ← Update State (Zustand)
         ← Show Success Toast
         ← Refresh Achievement List
```

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get JWT token

### User Management
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile

### Achievements
- `GET/POST /api/achievements/internships`
- `GET/POST /api/achievements/courses`
- `GET/POST /api/achievements/hackathons`
- `GET/POST /api/achievements/projects`
- `GET/POST /api/achievements/skills`
- `DELETE /api/achievements/{type}/{id}`

### Resumes
- `GET /api/resumes` - List all resumes
- `GET /api/resumes/{id}` - Get resume with data
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/{id}` - Update resume
- `DELETE /api/resumes/{id}` - Delete resume
- `POST /api/resumes/{id}/regenerate-summary` - AI regeneration

## Build & Deploy

### Backend Build
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Build
```bash
cd frontend
npm run build
npm start
```

### Docker (Future Enhancement)
```dockerfile
# Example Dockerfile for backend
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0"]
```

## Development Workflow

1. **Backend Development**
   - Modify models → Update schemas → Implement routes → Test in Swagger
   - Hot reload enabled with `--reload` flag

2. **Frontend Development**
   - Create components → Build pages → Connect to API → Test in browser
   - Fast refresh enabled in Next.js dev mode

3. **Database Changes**
   - Update models → Delete DB → Restart backend → Tables recreated
   - Production: Use Alembic migrations

## Testing Strategy

### Backend Testing (Future)
```python
# tests/test_auth.py
def test_register_user():
    response = client.post("/api/auth/register", json={...})
    assert response.status_code == 201
```

### Frontend Testing (Future)
```typescript
// __tests__/Button.test.tsx
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
  });
});
```

---

**Last Updated**: Current as of project completion
**Maintainer**: Trial Task Submission

