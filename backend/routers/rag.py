from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import tempfile
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain_core.documents import Document

from utils.rag_pipeline import RAGPipeline
from utils.auth import get_current_active_user
from models.user import User

# Create router
router = APIRouter(
    prefix="/rag",
    tags=["rag"],
    responses={401: {"description": "Unauthorized"}},
)

# Initialize RAG pipeline
rag_pipeline = RAGPipeline()


class QueryRequest(BaseModel):
    """Request model for querying the RAG system."""
    query: str
    k: Optional[int] = 5


class QueryResponse(BaseModel):
    """Response model for RAG queries."""
    answer: str
    sources: List[Dict[str, Any]]


@router.post("/query", response_model=QueryResponse)
async def query_rag(
    request: QueryRequest,
    current_user: User = Depends(get_current_active_user)
):
    """Query the RAG system with a question."""
    try:
        result = rag_pipeline.generate_answer(request.query, k=request.k)
        
        # Format source documents for response
        sources = [
            {
                "content": doc.page_content,
                "metadata": doc.metadata
            }
            for doc in result["source_documents"]
        ]
        
        return {
            "answer": result["answer"],
            "sources": sources
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating answer: {str(e)}"
        )


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """Upload a document to the RAG system."""
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            # Write the uploaded file content to the temporary file
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        # Process the file based on its type
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension == ".pdf":
            loader = PyPDFLoader(temp_path)
        elif file_extension in [".txt", ".md"]:
            loader = TextLoader(temp_path)
        else:
            # Clean up the temporary file
            os.unlink(temp_path)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type: {file_extension}"
            )
        
        # Load the document
        documents = loader.load()
        
        # Add metadata
        for doc in documents:
            doc.metadata["filename"] = file.filename
            doc.metadata["uploaded_by"] = current_user.username
        
        # Add to RAG pipeline
        rag_pipeline.add_documents(documents)
        
        # Clean up the temporary file
        os.unlink(temp_path)
        
        return {"message": f"Successfully uploaded and processed {file.filename}"}
    except Exception as e:
        # Ensure temporary file is cleaned up in case of error
        if 'temp_path' in locals():
            os.unlink(temp_path)
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing document: {str(e)}"
        )