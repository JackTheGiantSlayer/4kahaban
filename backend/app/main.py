from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.database import engine
from app.models.all_models import Base
from app.api import auth, users, animals, vaccines, public
from app.services.scheduler_service import start_scheduler
import os

app = FastAPI(title="4kahaban API")

# Create folders for uploads if they don't exist
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    # Start scheduler for vaccines
    start_scheduler()

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(animals.router, prefix="/api/v1/animals", tags=["animals"])
app.include_router(vaccines.router, prefix="/api/v1/vaccines", tags=["vaccines"])
app.include_router(public.router, prefix="/api/v1/public", tags=["public"])

@app.get("/")
def read_root():
    return {"message": "Welcome to 4kahaban API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
