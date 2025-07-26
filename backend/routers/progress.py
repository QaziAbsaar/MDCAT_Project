from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, List, Optional
import uuid
from datetime import datetime, timedelta

from models.progress import (
    UserProgress,
    SubjectProgress,
    TopicProgress,
    StudySession,
    StudyPlan,
    PerformanceMetric,
    ProgressStatus,
    PerformanceLevel
)
from models.question import SubjectEnum
from models.user import User
from utils.auth import get_current_active_user
from services.progress_service import ProgressService
from database.sqlite import get_db, SQLiteDB

# Create router
router = APIRouter(
    prefix="/progress",
    tags=["progress"],
    responses={401: {"description": "Unauthorized"}},
)

# Add endpoint to add performance metrics
@router.post("/metrics", response_model=PerformanceMetric, status_code=status.HTTP_201_CREATED)
async def add_performance_metric(
    metric: PerformanceMetric,
    current_user: User = Depends(get_current_active_user),
    db: SQLiteDB = Depends(get_db)
):
    """Add a new performance metric."""
    # Ensure the metric belongs to the current user
    metric.user_id = current_user.id
    
    # Add the metric
    progress_service = ProgressService(db)
    metric_id = progress_service.add_performance_metric(metric)
    
    return metric


@router.get("/user", response_model=UserProgress)
async def get_user_progress(
    current_user: User = Depends(get_current_active_user),
    db: SQLiteDB = Depends(get_db)
):
    """Get the current user's progress."""
    progress_service = ProgressService(db)
    user_progress = progress_service.get_user_progress(current_user.id)
    
    if not user_progress:
        # Create a new user progress record if none exists
        now = datetime.utcnow()
        user_progress = UserProgress(
            user_id=current_user.id,
            subjects={},
            overall_score=0.0,
            total_study_time_minutes=0,
            questions_attempted=0,
            questions_correct=0,
            performance_level=PerformanceLevel.NEEDS_IMPROVEMENT,
            streak_days=0,
            last_activity=now,
            created_at=now,
            updated_at=now
        )
        progress_service.create_or_update_user_progress(user_progress)
    
    return user_progress


@router.post("/sessions", response_model=StudySession, status_code=status.HTTP_201_CREATED)
async def create_study_session(
    session: StudySession,
    current_user: User = Depends(get_current_active_user),
    db: SQLiteDB = Depends(get_db)
):
    """Create a new study session."""
    # Ensure the session belongs to the current user
    session.user_id = current_user.id
    
    # Create the session and update progress
    progress_service = ProgressService(db)
    session_id = progress_service.create_study_session(session)
    
    # Return the created session
    return session


@router.get("/sessions", response_model=List[StudySession])
async def get_study_sessions(
    subject: Optional[SubjectEnum] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 10,
    current_user: User = Depends(get_current_active_user),
    db: SQLiteDB = Depends(get_db)
):
    """Get the user's study sessions, optionally filtered by subject and date range."""
    progress_service = ProgressService(db)
    sessions = progress_service.get_study_sessions(
        user_id=current_user.id,
        subject=subject,
        start_date=start_date,
        end_date=end_date,
        limit=limit
    )
    
    return sessions


@router.post("/plans", response_model=StudyPlan, status_code=status.HTTP_201_CREATED)
async def create_study_plan(
    plan: StudyPlan,
    current_user: User = Depends(get_current_active_user),
    db: SQLiteDB = Depends(get_db)
):
    """Create a new study plan."""
    # Ensure the plan belongs to the current user
    plan.user_id = current_user.id
    
    # Set initial status if not provided
    if not plan.status:
        plan.status = ProgressStatus.NOT_STARTED
    
    # Create the plan
    progress_service = ProgressService(db)
    plan_id = progress_service.create_study_plan(plan)
    
    # Get the created plan
    plans = progress_service.get_study_plans(current_user.id)
    created_plan = next((p for p in plans if p.id == plan_id), None)
    
    if not created_plan:
        raise HTTPException(status_code=500, detail="Failed to create study plan")
    
    return created_plan


@router.get("/plans", response_model=List[StudyPlan])
async def get_study_plans(
    current_user: User = Depends(get_current_active_user),
    db: SQLiteDB = Depends(get_db)
):
    """Get the user's study plans."""
    progress_service = ProgressService(db)
    plans = progress_service.get_study_plans(current_user.id)
    return plans


@router.get("/metrics", response_model=List[PerformanceMetric])
async def get_performance_metrics(
    metric_type: Optional[str] = None,
    subject: Optional[SubjectEnum] = None,
    days: int = 30,
    current_user: User = Depends(get_current_active_user),
    db: SQLiteDB = Depends(get_db)
):
    """Get the user's performance metrics, optionally filtered by type and subject."""
    progress_service = ProgressService(db)
    metrics = progress_service.get_performance_metrics(
        user_id=current_user.id,
        metric_type=metric_type,
        subject=subject,
        days=days
    )
    
    return metrics