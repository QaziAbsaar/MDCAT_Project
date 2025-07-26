import sqlite3
import os
from pathlib import Path
from typing import Dict, List, Any, Optional


class SQLiteDB:
    """SQLite database manager for the application."""
    
    def __init__(self, db_path: Optional[str] = None):
        """Initialize the SQLite database connection.
        
        Args:
            db_path: Path to the SQLite database file. If None, a default path will be used.
        """
        if db_path is None:
            # Default to a 'data.db' file in the same directory as this file
            db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.db")
        
        self.db_path = db_path
        self.conn = None
        self.cursor = None
    
    def connect(self):
        """Connect to the SQLite database."""
        # Ensure the directory exists
        Path(os.path.dirname(self.db_path)).mkdir(parents=True, exist_ok=True)
        
        self.conn = sqlite3.connect(self.db_path)
        # Enable foreign keys
        self.conn.execute("PRAGMA foreign_keys = ON")
        # Return rows as dictionaries
        self.conn.row_factory = sqlite3.Row
        self.cursor = self.conn.cursor()
    
    def disconnect(self):
        """Disconnect from the SQLite database."""
        if self.conn:
            self.conn.close()
            self.conn = None
            self.cursor = None
    
    def execute(self, query: str, params: tuple = ()):
        """Execute a SQL query.
        
        Args:
            query: SQL query to execute
            params: Parameters for the query
            
        Returns:
            The cursor object
        """
        if not self.conn:
            self.connect()
        
        return self.cursor.execute(query, params)
    
    def fetch_one(self, query: str, params: tuple = ()) -> Optional[Dict[str, Any]]:
        """Fetch a single row from the database.
        
        Args:
            query: SQL query to execute
            params: Parameters for the query
            
        Returns:
            A dictionary representing the row, or None if no row was found
        """
        self.execute(query, params)
        row = self.cursor.fetchone()
        
        if row:
            return dict(row)
        return None
    
    def fetch_all(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        """Fetch all rows from the database.
        
        Args:
            query: SQL query to execute
            params: Parameters for the query
            
        Returns:
            A list of dictionaries representing the rows
        """
        self.execute(query, params)
        rows = self.cursor.fetchall()
        
        return [dict(row) for row in rows]
    
    def insert(self, table: str, data: Dict[str, Any]) -> int:
        """Insert a row into the database.
        
        Args:
            table: Table name
            data: Dictionary of column names and values
            
        Returns:
            The ID of the inserted row
        """
        columns = ", ".join(data.keys())
        placeholders = ", ".join(["?" for _ in data])
        query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
        
        self.execute(query, tuple(data.values()))
        self.conn.commit()
        
        return self.cursor.lastrowid
    
    def update(self, table: str, data: Dict[str, Any], condition: str, params: tuple = ()) -> int:
        """Update rows in the database.
        
        Args:
            table: Table name
            data: Dictionary of column names and values to update
            condition: WHERE condition
            params: Parameters for the condition
            
        Returns:
            The number of rows affected
        """
        set_clause = ", ".join([f"{column} = ?" for column in data.keys()])
        query = f"UPDATE {table} SET {set_clause} WHERE {condition}"
        
        self.execute(query, tuple(data.values()) + params)
        self.conn.commit()
        
        return self.cursor.rowcount
    
    def delete(self, table: str, condition: str, params: tuple = ()) -> int:
        """Delete rows from the database.
        
        Args:
            table: Table name
            condition: WHERE condition
            params: Parameters for the condition
            
        Returns:
            The number of rows affected
        """
        query = f"DELETE FROM {table} WHERE {condition}"
        
        self.execute(query, params)
        self.conn.commit()
        
        return self.cursor.rowcount
    
    def create_tables(self):
        """Create the database tables if they don't exist."""
        # Users table
        self.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            full_name TEXT,
            is_active BOOLEAN NOT NULL DEFAULT 1,
            is_verified BOOLEAN NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL
        )
        """)
        
        # Progress tracking tables
        self._create_progress_tables()
        
        # Questions tables
        self._create_questions_tables()
        
        # Add more tables as needed
        
        self.conn.commit()
        
    def _create_progress_tables(self):
        """Create the progress tracking tables if they don't exist."""
        # User progress table
        self.execute("""
        CREATE TABLE IF NOT EXISTS user_progress (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            overall_score REAL DEFAULT 0.0,
            total_study_time_minutes INTEGER DEFAULT 0,
            questions_attempted INTEGER DEFAULT 0,
            questions_correct INTEGER DEFAULT 0,
            performance_level TEXT DEFAULT 'needs_improvement',
            streak_days INTEGER DEFAULT 0,
            last_activity TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        """)
        
        # Subject progress table
        self.execute("""
        CREATE TABLE IF NOT EXISTS subject_progress (
            id TEXT PRIMARY KEY,
            user_progress_id TEXT NOT NULL,
            subject TEXT NOT NULL,
            status TEXT DEFAULT 'not_started',
            overall_score REAL DEFAULT 0.0,
            questions_attempted INTEGER DEFAULT 0,
            questions_correct INTEGER DEFAULT 0,
            performance_level TEXT DEFAULT 'needs_improvement',
            study_time_minutes INTEGER DEFAULT 0,
            last_activity TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_progress_id) REFERENCES user_progress(id) ON DELETE CASCADE
        )
        """)
        
        # Topic progress table
        self.execute("""
        CREATE TABLE IF NOT EXISTS topic_progress (
            id TEXT PRIMARY KEY,
            subject_progress_id TEXT NOT NULL,
            topic_name TEXT NOT NULL,
            status TEXT DEFAULT 'not_started',
            questions_attempted INTEGER DEFAULT 0,
            questions_correct INTEGER DEFAULT 0,
            performance_level TEXT DEFAULT 'needs_improvement',
            last_activity TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subject_progress_id) REFERENCES subject_progress(id) ON DELETE CASCADE
        )
        """)
        
        # Study sessions table
        self.execute("""
        CREATE TABLE IF NOT EXISTS study_sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            subject TEXT NOT NULL,
            topic TEXT,
            start_time TIMESTAMP NOT NULL,
            end_time TIMESTAMP,
            duration_minutes INTEGER,
            questions_attempted INTEGER DEFAULT 0,
            questions_correct INTEGER DEFAULT 0,
            score REAL DEFAULT 0.0,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        """)
        
        # Study plans table
        self.execute("""
        CREATE TABLE IF NOT EXISTS study_plans (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            start_date TIMESTAMP NOT NULL,
            end_date TIMESTAMP NOT NULL,
            daily_goal_minutes INTEGER DEFAULT 60,
            weekly_goal_minutes INTEGER DEFAULT 420,
            status TEXT DEFAULT 'not_started',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        """)
        
        # Study plan subjects junction table
        self.execute("""
        CREATE TABLE IF NOT EXISTS study_plan_subjects (
            id TEXT PRIMARY KEY,
            study_plan_id TEXT NOT NULL,
            subject TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (study_plan_id) REFERENCES study_plans(id) ON DELETE CASCADE
        )
        """)
        
        # Performance metrics table
        self.execute("""
        CREATE TABLE IF NOT EXISTS performance_metrics (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            metric_type TEXT NOT NULL,
            subject TEXT,
            topic TEXT,
            value REAL NOT NULL,
            timestamp TIMESTAMP NOT NULL,
            metadata TEXT, -- JSON string for additional metadata
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        """)
        
        # Create indexes for performance
        self.execute("CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id)")
        self.execute("CREATE INDEX IF NOT EXISTS idx_subject_progress_user_progress_id ON subject_progress(user_progress_id)")
        self.execute("CREATE INDEX IF NOT EXISTS idx_topic_progress_subject_progress_id ON topic_progress(subject_progress_id)")
        self.execute("CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id)")
        self.execute("CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON study_plans(user_id)")
        self.execute("CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON performance_metrics(user_id)")
        self.execute("CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp)")
        
        self.conn.commit()
        
    def _create_questions_tables(self):
        """Create the questions tables if they don't exist."""
        # Questions table
        self.execute("""
        CREATE TABLE IF NOT EXISTS questions (
            id TEXT PRIMARY KEY,
            content TEXT NOT NULL,
            subject TEXT NOT NULL,
            topic TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            question_type TEXT NOT NULL,
            explanation TEXT,
            metadata TEXT,  -- JSON string for additional metadata
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by TEXT NOT NULL DEFAULT 'system',
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET DEFAULT
        )
        """)
        
        # Question options table
        self.execute("""
        CREATE TABLE IF NOT EXISTS question_options (
            id TEXT PRIMARY KEY,
            question_id TEXT NOT NULL,
            content TEXT NOT NULL,
            is_correct BOOLEAN NOT NULL DEFAULT 0,
            option_index INTEGER NOT NULL,  -- To maintain order of options
            FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
        )
        """)
        
        # User answers table
        self.execute("""
        CREATE TABLE IF NOT EXISTS user_answers (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            question_id TEXT NOT NULL,
            selected_option_id TEXT,  -- NULL for non-multiple choice questions
            text_answer TEXT,  -- For short/long answer questions
            is_correct BOOLEAN NOT NULL,
            time_taken_seconds REAL,  -- How long it took to answer
            answered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
            FOREIGN KEY (selected_option_id) REFERENCES question_options(id) ON DELETE SET NULL
        )
        """)
        
        # Create indexes for performance
        self.execute("CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject)")
        self.execute("CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic)")
        self.execute("CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty)")
        self.execute("CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(question_type)")
        self.execute("CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id)")
        self.execute("CREATE INDEX IF NOT EXISTS idx_user_answers_user_id ON user_answers(user_id)")
        self.execute("CREATE INDEX IF NOT EXISTS idx_user_answers_question_id ON user_answers(question_id)")
        self.execute("CREATE INDEX IF NOT EXISTS idx_user_answers_correctness ON user_answers(is_correct)")
        
        self.conn.commit()


# Global database instance
_db_instance = None

def get_db() -> SQLiteDB:
    """Get the global database instance for dependency injection."""
    global _db_instance
    if _db_instance is None:
        _db_instance = SQLiteDB()
        _db_instance.connect()
        _db_instance.create_tables()
    return _db_instance