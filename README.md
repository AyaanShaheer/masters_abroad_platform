```markdown
# 🎓 Masters Abroad Platform

An intelligent AI-powered platform to help students find graduate programs, scholarships, and get personalized guidance for studying abroad using RAG (Retrieval Augmented Generation) chatbot technology.

![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)
![React](https://img.shields.io/badge/React-18.2+-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🤖 AI-Powered Features
- **RAG Chatbot** - Conversational AI assistant powered by LLaMA 3.3 (via Groq)
- **Semantic Search** - Vector-based search using Sentence Transformers
- **Intelligent Recommendations** - Coming soon!
- **Document Q&A** - Coming soon!

### 📚 Core Features
- **Program Discovery** - Browse 1000+ graduate programs worldwide
- **Scholarship Finder** - Search funding opportunities
- **Application Tracker** - Manage your applications
- **User Profiles** - Store academic credentials (GPA, GRE, TOEFL, etc.)
- **Advanced Filtering** - By country, field of study, university

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (User/Admin)
- Secure password hashing with bcrypt

---

## 🏗️ Tech Stack

### Backend
- **Framework:** FastAPI
- **Database:** PostgreSQL 16
- **ORM:** SQLAlchemy 2.0
- **Migration:** Alembic
- **Cache:** Redis
- **Vector DB:** Qdrant
- **AI/ML:**
  - Sentence Transformers (Embeddings)
  - Groq API (LLM - LLaMA 3.3)
  - LangChain (RAG Pipeline)

### Frontend
- **Framework:** React 18
- **UI Library:** Material-UI (MUI)
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** Context API

### DevOps (Coming Soon)
- Docker & Docker Compose
- Kubernetes
- GitHub Actions (CI/CD)
- AWS/GCP Deployment

---

## 📦 Project Structure

```
masters-abroad-platform/
├── backend/
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   ├── core/             # Config, security
│   │   ├── database/         # DB connection
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   └── services/         # Business logic
│   ├── alembic/              # DB migrations
│   ├── docker-compose.yml    # Docker services
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── context/          # React Context
│   │   └── App.js            # Main app
│   ├── package.json
│   └── .env
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 16 (via Docker)

### 1. Clone Repository

```
git clone https://github.com/AyaanShaheer/masters-abroad-platform.git
cd masters-abroad-platform
```

### 2. Backend Setup

```
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env and add:
# - DATABASE_URL
# - SECRET_KEY
# - GROQ_API_KEY (get from https://console.groq.com)

# Start Docker services (PostgreSQL, Redis, Qdrant)
docker-compose up -d

# Initialize database
python init_db.py

# Seed sample data
python seed_data.py

# Index knowledge base for RAG
python index_knowledge_base.py

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000
API Docs: http://localhost:8000/docs

### 3. Frontend Setup

```
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will be available at: http://localhost:3001

### 4. Test Login Credentials

```
Regular User:
Email: user@example.com
Password: user123

Admin:
Email: admin@example.com
Password: admin123
```

---

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Key Endpoints

**Authentication:**
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token

**Programs:**
- `GET /api/v1/programs/` - List all programs
- `GET /api/v1/programs/{id}` - Get program details

**Chat:**
- `POST /api/v1/chat/` - Send message to AI chatbot
- `DELETE /api/v1/chat/session` - Clear chat history

---

## 🤖 AI Features

### RAG Chatbot Architecture

```
User Query → Frontend
    ↓
Backend API
    ↓
Embedding (Sentence Transformers)
    ↓
Vector Search (Qdrant)
    ↓
Context Retrieval
    ↓
LLM (Groq - LLaMA 3.3)
    ↓
Response
```

### Example Queries
- "What programs are available in USA for Computer Science?"
- "Tell me about scholarships for international students"
- "What is the tuition fee for Stanford?"
- "Which universities offer AI programs in Canada?"

---

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://postgres:postgres123@127.0.0.1:5433/masters_abroad_db
REDIS_URL=redis://127.0.0.1:6379/0
SECRET_KEY=your-secret-key-min-32-chars
GROQ_API_KEY=your-groq-api-key
QDRANT_HOST=localhost
QDRANT_PORT=6333
```

### Docker Services

```
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

---

## 📊 Database Schema

### Main Tables
- **users** - User accounts and authentication
- **user_profiles** - Academic credentials (GPA, GRE, etc.)
- **programs** - Graduate programs
- **scholarships** - Funding opportunities
- **applications** - User applications to programs
- **chat_sessions** - Chat history (future)
- **chat_messages** - Individual messages (future)

---

## 🧪 Testing

### Test Vector Search
```
cd backend
python test_vector_search.py
```

### Test Chat API
```
# Via Swagger UI
http://localhost:8000/docs
# Test POST /api/v1/chat/
```

---

## 🛣️ Roadmap

### Phase 1: Core Platform ✅
- [x] Backend API (FastAPI)
- [x] Frontend UI (React)
- [x] Authentication & Authorization
- [x] CRUD Operations
- [x] Database Models

### Phase 2: AI Features (In Progress)
- [x] RAG Chatbot
- [x] Vector Search
- [ ] AI Recommendation System
- [ ] Document Q&A
- [ ] Program Matching Algorithm

### Phase 3: Advanced Features
- [ ] Admin Dashboard
- [ ] Email Notifications
- [ ] PDF Export
- [ ] Document Upload
- [ ] Analytics Dashboard

### Phase 4: DevOps & Deployment
- [ ] Docker Containerization
- [ ] Kubernetes Deployment
- [ ] CI/CD Pipeline
- [ ] AWS/GCP Deployment
- [ ] Monitoring & Logging

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

- Your Name - [@AyaanShaheer](https://github.com/AyaanShaheer)

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Qdrant](https://qdrant.tech/)
- [Groq](https://groq.com/)
- [Sentence Transformers](https://www.sbert.net/)

---

## 📧 Contact

Project Link: [https://github.com/AyaanShaheer/masters-abroad-platform](https://github.com/yourusername/masters-abroad-platform)

---

## 🌟 Star this repo if you found it helpful!
```
