# 🎓 Masters Abroad Platform

> 🌍 *An AI-powered assistant to help students discover graduate programs, scholarships, and get personalized study-abroad guidance — built with RAG (Retrieval-Augmented Generation) chatbot technology.*

---

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-teal?logo=fastapi)
![React](https://img.shields.io/badge/React-18.2+-blue?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## ✨ Overview

**Masters Abroad Platform** leverages AI and modern web technologies to simplify the process of finding universities, scholarships, and managing applications.  
It includes a **conversational RAG chatbot** powered by **LLaMA 3.3 (Groq)** and **semantic search** using **Sentence Transformers**.

---

## 🚀 Features

### 🤖 AI-Powered Capabilities
- 🧠 **RAG Chatbot** – Context-aware assistant built using LLaMA 3.3 (via Groq)
- 🔍 **Semantic Search** – Vector-based program and scholarship discovery
- 🎯 **Intelligent Recommendations** – *(Coming Soon)*
- 📄 **Document Q&A** – *(Coming Soon)*

### 📚 Core Platform Features
- 🌐 **Program Discovery** – Explore 1000+ graduate programs globally  
- 💰 **Scholarship Finder** – Find funding opportunities easily  
- 🗂️ **Application Tracker** – Manage and monitor your applications  
- 👤 **User Profiles** – Store GPA, GRE, TOEFL, and academic credentials  
- 🧭 **Advanced Filtering** – Filter by country, discipline, and university  

### 🔐 Security
- 🔑 JWT-based authentication  
- 👥 Role-based access control (User/Admin)  
- 🧂 Secure password hashing with bcrypt  

---

## 🏗️ Tech Stack

### ⚙️ Backend
- **Framework:** FastAPI  
- **Database:** PostgreSQL 16  
- **ORM:** SQLAlchemy 2.0  
- **Migrations:** Alembic  
- **Cache:** Redis  
- **Vector DB:** Qdrant  
- **AI/ML Stack:**  
  - Sentence Transformers (Embeddings)  
  - Groq API (LLM – LLaMA 3.3)  
  - LangChain (RAG Pipeline)

### 💻 Frontend
- **Framework:** React 18  
- **UI Library:** Material-UI (MUI)  
- **Routing:** React Router v6  
- **State Management:** React Context API  
- **HTTP Client:** Axios  

### ☁️ DevOps *(Coming Soon)*
- Docker & Docker Compose  
- Kubernetes  
- GitHub Actions (CI/CD)  
- AWS / GCP Deployment  

---

## 📂 Project Structure


masters-abroad-platform/
├── backend/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── core/             # Config, security, utilities
│   │   ├── database/         # DB connection
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   └── services/         # Business logic
│   ├── alembic/              # Database migrations
│   ├── docker-compose.yml
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI
│   │   ├── pages/            # Page components
│   │   ├── services/         # API clients
│   │   ├── context/          # Global state
│   │   └── App.js
│   ├── package.json
│   └── .env
└── README.md


---

## ⚡ Quick Start

### 🧩 Prerequisites
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 16 (via Docker)

---

### 🛠️ 1. Clone Repository
```bash
git clone https://github.com/AyaanShaheer/masters-abroad-platform.git
cd masters-abroad-platform
````

---

### 🧱 2. Backend Setup

cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with:
# DATABASE_URL, SECRET_KEY, GROQ_API_KEY, etc.

# Start Docker services
docker-compose up -d

# Initialize and seed database
python init_db.py
python seed_data.py

# Index knowledge base for RAG
python index_knowledge_base.py

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

> 🟢 Backend runs at **[http://localhost:8000](http://localhost:8000)**
> 📘 Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
> 📗 ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

### 💻 3. Frontend Setup

cd frontend
npm install
npm start


> 🟢 Frontend runs at **[http://localhost:3001](http://localhost:3001)**

---

### 🔑 4. Test Credentials


User:
  Email: user@example.com
  Password: user123

Admin:
  Email: admin@example.com
  Password: admin123


---

## 📚 API Reference

| Module       | Endpoint                      | Description             |
| ------------ | ----------------------------- | ----------------------- |
| **Auth**     | `POST /api/v1/auth/register`  | Register user           |
|              | `POST /api/v1/auth/login`     | Obtain JWT token        |
| **Programs** | `GET /api/v1/programs/`       | List programs           |
|              | `GET /api/v1/programs/{id}`   | Program details         |
| **Chatbot**  | `POST /api/v1/chat/`          | Send message to chatbot |
|              | `DELETE /api/v1/chat/session` | Clear chat history      |

---

## 🧠 RAG Chatbot Architecture


User Query → Frontend (React)
      ↓
Backend (FastAPI)
      ↓
Sentence Transformers → Embeddings
      ↓
Qdrant → Vector Search
      ↓
LangChain → Context Retrieval
      ↓
Groq API (LLaMA 3.3)
      ↓
AI Response → Frontend


### 💬 Example Queries

* “What programs are available in the USA for Computer Science?”
* “Tell me about scholarships for international students.”
* “Which universities offer AI programs in Canada?”

---

## ⚙️ Environment Variables

**Backend (.env):**

DATABASE_URL=postgresql://postgres:postgres123@127.0.0.1:5433/masters_abroad_db
REDIS_URL=redis://127.0.0.1:6379/0
SECRET_KEY=your-secret-key-min-32-chars
GROQ_API_KEY=your-groq-api-key
QDRANT_HOST=localhost
QDRANT_PORT=6333

---

## 🐳 Docker Commands

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Check container status
docker-compose ps

---

## 🧩 Database Schema

| Table             | Description              |
| ----------------- | ------------------------ |
| **users**         | Authentication & roles   |
| **user_profiles** | Academic credentials     |
| **programs**      | Graduate program data    |
| **scholarships**  | Scholarship information  |
| **applications**  | User applications        |
| **chat_sessions** | Chat history *(future)*  |
| **chat_messages** | Chat messages *(future)* |

---

## 🧪 Testing


# Test vector search
cd backend
python test_vector_search.py

# Test chat API
# Open Swagger UI → POST /api/v1/chat/

---

## 🛣️ Roadmap

### ✅ Phase 1 – Core Platform

* [x] Backend (FastAPI)
* [x] Frontend (React)
* [x] Authentication & CRUD
* [x] Database Integration

### 🚧 Phase 2 – AI Features *(In Progress)*

* [x] RAG Chatbot
* [x] Vector Search
* [ ] AI Recommendation System
* [ ] Document Q&A
* [ ] Program Matching Algorithm

### 🔜 Phase 3 – Advanced Features

* [ ] Admin Dashboard
* [ ] Email Notifications
* [ ] PDF Export
* [ ] Analytics Dashboard

### ☁️ Phase 4 – DevOps & Deployment

* [ ] Docker Containerization
* [ ] Kubernetes Deployment
* [ ] CI/CD Pipeline
* [ ] AWS/GCP Deployment
* [ ] Monitoring & Logging

---

## 🤝 Contributing

Contributions are always welcome!
To get started:

1. Fork the repository
2. Create a feature branch

   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit changes

   ```bash
   git commit -m "Add AmazingFeature"
   ```
4. Push and open a Pull Request

---

## 📝 License

Licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ayaan Shaheer**
🔗 [GitHub @AyaanShaheer](https://github.com/AyaanShaheer)

---

## 🙏 Acknowledgments

* [FastAPI](https://fastapi.tiangolo.com/)
* [React](https://react.dev/)
* [Material-UI](https://mui.com/)
* [Qdrant](https://qdrant.tech/)
* [Groq](https://groq.com/)
* [Sentence Transformers](https://www.sbert.net/)

---

## ⭐ Support

If you found this project helpful, please **star ⭐ the repository** to show your support!

[👉 View on GitHub](https://github.com/AyaanShaheer/masters-abroad-platform)


---

✅ **Highlights of improvements:**
- Added consistent emojis + color-coded badges  
- Simplified navigation & quick-start readability  
- Enhanced architecture diagram and tables  
- Improved contributor, roadmap, and testing sections  
- Ready-to-paste formatting — 100% GitHub-optimized  


