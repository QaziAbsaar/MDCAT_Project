import uuid
import json
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any, Union

from database.sqlite import SQLiteDB
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


class ProgressService:
    """Service for managing user progress data."""
    
    def __init__(self, db: SQLiteDB):
        """Initialize the progress service with a database connection.
        
        Args:
            db: SQLite database connection
        """
        self.db = db
    
    # User Progress Methods
    
    def get_user_progress(self, user_id: str) -> Optional[UserProgress]:
        """Get a user's progress data.
        
        Args:
            user_id: The ID of the user
            
        Returns:
            The user's progress data, or None if not found
        """
        # Get the user progress record
        user_progress_record = self.db.fetch_one(
            "SELECT * FROM user_progress WHERE user_id = ?",
            (user_id,)
        )
        
        if not user_progress_record:
            return None
        
        # Get all subject progress records for this user
        subject_progress_records = self.db.fetch_all(
            "SELECT * FROM subject_progress WHERE user_progress_id = ?",
            (user_progress_record['id'],)
        )
        
        # Build the subjects dictionary
        subjects = {}
        for subject_record in subject_progress_records:
            # Get all topic progress records for this subject
            topic_progress_records = self.db.fetch_all(
                "SELECT * FROM topic_progress WHERE subject_progress_id = ?",
                (subject_record['id'],)
            )
            
            # Build the topics dictionary
            topics = {}
            for topic_record in topic_progress_records:
                topics[topic_record['topic_name']] = TopicProgress(
                    topic_name=topic_record['topic_name'],
                    status=ProgressStatus(topic_record['status']),
                    questions_attempted=topic_record['questions_attempted'],
                    questions_correct=topic_record['questions_correct'],
                    performance_level=PerformanceLevel(topic_record['performance_level']),
                    last_activity=topic_record['last_activity']
                )
            
            # Create the subject progress object
            subjects[subject_record['subject']] = SubjectProgress(
                subject=SubjectEnum(subject_record['subject']),
                status=ProgressStatus(subject_record['status']),
                topics=topics,
                overall_score=subject_record['overall_score'],
                questions_attempted=subject_record['questions_attempted'],
                questions_correct=subject_record['questions_correct'],
                performance_level=PerformanceLevel(subject_record['performance_level']),
                study_time_minutes=subject_record['study_time_minutes'],
                last_activity=subject_record['last_activity']
            )
        
        # Create and return the user progress object
        return UserProgress(
            user_id=user_id,
            subjects=subjects,
            overall_score=user_progress_record['overall_score'],
            total_study_time_minutes=user_progress_record['total_study_time_minutes'],
            questions_attempted=user_progress_record['questions_attempted'],
            questions_correct=user_progress_record['questions_correct'],
            performance_level=PerformanceLevel(user_progress_record['performance_level']),
            streak_days=user_progress_record['streak_days'],
            last_activity=user_progress_record['last_activity'],
            created_at=user_progress_record['created_at'],
            updated_at=user_progress_record['updated_at']
        )
    
    def create_or_update_user_progress(self, user_progress: UserProgress) -> str:
        """Create or update a user's progress data.
        
        Args:
            user_progress: The user progress data to save
            
        Returns:
            The ID of the user progress record
        """
        now = datetime.utcnow()
        
        # Check if the user progress record exists
        existing_record = self.db.fetch_one(
            "SELECT id FROM user_progress WHERE user_id = ?",
            (user_progress.user_id,)
        )
        
        if existing_record:
            # Update existing record
            progress_id = existing_record['id']
            self.db.update(
                "user_progress",
                {
                    "overall_score": user_progress.overall_score,
                    "total_study_time_minutes": user_progress.total_study_time_minutes,
                    "questions_attempted": user_progress.questions_attempted,
                    "questions_correct": user_progress.questions_correct,
                    "performance_level": user_progress.performance_level,
                    "streak_days": user_progress.streak_days,
                    "last_activity": user_progress.last_activity,
                    "updated_at": now
                },
                "id = ?",
                (progress_id,)
            )
        else:
            # Create new record
            progress_id = str(uuid.uuid4())
            self.db.insert(
                "user_progress",
                {
                    "id": progress_id,
                    "user_id": user_progress.user_id,
                    "overall_score": user_progress.overall_score,
                    "total_study_time_minutes": user_progress.total_study_time_minutes,
                    "questions_attempted": user_progress.questions_attempted,
                    "questions_correct": user_progress.questions_correct,
                    "performance_level": user_progress.performance_level,
                    "streak_days": user_progress.streak_days,
                    "last_activity": user_progress.last_activity,
                    "created_at": now,
                    "updated_at": now
                }
            )
        
        # Update or create subject progress records
        for subject_key, subject_progress in user_progress.subjects.items():
            self._create_or_update_subject_progress(progress_id, subject_progress)
        
        return progress_id
    
    def _create_or_update_subject_progress(self, user_progress_id: str, subject_progress: SubjectProgress) -> str:
        """Create or update a subject progress record.
        
        Args:
            user_progress_id: The ID of the user progress record
            subject_progress: The subject progress data to save
            
        Returns:
            The ID of the subject progress record
        """
        now = datetime.utcnow()
        
        # Check if the subject progress record exists
        existing_record = self.db.fetch_one(
            "SELECT id FROM subject_progress WHERE user_progress_id = ? AND subject = ?",
            (user_progress_id, subject_progress.subject.value)
        )
        
        if existing_record:
            # Update existing record
            subject_id = existing_record['id']
            self.db.update(
                "subject_progress",
                {
                    "status": subject_progress.status,
                    "overall_score": subject_progress.overall_score,
                    "questions_attempted": subject_progress.questions_attempted,
                    "questions_correct": subject_progress.questions_correct,
                    "performance_level": subject_progress.performance_level,
                    "study_time_minutes": subject_progress.study_time_minutes,
                    "last_activity": subject_progress.last_activity,
                    "updated_at": now
                },
                "id = ?",
                (subject_id,)
            )
        else:
            # Create new record
            subject_id = str(uuid.uuid4())
            self.db.insert(
                "subject_progress",
                {
                    "id": subject_id,
                    "user_progress_id": user_progress_id,
                    "subject": subject_progress.subject.value,
                    "status": subject_progress.status,
                    "overall_score": subject_progress.overall_score,
                    "questions_attempted": subject_progress.questions_attempted,
                    "questions_correct": subject_progress.questions_correct,
                    "performance_level": subject_progress.performance_level,
                    "study_time_minutes": subject_progress.study_time_minutes,
                    "last_activity": subject_progress.last_activity,
                    "created_at": now,
                    "updated_at": now
                }
            )
        
        # Update or create topic progress records
        for topic_name, topic_progress in subject_progress.topics.items():
            self._create_or_update_topic_progress(subject_id, topic_progress)
        
        return subject_id
    
    def _create_or_update_topic_progress(self, subject_progress_id: str, topic_progress: TopicProgress) -> str:
        """Create or update a topic progress record.
        
        Args:
            subject_progress_id: The ID of the subject progress record
            topic_progress: The topic progress data to save
            
        Returns:
            The ID of the topic progress record
        """
        now = datetime.utcnow()
        
        # Check if the topic progress record exists
        existing_record = self.db.fetch_one(
            "SELECT id FROM topic_progress WHERE subject_progress_id = ? AND topic_name = ?",
            (subject_progress_id, topic_progress.topic_name)
        )
        
        if existing_record:
            # Update existing record
            topic_id = existing_record['id']
            self.db.update(
                "topic_progress",
                {
                    "status": topic_progress.status,
                    "questions_attempted": topic_progress.questions_attempted,
                    "questions_correct": topic_progress.questions_correct,
                    "performance_level": topic_progress.performance_level,
                    "last_activity": topic_progress.last_activity,
                    "updated_at": now
                },
                "id = ?",
                (topic_id,)
            )
        else:
            # Create new record
            topic_id = str(uuid.uuid4())
            self.db.insert(
                "topic_progress",
                {
                    "id": topic_id,
                    "subject_progress_id": subject_progress_id,
                    "topic_name": topic_progress.topic_name,
                    "status": topic_progress.status,
                    "questions_attempted": topic_progress.questions_attempted,
                    "questions_correct": topic_progress.questions_correct,
                    "performance_level": topic_progress.performance_level,
                    "last_activity": topic_progress.last_activity,
                    "created_at": now,
                    "updated_at": now
                }
            )
        
        return topic_id
    
    # Study Session Methods
    
    def create_study_session(self, session: StudySession) -> str:
        """Create a new study session.
        
        Args:
            session: The study session data to save
            
        Returns:
            The ID of the created study session
        """
        session_id = session.id or str(uuid.uuid4())
        
        self.db.insert(
            "study_sessions",
            {
                "id": session_id,
                "user_id": session.user_id,
                "subject": session.subject.value,
                "topic": session.topic,
                "start_time": session.start_time,
                "end_time": session.end_time,
                "duration_minutes": session.duration_minutes,
                "questions_attempted": session.questions_attempted,
                "questions_correct": session.questions_correct,
                "score": session.score,
                "notes": session.notes
            }
        )
        
        # Update user progress based on this session
        self._update_progress_from_session(session)
        
        return session_id
    
    def get_study_sessions(self, user_id: str, subject: Optional[SubjectEnum] = None,
                          start_date: Optional[datetime] = None, end_date: Optional[datetime] = None,
                          limit: int = 10) -> List[StudySession]:
        """Get a user's study sessions, optionally filtered.
        
        Args:
            user_id: The ID of the user
            subject: Optional subject filter
            start_date: Optional start date filter
            end_date: Optional end date filter
            limit: Maximum number of sessions to return
            
        Returns:
            A list of study sessions
        """
        query = "SELECT * FROM study_sessions WHERE user_id = ?"
        params = [user_id]
        
        if subject:
            query += " AND subject = ?"
            params.append(subject.value)
        
        if start_date:
            query += " AND start_time >= ?"
            params.append(start_date)
        
        if end_date:
            query += " AND start_time <= ?"
            params.append(end_date)
        
        query += " ORDER BY start_time DESC LIMIT ?"
        params.append(limit)
        
        session_records = self.db.fetch_all(query, tuple(params))
        
        sessions = []
        for record in session_records:
            sessions.append(StudySession(
                id=record['id'],
                user_id=record['user_id'],
                subject=SubjectEnum(record['subject']),
                topic=record['topic'],
                start_time=record['start_time'],
                end_time=record['end_time'],
                duration_minutes=record['duration_minutes'],
                questions_attempted=record['questions_attempted'],
                questions_correct=record['questions_correct'],
                score=record['score'],
                notes=record['notes']
            ))
        
        return sessions
    
    def _update_progress_from_session(self, session: StudySession) -> None:
        """Update user progress based on a study session.
        
        Args:
            session: The study session
        """
        # Get current user progress
        user_progress = self.get_user_progress(session.user_id)
        
        if not user_progress:
            # Create new user progress if it doesn't exist
            now = datetime.utcnow()
            user_progress = UserProgress(
                user_id=session.user_id,
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
        
        # Update user progress
        user_progress.total_study_time_minutes += session.duration_minutes or 0
        user_progress.questions_attempted += session.questions_attempted
        user_progress.questions_correct += session.questions_correct
        user_progress.last_activity = session.start_time
        
        # Calculate overall score
        if user_progress.questions_attempted > 0:
            user_progress.overall_score = (user_progress.questions_correct / user_progress.questions_attempted) * 100
        
        # Update performance level
        user_progress.performance_level = self._calculate_performance_level(user_progress.overall_score)
        
        # Update streak days (simplified logic - in a real app, this would be more complex)
        if user_progress.last_activity and (datetime.utcnow() - user_progress.last_activity).days <= 1:
            user_progress.streak_days += 1
        
        # Update subject progress
        subject_key = session.subject.value
        if subject_key not in user_progress.subjects:
            user_progress.subjects[subject_key] = SubjectProgress(
                subject=session.subject,
                status=ProgressStatus.IN_PROGRESS,
                topics={},
                overall_score=0.0,
                questions_attempted=0,
                questions_correct=0,
                performance_level=PerformanceLevel.NEEDS_IMPROVEMENT,
                study_time_minutes=0,
                last_activity=session.start_time
            )
        
        subject_progress = user_progress.subjects[subject_key]
        subject_progress.study_time_minutes += session.duration_minutes or 0
        subject_progress.questions_attempted += session.questions_attempted
        subject_progress.questions_correct += session.questions_correct
        subject_progress.last_activity = session.start_time
        subject_progress.status = ProgressStatus.IN_PROGRESS
        
        # Calculate subject score
        if subject_progress.questions_attempted > 0:
            subject_progress.overall_score = (subject_progress.questions_correct / subject_progress.questions_attempted) * 100
        
        # Update subject performance level
        subject_progress.performance_level = self._calculate_performance_level(subject_progress.overall_score)
        
        # Update topic progress if a topic is specified
        if session.topic:
            if session.topic not in subject_progress.topics:
                subject_progress.topics[session.topic] = TopicProgress(
                    topic_name=session.topic,
                    status=ProgressStatus.IN_PROGRESS,
                    questions_attempted=0,
                    questions_correct=0,
                    performance_level=PerformanceLevel.NEEDS_IMPROVEMENT,
                    last_activity=session.start_time
                )
            
            topic_progress = subject_progress.topics[session.topic]
            topic_progress.questions_attempted += session.questions_attempted
            topic_progress.questions_correct += session.questions_correct
            topic_progress.last_activity = session.start_time
            topic_progress.status = ProgressStatus.IN_PROGRESS
            
            # Calculate topic score and performance level
            if topic_progress.questions_attempted > 0:
                topic_score = (topic_progress.questions_correct / topic_progress.questions_attempted) * 100
                topic_progress.performance_level = self._calculate_performance_level(topic_score)
        
        # Save the updated progress
        self.create_or_update_user_progress(user_progress)
    
    def _calculate_performance_level(self, score: float) -> PerformanceLevel:
        """Calculate the performance level based on a score.
        
        Args:
            score: The score (percentage)
            
        Returns:
            The performance level
        """
        if score >= 90:
            return PerformanceLevel.EXCELLENT
        elif score >= 75:
            return PerformanceLevel.GOOD
        elif score >= 60:
            return PerformanceLevel.SATISFACTORY
        else:
            return PerformanceLevel.NEEDS_IMPROVEMENT
    
    # Study Plan Methods
    
    def create_study_plan(self, plan: StudyPlan) -> str:
        """Create a new study plan.
        
        Args:
            plan: The study plan data to save
            
        Returns:
            The ID of the created study plan
        """
        plan_id = plan.id or str(uuid.uuid4())
        now = datetime.utcnow()
        
        self.db.insert(
            "study_plans",
            {
                "id": plan_id,
                "user_id": plan.user_id,
                "name": plan.name,
                "description": plan.description,
                "start_date": plan.start_date,
                "end_date": plan.end_date,
                "daily_goal_minutes": plan.daily_goal_minutes,
                "weekly_goal_minutes": plan.weekly_goal_minutes,
                "status": plan.status,
                "created_at": now,
                "updated_at": now
            }
        )
        
        # Save the subjects for this plan
        for subject in plan.subjects:
            self.db.insert(
                "study_plan_subjects",
                {
                    "id": str(uuid.uuid4()),
                    "study_plan_id": plan_id,
                    "subject": subject.value
                }
            )
        
        return plan_id
    
    def get_study_plans(self, user_id: str) -> List[StudyPlan]:
        """Get a user's study plans.
        
        Args:
            user_id: The ID of the user
            
        Returns:
            A list of study plans
        """
        plan_records = self.db.fetch_all(
            "SELECT * FROM study_plans WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,)
        )
        
        plans = []
        for record in plan_records:
            # Get the subjects for this plan
            subject_records = self.db.fetch_all(
                "SELECT subject FROM study_plan_subjects WHERE study_plan_id = ?",
                (record['id'],)
            )
            
            subjects = [SubjectEnum(s['subject']) for s in subject_records]
            
            plans.append(StudyPlan(
                id=record['id'],
                user_id=record['user_id'],
                name=record['name'],
                description=record['description'],
                start_date=record['start_date'],
                end_date=record['end_date'],
                subjects=subjects,
                daily_goal_minutes=record['daily_goal_minutes'],
                weekly_goal_minutes=record['weekly_goal_minutes'],
                created_at=record['created_at'],
                updated_at=record['updated_at'],
                status=ProgressStatus(record['status'])
            ))
        
        return plans
    
    # Performance Metrics Methods
    
    def add_performance_metric(self, metric: PerformanceMetric) -> str:
        """Add a new performance metric.
        
        Args:
            metric: The performance metric to save
            
        Returns:
            The ID of the created metric
        """
        metric_id = str(uuid.uuid4())
        
        # Convert metadata to JSON string if present
        metadata_json = None
        if metric.metadata:
            metadata_json = json.dumps(metric.metadata)
        
        self.db.insert(
            "performance_metrics",
            {
                "id": metric_id,
                "user_id": metric.user_id,
                "metric_type": metric.metric_type,
                "subject": metric.subject.value if metric.subject else None,
                "topic": metric.topic,
                "value": metric.value,
                "timestamp": metric.timestamp,
                "metadata": metadata_json
            }
        )
        
        return metric_id
    
    def get_performance_metrics(self, user_id: str, metric_type: Optional[str] = None,
                              subject: Optional[SubjectEnum] = None, days: int = 30) -> List[PerformanceMetric]:
        """Get a user's performance metrics, optionally filtered.
        
        Args:
            user_id: The ID of the user
            metric_type: Optional metric type filter
            subject: Optional subject filter
            days: Number of days to look back
            
        Returns:
            A list of performance metrics
        """
        query = "SELECT * FROM performance_metrics WHERE user_id = ?"
        params = [user_id]
        
        if metric_type:
            query += " AND metric_type = ?"
            params.append(metric_type)
        
        if subject:
            query += " AND subject = ?"
            params.append(subject.value)
        
        # Filter by date range
        start_date = datetime.utcnow() - timedelta(days=days)
        query += " AND timestamp >= ?"
        params.append(start_date)
        
        query += " ORDER BY timestamp DESC"
        
        metric_records = self.db.fetch_all(query, tuple(params))
        
        metrics = []
        for record in metric_records:
            # Parse metadata JSON if present
            metadata = None
            if record['metadata']:
                try:
                    metadata = json.loads(record['metadata'])
                except json.JSONDecodeError:
                    pass
            
            metrics.append(PerformanceMetric(
                user_id=record['user_id'],
                metric_type=record['metric_type'],
                subject=SubjectEnum(record['subject']) if record['subject'] else None,
                topic=record['topic'],
                value=record['value'],
                timestamp=record['timestamp'],
                metadata=metadata
            ))
        
        return metrics