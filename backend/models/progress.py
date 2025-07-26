from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
from enum import Enum

from models.question import SubjectEnum


class ProgressStatus(str, Enum):
    """Enum for progress status."""
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class PerformanceLevel(str, Enum):
    """Enum for performance levels."""
    NEEDS_IMPROVEMENT = "needs_improvement"  # < 60%
    SATISFACTORY = "satisfactory"           # 60-75%
    GOOD = "good"                           # 75-90%
    EXCELLENT = "excellent"                 # > 90%


class TopicProgress(BaseModel):
    """Model for tracking progress on a specific topic."""
    topic_name: str
    status: ProgressStatus = ProgressStatus.NOT_STARTED
    questions_attempted: int = 0
    questions_correct: int = 0
    performance_level: PerformanceLevel = PerformanceLevel.NEEDS_IMPROVEMENT
    last_activity: Optional[datetime] = None


class SubjectProgress(BaseModel):
    """Model for tracking progress on a subject."""
    subject: SubjectEnum
    status: ProgressStatus = ProgressStatus.NOT_STARTED
    topics: Dict[str, TopicProgress] = {}
    overall_score: float = 0.0  # Percentage
    questions_attempted: int = 0
    questions_correct: int = 0
    performance_level: PerformanceLevel = PerformanceLevel.NEEDS_IMPROVEMENT
    study_time_minutes: int = 0
    last_activity: Optional[datetime] = None


class UserProgress(BaseModel):
    """Model for tracking a user's overall progress."""
    user_id: str
    subjects: Dict[str, SubjectProgress] = {}
    overall_score: float = 0.0  # Percentage
    total_study_time_minutes: int = 0
    questions_attempted: int = 0
    questions_correct: int = 0
    performance_level: PerformanceLevel = PerformanceLevel.NEEDS_IMPROVEMENT
    streak_days: int = 0
    last_activity: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class StudySession(BaseModel):
    """Model for a study session."""
    id: str
    user_id: str
    subject: SubjectEnum
    topic: Optional[str] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    questions_attempted: int = 0
    questions_correct: int = 0
    score: float = 0.0  # Percentage
    notes: Optional[str] = None


class StudyPlan(BaseModel):
    """Model for a study plan."""
    id: str
    user_id: str
    name: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    subjects: List[SubjectEnum]
    daily_goal_minutes: int = 60
    weekly_goal_minutes: int = 420  # 7 hours
    created_at: datetime
    updated_at: datetime
    status: ProgressStatus = ProgressStatus.NOT_STARTED


class PerformanceMetric(BaseModel):
    """Model for performance metrics."""
    user_id: str
    metric_type: str  # e.g., "accuracy", "speed", "consistency"
    subject: Optional[SubjectEnum] = None
    topic: Optional[str] = None
    value: float
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None