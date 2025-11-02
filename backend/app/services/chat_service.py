from typing import List, Dict, Any
import logging
from groq import Groq
from app.core.config import settings
from app.services.vector_service import vector_service

logger = logging.getLogger(__name__)


class ChatService:
    def __init__(self):
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = "llama-3.3-70b-versatile"
        self.conversation_history = {}
    
    def _get_system_prompt(self) -> str:
        """Get system prompt for the chatbot."""
        return """You are an intelligent assistant for a Masters Abroad Platform. 
Your role is to help students find information about graduate programs, scholarships, 
and study abroad opportunities.

Guidelines:
- Be friendly, helpful, and informative
- Use the provided context to answer questions accurately
- If you don't have enough information, say so honestly
- Provide specific details about programs, requirements, fees, and deadlines
- Help students make informed decisions about their education

Always format your responses clearly and concisely."""
    
    def _retrieve_context(self, query: str, limit: int = 3) -> str:
        """Retrieve relevant context from vector database."""
        try:
            results = vector_service.search(query, limit=limit)
            
            if not results:
                return "No relevant information found in the database."
            
            context_parts = []
            for i, result in enumerate(results, 1):
                payload = result['payload']
                
                if payload['type'] == 'program':
                    context_parts.append(
                        f"\n{i}. PROGRAM:\n{payload['text']}"
                    )
                elif payload['type'] == 'scholarship':
                    context_parts.append(
                        f"\n{i}. SCHOLARSHIP:\n{payload['text']}"
                    )
            
            return "\n".join(context_parts)
        
        except Exception as e:
            logger.error(f"Error retrieving context: {e}")
            return "Unable to retrieve information from database."
    
    def chat(
        self, 
        user_id: int, 
        message: str, 
        session_id: str = "default"
    ) -> Dict[str, Any]:
        """Process chat message and return response."""
        try:
            # Retrieve relevant context
            context = self._retrieve_context(message)
            
            # Get or create conversation history
            history_key = f"{user_id}_{session_id}"
            if history_key not in self.conversation_history:
                self.conversation_history[history_key] = []
            
            history = self.conversation_history[history_key]
            
            # Build messages for LLM
            messages = [
                {"role": "system", "content": self._get_system_prompt()},
            ]
            
            # Add conversation history (last 5 messages)
            messages.extend(history[-10:])
            
            # Add current message with context
            messages.append({
                "role": "user",
                "content": f"""Context from database:
{context}

User Question: {message}

Please answer the question based on the context provided. If the context doesn't contain 
relevant information, you can provide general guidance about studying abroad."""
            })
            
            # Get response from LLM
            response = self.groq_client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=1000,
            )
            
            assistant_message = response.choices[0].message.content
            
            # Update conversation history
            history.append({"role": "user", "content": message})
            history.append({"role": "assistant", "content": assistant_message})
            
            # Keep only last 10 messages in history
            if len(history) > 10:
                self.conversation_history[history_key] = history[-10:]
            
            return {
                "response": assistant_message,
                "sources_count": len(vector_service.search(message, limit=3))
            }
        
        except Exception as e:
            logger.error(f"Error in chat: {e}")
            return {
                "response": "I apologize, but I'm having trouble processing your request. Please try again.",
                "sources_count": 0
            }
    
    def clear_history(self, user_id: int, session_id: str = "default"):
        """Clear conversation history for a user session."""
        history_key = f"{user_id}_{session_id}"
        if history_key in self.conversation_history:
            del self.conversation_history[history_key]


# Singleton instance
chat_service = ChatService()
