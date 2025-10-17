# Resume Building & Career Ecosystem

A next-generation platform for students and professionals to generate dynamic, verified resumes based on real achievements.

## 🚀 Features

- **Dynamic Resume Generation**: Automatically creates resumes from verified achievements
- **Real-time Updates**: Resume updates automatically when new achievements are added
- **AI-Powered Summaries**: Intelligent resume summary generation
- **Multi-Platform Integration**: Supports internships, courses, hackathons, and projects
- **Beautiful UI**: Modern, responsive design with live preview
- **Skill Verification**: Track and verify skills across different platforms

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (React 18)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components

### Backend
- **Python 3.11+**
- **FastAPI**
- **SQLAlchemy** (ORM)
- **SQLite** (Development) / **PostgreSQL** (Production)
- **JWT Authentication**
- **OpenAI API** for AI-powered features

## 📁 Project Structure

```
Trial-task/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── models/      # Database models
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Business logic
│   │   └── main.py      # App entry point
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/            # Next.js frontend
│   ├── src/
│   │   ├── app/        # Next.js 14 app directory
│   │   ├── components/ # React components
│   │   └── lib/        # Utilities
│   ├── package.json
│   └── .env.local.example
│
└── README.md
```

## 🏃 Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔑 Environment Variables

### Backend (.env)
```
DATABASE_URL=sqlite:///./resume_system.db
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-key-here  # Optional for AI features
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📚 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🎯 Key Features Implemented

1. **User Management**: Registration, login, profile management
2. **Achievement Tracking**: Internships, courses, hackathons, projects
3. **Resume Generation**: Multiple templates with live preview
4. **AI Summary**: Auto-generated professional summaries
5. **Skill Management**: Track and verify skills
6. **Export Options**: PDF and JSON formats

## 🔮 Future Enhancements

- Integration with actual platforms (LinkedIn, GitHub, Coursera)
- Blockchain-based verification
- Advanced AI recommendations
- Resume analytics and improvement suggestions
- Multi-language support

## 👨‍💻 Development Notes

This project was built as a trial task to demonstrate:
- Full-stack development capabilities
- Modern UI/UX design
- API architecture
- Database design
- AI integration
- Real-time data updates

---

**Built with ❤️ for the Resume System Trial Task**

