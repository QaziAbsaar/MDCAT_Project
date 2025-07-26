import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def load_config():
    """
    Load configuration from environment variables.
    
    Returns:
        A dictionary containing configuration values.
    """
    # Default path for ChromaDB
    default_chroma_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "chroma_db")
    
    config = {
        "GROQ_API_KEY": os.getenv("GROQ_API_KEY", ""),
        "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY", ""),
        "CHROMA_DB_PATH": os.getenv("CHROMA_DB_PATH", default_chroma_path),
    }
    
    return config