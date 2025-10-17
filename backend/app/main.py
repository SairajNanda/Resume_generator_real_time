from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, users, achievements, resumes

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Resume Building & Career Ecosystem API",
    description="API for dynamic resume generation based on verified achievements",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(achievements.router, prefix="/api")
app.include_router(resumes.router, prefix="/api")


@app.get("/")
def read_root():
    return {
        "message": "Welcome to Resume Building & Career Ecosystem API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}

