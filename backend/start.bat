@echo off
REM Resume System Backend Startup Script for Windows

echo 🚀 Starting Resume System Backend...

REM Check if virtual environment exists
if not exist "venv\" (
    echo ❌ Virtual environment not found. Creating one...
    python -m venv venv
)

REM Activate virtual environment
echo 📦 Activating virtual environment...
call venv\Scripts\activate

REM Install/update dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt --quiet

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from .env.example...
    copy .env.example .env
    echo ✏️  Please update .env with your configuration
)

REM Start the server
echo 🌟 Starting FastAPI server...
echo 📚 API Documentation will be available at:
echo    - Swagger UI: http://localhost:8000/docs
echo    - ReDoc: http://localhost:8000/redoc
echo.
uvicorn app.main:app --reload --port 8000

