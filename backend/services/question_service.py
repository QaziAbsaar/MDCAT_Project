import uuid
import random
from typing import List, Dict, Optional, Any, Union
from datetime import datetime

from database.sqlite import SQLiteDB
from models.question import (
    QuestionType,
    DifficultyLevel,
    SubjectEnum,
    QuestionOption,
    BaseQuestion,
    QuestionCreate,
    QuestionResponse,
    AnswerSubmission,
    AnswerResult,
    QuestionGenerateRequest
)
from services.progress_service import ProgressService
from models.progress import PerformanceMetric


class QuestionService:
    """Service for managing questions and answers."""
    
    def __init__(self, db: SQLiteDB):
        """Initialize the question service with a database connection.
        
        Args:
            db: SQLite database connection
        """
        self.db = db
        self.progress_service = ProgressService(db)
    
    def create_question(self, question: QuestionCreate) -> str:
        """Create a new question in the database.
        
        Args:
            question: The question data to save
            
        Returns:
            The ID of the created question
        """
        question_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        # Insert the question
        self.db.insert(
            "questions",
            {
                "id": question_id,
                "subject": question.subject.value,
                "topic": question.topic,
                "difficulty": question.difficulty.value,
                "question_type": question.question_type.value,
                "content": question.content,
                "explanation": question.explanation,
                "created_at": now,
                "updated_at": now,
                "created_by": question.created_by
            }
        )
        
        # Insert the options
        for option in question.options:
            self.db.insert(
                "question_options",
                {
                    "id": str(uuid.uuid4()),
                    "question_id": question_id,
                    "content": option.content,
                    "is_correct": option.is_correct
                }
            )
        
        return question_id
    
    def get_question_by_id(self, question_id: str) -> Optional[QuestionResponse]:
        """Get a question by its ID.
        
        Args:
            question_id: The ID of the question
            
        Returns:
            The question data, or None if not found
        """
        # Get the question
        question_record = self.db.fetch_one(
            "SELECT * FROM questions WHERE id = ?",
            (question_id,)
        )
        
        if not question_record:
            return None
        
        # Get the options
        option_records = self.db.fetch_all(
            "SELECT * FROM question_options WHERE question_id = ?",
            (question_id,)
        )
        
        options = []
        for option in option_records:
            options.append(QuestionOption(
                content=option['content'],
                is_correct=option['is_correct']
            ))
        
        # Create and return the question response
        return QuestionResponse(
            id=question_record['id'],
            subject=SubjectEnum(question_record['subject']),
            topic=question_record['topic'],
            difficulty=DifficultyLevel(question_record['difficulty']),
            question_type=QuestionType(question_record['question_type']),
            content=question_record['content'],
            options=options,
            explanation=question_record['explanation'],
            created_at=question_record['created_at'],
            updated_at=question_record['updated_at']
        )
    
    def get_questions_by_subject(self, subject: SubjectEnum, limit: int = 10, 
                               offset: int = 0) -> List[QuestionResponse]:
        """Get questions by subject.
        
        Args:
            subject: The subject to filter by
            limit: Maximum number of questions to return
            offset: Number of questions to skip
            
        Returns:
            A list of questions
        """
        # Get the questions
        question_records = self.db.fetch_all(
            "SELECT * FROM questions WHERE subject = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
            (subject.value, limit, offset)
        )
        
        questions = []
        for record in question_records:
            # Get the options for this question
            option_records = self.db.fetch_all(
                "SELECT * FROM question_options WHERE question_id = ?",
                (record['id'],)
            )
            
            options = []
            for option in option_records:
                options.append(QuestionOption(
                    content=option['content'],
                    is_correct=option['is_correct']
                ))
            
            # Create the question response
            questions.append(QuestionResponse(
                id=record['id'],
                subject=SubjectEnum(record['subject']),
                topic=record['topic'],
                difficulty=DifficultyLevel(record['difficulty']),
                question_type=QuestionType(record['question_type']),
                content=record['content'],
                options=options,
                explanation=record['explanation'],
                created_at=record['created_at'],
                updated_at=record['updated_at']
            ))
        
        return questions
    
    def submit_answer(self, user_id: str, submission: AnswerSubmission) -> AnswerResult:
        """Submit an answer to a question and get the result.
        
        Args:
            user_id: The ID of the user submitting the answer
            submission: The answer submission data
            
        Returns:
            The result of the answer submission
        """
        # Get the question
        question = self.get_question_by_id(submission.question_id)
        if not question:
            raise ValueError(f"Question with ID {submission.question_id} not found")
        
        # Find the correct option
        correct_option = next((o for o in question.options if o.is_correct), None)
        if not correct_option:
            raise ValueError(f"Question with ID {submission.question_id} has no correct option")
        
        # Check if the answer is correct
        is_correct = False
        if question.question_type == QuestionType.MULTIPLE_CHOICE:
            # For multiple choice, check if the selected option is correct
            selected_option = next((o for i, o in enumerate(question.options) 
                                  if i == submission.selected_option_index), None)
            if selected_option:
                is_correct = selected_option.is_correct
        elif question.question_type == QuestionType.TRUE_FALSE:
            # For true/false, check if the selected option is correct
            is_correct = submission.selected_option_index == (0 if correct_option.content.lower() == "true" else 1)
        
        # Record the answer in the database
        now = datetime.utcnow()
        answer_id = str(uuid.uuid4())
        
        self.db.insert(
            "user_answers",
            {
                "id": answer_id,
                "user_id": user_id,
                "question_id": submission.question_id,
                "selected_option_index": submission.selected_option_index,
                "is_correct": is_correct,
                "time_taken_seconds": submission.time_taken_seconds,
                "submitted_at": now
            }
        )
        
        # Update user progress metrics
        self._update_progress_metrics(user_id, question, is_correct, submission.time_taken_seconds)
        
        # Return the result
        return AnswerResult(
            question_id=submission.question_id,
            is_correct=is_correct,
            correct_option_index=next((i for i, o in enumerate(question.options) if o.is_correct), None),
            explanation=question.explanation
        )
    
    def _update_progress_metrics(self, user_id: str, question: QuestionResponse, 
                               is_correct: bool, time_taken_seconds: Optional[float] = None) -> None:
        """Update user progress metrics based on an answer submission.
        
        Args:
            user_id: The ID of the user
            question: The question that was answered
            is_correct: Whether the answer was correct
            time_taken_seconds: How long it took to answer the question
        """
        now = datetime.utcnow()
        
        # Add accuracy metric
        self.progress_service.add_performance_metric(PerformanceMetric(
            user_id=user_id,
            metric_type="accuracy",
            subject=question.subject,
            topic=question.topic,
            value=100.0 if is_correct else 0.0,
            timestamp=now,
            metadata={
                "question_id": question.id,
                "difficulty": question.difficulty.value
            }
        ))
        
        # Add speed metric if time was provided
        if time_taken_seconds is not None:
            self.progress_service.add_performance_metric(PerformanceMetric(
                user_id=user_id,
                metric_type="speed",
                subject=question.subject,
                topic=question.topic,
                value=time_taken_seconds,
                timestamp=now,
                metadata={
                    "question_id": question.id,
                    "difficulty": question.difficulty.value,
                    "is_correct": is_correct
                }
            ))
    
    def generate_questions(self, request: QuestionGenerateRequest) -> List[QuestionResponse]:
        """Generate questions based on the request parameters.
        
        In a real implementation, this would use an AI model to generate questions.
        For now, it returns existing questions from the database or creates dummy questions.
        
        Args:
            request: The question generation request parameters
            
        Returns:
            A list of generated questions
        """
        # Try to get existing questions first
        existing_questions = self.get_questions_by_subject(
            subject=request.subject,
            limit=request.count
        )
        
        # If we have enough questions, return them
        if len(existing_questions) >= request.count:
            return existing_questions[:request.count]
        
        # Otherwise, create dummy questions to make up the difference
        dummy_questions = []
        for i in range(request.count - len(existing_questions)):
            # Create a dummy question
            question = self._create_dummy_question(request.subject, request.topic, request.difficulty)
            
            # Save it to the database
            question_id = self.create_question(QuestionCreate(
                subject=question.subject,
                topic=question.topic,
                difficulty=question.difficulty,
                question_type=question.question_type,
                content=question.content,
                options=question.options,
                explanation=question.explanation,
                created_by="system"
            ))
            
            # Add the ID to the question
            question.id = question_id
            
            dummy_questions.append(question)
        
        # Combine existing and dummy questions
        return existing_questions + dummy_questions
    
    def _create_dummy_question(self, subject: SubjectEnum, topic: Optional[str] = None,
                             difficulty: Optional[DifficultyLevel] = None) -> QuestionResponse:
        """Create a dummy question for testing purposes.
        
        Args:
            subject: The subject of the question
            topic: Optional topic within the subject
            difficulty: Optional difficulty level
            
        Returns:
            A dummy question
        """
        # Set defaults if not provided
        if not difficulty:
            difficulty = random.choice(list(DifficultyLevel))
        
        if not topic:
            # Generate a topic based on the subject
            topics = {
                SubjectEnum.BIOLOGY: ["Cell Biology", "Genetics", "Human Physiology", "Ecology"],
                SubjectEnum.CHEMISTRY: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
                SubjectEnum.PHYSICS: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics"],
                SubjectEnum.ENGLISH: ["Grammar", "Vocabulary", "Comprehension"],
                SubjectEnum.LOGICAL_REASONING: ["Analytical Reasoning", "Critical Thinking"]
            }
            topic = random.choice(topics.get(subject, [f"{subject.value} Topic"]))
        
        # Choose a question type
        question_type = random.choice([QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE])
        
        # Generate content based on subject and topic
        content = f"Sample {difficulty.value} {subject.value} question about {topic}?"
        
        # Generate options
        options = []
        if question_type == QuestionType.MULTIPLE_CHOICE:
            # Create 4 options with one correct answer
            for i in range(4):
                is_correct = (i == 0)  # First option is correct
                options.append(QuestionOption(
                    content=f"Option {i+1}" + (" (Correct)" if is_correct else ""),
                    is_correct=is_correct
                ))
        else:  # TRUE_FALSE
            options = [
                QuestionOption(content="True", is_correct=True),
                QuestionOption(content="False", is_correct=False)
            ]
        
        # Generate an explanation
        explanation = f"Explanation for the {subject.value} question about {topic}."
        
        # Create and return the question
        now = datetime.utcnow()
        return QuestionResponse(
            id=None,  # Will be set when saved to the database
            subject=subject,
            topic=topic,
            difficulty=difficulty,
            question_type=question_type,
            content=content,
            options=options,
            explanation=explanation,
            created_at=now,
            updated_at=now
        )