from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
import uuid
from datetime import datetime

from models.question import (
    QuestionResponse,
    QuestionCreate,
    AnswerSubmission,
    AnswerResult,
    QuestionGenerateRequest,
    SubjectEnum,
    DifficultyLevel,
    QuestionType
)
from models.user import User
from utils.auth import get_current_active_user
from services.question_service import QuestionService
from database.sqlite import get_db, SQLiteDB

# Create router
router = APIRouter(
    prefix="/questions",
    tags=["questions"],
    responses={401: {"description": "Unauthorized"}},
)


@router.post("/generate", response_model=List[QuestionResponse])
async def generate_questions(
    request: QuestionGenerateRequest,
    current_user: User = Depends(get_current_active_user),
    db: SQLiteDB = Depends(get_db)
):
    """Generate AI-powered questions based on the request parameters."""
    try:
        question_service = QuestionService(db)
        questions = question_service.generate_questions(request)
        return questions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating questions: {str(e)}"
        )


@router.post("/submit-answer", response_model=AnswerResult)
async def submit_answer(
    submission: AnswerSubmission,
    current_user: User = Depends(get_current_active_user),
    db: SQLiteDB = Depends(get_db)
):
    """Submit an answer to a question and get the result."""
    try:
        question_service = QuestionService(db)
        result = question_service.submit_answer(current_user.id, submission)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting answer: {str(e)}"
        )


@router.get("/by-subject/{subject}", response_model=List[QuestionResponse])
async def get_questions_by_subject(
    subject: SubjectEnum,
    limit: int = 10,
    offset: int = 0,
    current_user: User = Depends(get_current_active_user),
    db: SQLiteDB = Depends(get_db)
):
    """Get questions filtered by subject."""
    question_service = QuestionService(db)
    questions = question_service.get_questions_by_subject(
        subject=subject,
        limit=limit,
        offset=offset
    )
    return questions


@router.get("/{question_id}", response_model=QuestionResponse)
async def get_question(
    question_id: str,
    current_user: User = Depends(get_current_active_user),
    db: SQLiteDB = Depends(get_db)
):
    """Get a specific question by ID."""
    question_service = QuestionService(db)
    question = question_service.get_question_by_id(question_id)
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Question with ID {question_id} not found"
        )
    
    return question