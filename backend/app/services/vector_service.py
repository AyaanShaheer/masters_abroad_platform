from typing import List, Dict, Any
import logging
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer
from app.core.config import settings

logger = logging.getLogger(__name__)


class VectorService:
    def __init__(self):
        self.client = QdrantClient(
            host=settings.QDRANT_HOST,
            port=settings.QDRANT_PORT
        )
        # Use free local embedding model
        logger.info("Loading embedding model...")
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.embedding_dim = 384  # Dimension for all-MiniLM-L6-v2
        self.collection_name = settings.QDRANT_COLLECTION_NAME
        
        self._ensure_collection_exists()
    
    def _ensure_collection_exists(self):
        """Create collection if it doesn't exist."""
        try:
            collections = self.client.get_collections().collections
            if not any(c.name == self.collection_name for c in collections):
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=self.embedding_dim,
                        distance=Distance.COSINE
                    )
                )
                logger.info(f"Created collection: {self.collection_name}")
        except Exception as e:
            logger.error(f"Error creating collection: {e}")
    
    def create_embedding(self, text: str) -> List[float]:
        """Create embedding for text using local model."""
        try:
            embedding = self.embedding_model.encode(text, convert_to_tensor=False)
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Error creating embedding: {e}")
            raise
    
    def add_documents(self, documents: List[Dict[str, Any]]):
        """Add documents to vector database."""
        points = []
        for doc in documents:
            text = doc.get("text", "")
            embedding = self.create_embedding(text)
            
            point = PointStruct(
                id=doc["id"],
                vector=embedding,
                payload=doc
            )
            points.append(point)
        
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        logger.info(f"Added {len(points)} documents to vector database")
    
    def search(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search for similar documents."""
        query_embedding = self.create_embedding(query)
        
        search_results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=limit
        )
        
        results = []
        for result in search_results:
            results.append({
                "id": result.id,
                "score": result.score,
                "payload": result.payload
            })
        
        return results
    
    def delete_all(self):
        """Delete all documents from collection."""
        self.client.delete_collection(self.collection_name)
        self._ensure_collection_exists()


# Singleton instance
vector_service = VectorService()
