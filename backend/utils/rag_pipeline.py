from typing import List, Dict, Any, Optional
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document
from langchain.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate
from langchain_community.llms import OpenAI

from config import load_config


class RAGPipeline:
    """Retrieval-Augmented Generation (RAG) pipeline using LangChain."""
    
    def __init__(self, collection_name: str = "mdcat_docs"):
        """Initialize the RAG pipeline.
        
        Args:
            collection_name: Name of the ChromaDB collection to use.
        """
        try:
            # Load configuration
            self.config = load_config()
            
            # Initialize embeddings model
            self.embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
            
            # Initialize ChromaDB client and collection
            from database.chroma_init import initialize_chroma_collection
            self.chroma_client, self.collection = initialize_chroma_collection(collection_name)
            
            # Initialize vector store
            self.vectorstore = Chroma(
                collection_name=collection_name,
                embedding_function=self.embeddings,
                client=self.chroma_client
            )
            
            # Initialize text splitter for document processing
            self.text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len,
            )
            
            self.initialized = True
            print(f"RAG Pipeline initialized successfully with collection: {collection_name}")
            
        except Exception as e:
            print(f"Warning: RAG Pipeline initialization failed: {str(e)}")
            self.initialized = False
            self.embeddings = None
            self.vectorstore = None
            self.text_splitter = None
    
    def add_documents(self, documents: List[Document], metadatas: Optional[List[Dict[str, Any]]] = None) -> None:
        """Add documents to the vector store.
        
        Args:
            documents: List of LangChain Document objects to add.
            metadatas: Optional list of metadata dictionaries for each document.
        """
        if not self.initialized:
            raise RuntimeError("RAG Pipeline not initialized. Cannot add documents.")
            
        # Split documents into chunks
        splits = self.text_splitter.split_documents(documents)
        
        # Add to vector store
        self.vectorstore.add_documents(splits, metadatas=metadatas)
    
    def query(self, query: str, k: int = 5) -> List[Document]:
        """Query the vector store for relevant documents.
        
        Args:
            query: The query string.
            k: Number of documents to retrieve.
            
        Returns:
            List of relevant Document objects.
        """
        if not self.initialized:
            raise RuntimeError("RAG Pipeline not initialized. Cannot query documents.")
            
        retriever = self.vectorstore.as_retriever(search_kwargs={"k": k})
        return retriever.get_relevant_documents(query)
    
    def generate_answer(self, query: str, k: int = 5) -> Dict[str, Any]:
        """Generate an answer to a query using RAG.
        
        Args:
            query: The query string.
            k: Number of documents to retrieve.
            
        Returns:
            Dictionary containing the answer and source documents.
        """
        if not self.initialized:
            raise RuntimeError("RAG Pipeline not initialized. Cannot generate answers.")
            
        # Get relevant documents
        docs = self.query(query, k=k)
        
        # Create prompt template
        template = """
        You are an AI assistant for MDCAT (Medical and Dental College Admission Test) preparation.
        Use the following pieces of context to answer the question at the end.
        If you don't know the answer, just say that you don't know, don't try to make up an answer.
        
        Context:
        {context}
        
        Question: {question}
        
        Answer:
        """
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["context", "question"]
        )
        
        # Initialize LLM
        # Try to use Groq first, fall back to OpenAI if not available
        try:
            from langchain_groq import ChatGroq
            llm = ChatGroq(api_key=self.config.get("GROQ_API_KEY"), model_name="mixtral-8x7b-32768")
        except (ImportError, ValueError):
            # Fall back to OpenAI
            llm = OpenAI(api_key=self.config.get("OPENAI_API_KEY"))
        
        # Create QA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=self.vectorstore.as_retriever(search_kwargs={"k": k}),
            chain_type_kwargs={"prompt": prompt}
        )
        
        # Run the chain
        result = qa_chain({"query": query})
        
        # Return result and source documents
        return {
            "answer": result["result"],
            "source_documents": docs
        }