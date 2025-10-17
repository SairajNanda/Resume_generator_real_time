# Setup Instructions

## Prerequisites

- **Python 3.11+** installed
- **Node.js 18+** and npm installed
- Terminal/Command prompt access

## Backend Setup

### 1. Navigate to backend directory

```bash
cd backend
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the virtual environment

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Create environment file

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Or manually create `.env` with the following content:

```
DATABASE_URL=sqlite:///./resume_system.db
SECRET_KEY=your-super-secret-key-change-this-in-production-12345678
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENAI_API_KEY=  # Optional - leave empty to use fallback AI
```

### 6. Start the backend server

```bash
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

**API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Frontend Setup

### 1. Open a new terminal and navigate to frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env.local` file in the `frontend` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Start the development server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Quick Start Guide

### First Time Setup

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   uvicorn app.main:app --reload --port 8000
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application:**
   - Open your browser to `http://localhost:3000`
   - Click "Get Started" to register a new account
   - Login with your credentials
   - Start adding achievements!

### Creating Your First Resume

1. **Register/Login** at http://localhost:3000
2. **Add Achievements:**
   - Navigate to dashboard
   - Add internships, courses, hackathons, projects, and skills
3. **Create Resume:**
   - Click "Create Resume" on the dashboard
   - AI will automatically generate a professional summary
   - Choose from multiple templates (Modern, Classic, Minimal, Creative)
4. **Customize:**
   - Edit template
   - Regenerate AI summary
   - Toggle public/private visibility

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
uvicorn app.main:app --reload --port 8001
```
(Update frontend `.env.local` to use port 8001)

**Database errors:**
Delete the database and restart:
```bash
rm resume_system.db
uvicorn app.main:app --reload --port 8000
```

### Frontend Issues

**Port 3000 in use:**
```bash
npm run dev -- -p 3001
```

**Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API connection errors:**
- Verify backend is running on port 8000
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`

## Production Deployment

### Backend

1. Update `.env` with production values
2. Use a production database (PostgreSQL recommended)
3. Set a strong `SECRET_KEY`
4. Deploy using:
   - **Render**: https://render.com (Python)
   - **Railway**: https://railway.app
   - **AWS**: EC2 or Elastic Beanstalk

### Frontend

1. Build the application:
   ```bash
   npm run build
   npm start
   ```

2. Deploy using:
   - **Vercel**: https://vercel.com (Recommended for Next.js)
   - **Netlify**: https://netlify.com
   - **AWS**: Amplify or S3 + CloudFront

## Features Overview

### ✅ Implemented Features

1. **User Authentication**
   - Registration and login with JWT tokens
   - Secure password hashing
   - Protected routes

2. **Achievement Management**
   - Internships tracking
   - Course certifications
   - Hackathon participation
   - Project portfolio
   - Skills management with proficiency levels

3. **Resume Generation**
   - Multiple templates (Modern, Classic, Minimal, Creative)
   - AI-powered professional summaries
   - Real-time preview
   - Public/private sharing

4. **AI Integration**
   - Intelligent resume summary generation
   - Fallback algorithm when OpenAI is not available
   - Skills extraction from achievements

5. **Real-time Updates**
   - Automatic resume updates when achievements are added
   - Live preview of changes
   - Template switching

### 🔮 Future Enhancements

- PDF export functionality
- Integration with LinkedIn, GitHub APIs
- Blockchain-based verification
- Resume analytics
- ATS optimization score
- Multiple language support
- Collaborative editing

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database operations
- **SQLite**: Development database
- **JWT**: Authentication
- **Pydantic**: Data validation

### Frontend
- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Zustand**: State management
- **Axios**: HTTP client

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API documentation at http://localhost:8000/docs
3. Check browser console for frontend errors
4. Check terminal logs for backend errors

---

**Happy Resume Building!** 🚀

