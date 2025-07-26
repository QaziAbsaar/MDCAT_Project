from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum


class SubjectEnum(str, Enum):
    """Enum for MDCAT subjects."""
    BIOLOGY = "biology"
    CHEMISTRY = "chemistry"
    PHYSICS = "physics"
    ENGLISH = "english"
    LOGICAL_REASONING = "logical_reasoning"


class DifficultyLevel(str, Enum):
    """Enum for question difficulty levels."""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class QuestionType(str, Enum):
    """Enum for question types."""
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"
    LONG_ANSWER = "long_answer"


class QuestionOption(BaseModel):
    """Model for a multiple choice option."""
    content: str
    is_correct: bool = False


class BaseQuestion(BaseModel):
    """Base model for questions."""
    content: str = Field(..., min_length=5)
    subject: SubjectEnum
    topic: str
    difficulty: DifficultyLevel = DifficultyLevel.MEDIUM
    question_type: QuestionType = QuestionType.MULTIPLE_CHOICE
    explanation: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class QuestionCreate(BaseQuestion):
    """Model for creating a new question."""
    options: List[QuestionOption]
    created_by: Optional[str] = "system"


class QuestionResponse(BaseQuestion):
    """Model for a question as returned to clients."""
    id: Optional[str] = None
    options: List[QuestionOption]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AnswerSubmission(BaseModel):
    """Model for submitting an answer to a question."""
    question_id: str
    selected_option_index: Optional[int] = None  # For multiple choice
    text_answer: Optional[str] = None  # For short/long answer
    time_taken_seconds: Optional[float] = None  # How long it took to answer


class AnswerResult(BaseModel):
    """Model for the result of an answer submission."""
    question_id: str
    is_correct: bool
    correct_option_index: Optional[int] = None
    explanation: Optional[str] = None


class QuestionGenerateRequest(BaseModel):
    """Model for requesting AI-generated questions."""
    subject: SubjectEnum
    topic: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = None
    question_type: Optional[QuestionType] = None
    count: int = Field(5, ge=1, le=20)  # Generate between 1 and 20 questions
    context: Optional[str] = None  # Optional context to base questions on