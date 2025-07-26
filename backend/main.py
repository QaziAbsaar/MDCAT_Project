from fastapi import FastAPI, HTTPException
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from config import load_config
from routers import auth, questions, progress
from routers import rag
from database.sqlite import SQLiteDB

# Load configuration
config = load_config()

# Initialize FastAPI app
app = FastAPI(
    title="MDCAT Prep API",
    description="API for MDCAT exam preparation platform",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React default
        "http://localhost:5173",  # Vite default
        "http://localhost:5174",  # Vite alternative
        "http://localhost:5175",  # Vite alternative
        "http://localhost:5176",  # Vite alternative
        "http://127.0.0.1:5173",  # Alternative localhost
        "http://127.0.0.1:5174",  # Alternative localhost
        "http://127.0.0.1:5175",  # Alternative localhost
        "http://127.0.0.1:5176",  # Alternative localhost
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(rag.router)
app.include_router(questions.router)
app.include_router(progress.router)

# Initialize database
@app.on_event("startup")
async def startup_db_client():
    app.db = SQLiteDB()
    app.db.connect()
    app.db.create_tables()

@app.on_event("shutdown")
async def shutdown_db_client():
    if hasattr(app, "db"):
        app.db.disconnect()

@app.get("/")
async def root():
    return {"message": "Welcome to MDCAT Prep API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)