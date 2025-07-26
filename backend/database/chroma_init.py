import os
import chromadb
from chromadb.config import Settings
from typing import List, Dict

def initialize_chroma_collection(collection_name: str):
    """
    Initialize a ChromaDB collection with the given name.
    
    Args:
        collection_name: The name of the collection to initialize.
        
    Returns:
        A tuple containing the ChromaDB client and the collection object.
    """
    # Get the ChromaDB path from environment or use default
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from config import load_config
    config = load_config()
    chroma_db_path = config.get("CHROMA_DB_PATH")
    
    # Create a persistent client
    client = chromadb.PersistentClient(path=chroma_db_path)
    
    # Get or create collection
    try:
        collection = client.get_collection(name=collection_name)
        print(f"Collection '{collection_name}' already exists. Using existing collection.")
    except ValueError:
        collection = client.create_collection(name=collection_name)
        print(f"Created new collection: '{collection_name}'")
    
    return client, collection

def add_documents_to_collection(collection, documents: List[str], metadatas: List[Dict], ids: List[str]):
    """
    Add documents to a ChromaDB collection.
    
    Args:
        collection: The ChromaDB collection to add documents to.
        documents: List of document texts to add.
        metadatas: List of metadata dictionaries for each document.
        ids: List of unique IDs for each document.
        
    Returns:
        None
    """
    # Validate input lengths
    if not (len(documents) == len(metadatas) == len(ids)):
        raise ValueError("The length of documents, metadatas, and ids must be the same.")
    
    # Add documents to collection
    collection.add(
        documents=documents,
        metadatas=metadatas,
        ids=ids
    )
    
    print(f"Added {len(documents)} documents to collection.")