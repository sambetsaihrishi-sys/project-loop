from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine

from app.models.user import User
from app.models.organization import Organization
from app.models.membership import Membership
from app.models.feedback import Feedback
from app.api.feedback import router as feedback_router
from app.api.auth import router as auth_router
from app.api.ai import router as ai_router
from app.api.workspace import router as workspace_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Project LOOP API",
    description="AI-powered Customer Feedback Intelligence Platform",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(feedback_router)
app.include_router(auth_router)
app.include_router(feedback_router)
app.include_router(ai_router)
app.include_router(workspace_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://project-loop-swart.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to Project LOOP",
        "status": "healthy",
        "platform": "AI Customer Feedback Intelligence"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }