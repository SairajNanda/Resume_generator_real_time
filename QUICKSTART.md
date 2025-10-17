# 🚀 Quick Start Guide

Get the Resume System running in **5 minutes**!

## Prerequisites Check

Before starting, verify you have:

```bash
# Check Python version (need 3.11+)
python3 --version

# Check Node.js version (need 18+)
node --version

# Check npm
npm --version
```

If any are missing, install them first.

## Option 1: Automated Start (Recommended)

### macOS/Linux:

**Terminal 1 - Backend:**
```bash
cd backend
chmod +x start.sh
./start.sh
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```






## First Time Usage

1. **Open** http://localhost:3000 in your browser

2. **Register** a new account:
   - Click "Get Started" or "Register"
   - Fill in your details
   - Submit the form

3. **Login** with your credentials

4. **Add some achievements**:
   - Go to Dashboard
   - Click on Internships, Courses, Projects, or Skills
   - Add at least 2-3 items in different categories

5. **Create your resume**:
   - Click "Create Resume" button on Dashboard
   - Watch as AI generates your professional summary
   - Choose a template (Modern, Classic, Minimal, Creative)
   - Customize and export!

## Verify Installation

### Backend Health Check:

Visit http://localhost:8000 - you should see:
```json
{
  "message": "Welcome to Resume Building & Career Ecosystem API",
  "version": "1.0.0",
  "docs": "/docs"
}
```

### API Documentation:

Visit http://localhost:8000/docs for interactive API docs

### Frontend Check:

Visit http://localhost:3000 - you should see the landing page with:
- "Build Your Professional Resume Automatically" heading
- Navigation bar
- "Get Started" button

## Common Issues & Solutions

### ❌ Port 8000 already in use

**Solution:** Use a different port
```bash
uvicorn app.main:app --reload --port 8001
```
Then update `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### ❌ Port 3000 already in use

**Solution:** Use a different port
```bash
npm run dev -- -p 3001
```
Then visit http://localhost:3001

### ❌ Module not found errors (Python)

**Solution:** Reinstall dependencies
```bash
pip install -r requirements.txt --force-reinstall
```

### ❌ Module not found errors (Node)

**Solution:** Clear and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Database errors

**Solution:** Delete and recreate database
```bash
cd backend
rm resume_system.db
# Restart the backend server
```

### ❌ CORS errors in browser

**Solution:** 
1. Make sure backend is running
2. Check `.env.local` has correct API URL
3. Clear browser cache and reload

## Testing the System

### Test User Registration:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

### Test Login:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=password123"
```

## What's Next?

After getting it running:

1. **Explore the API**: http://localhost:8000/docs
2. **Read the full docs**: See `SETUP.md` for detailed information
3. **Check the architecture**: See `DATABASE_SCHEMA.md`
4. **Review the summary**: See `TRIAL_TASK_SUMMARY.md`

## Demo Account (Optional)

You can manually create a demo account with sample data by:

1. Register as usual
2. Add sample achievements:
   - 2-3 internships
   - 3-4 courses
   - 1-2 hackathons
   - 2-3 projects
   - 5+ skills
3. Create a resume
4. Try different templates

## Stopping the Application

**Backend:**
- Press `Ctrl+C` in the backend terminal

**Frontend:**
- Press `Ctrl+C` in the frontend terminal

**Deactivate Python virtual environment:**
```bash
deactivate
```

## Need Help?

1. Check `SETUP.md` for detailed instructions
2. Review error messages in terminal
3. Check browser console for frontend errors
4. Review API docs at http://localhost:8000/docs

---

**🎉 Enjoy building amazing resumes!**

