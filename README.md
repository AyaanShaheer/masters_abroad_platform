# 🎓 Masters Abroad Platform  
### *AI-Powered Graduate Admissions Companion | Cloud-Native | Production-Deployed*

> 🌍 **Discover programs. Generate winning SOPs. Track applications.**  
> An end-to-end **AI + MLOps-powered platform** that simplifies the global graduate school application journey — **fully deployed on Azure Kubernetes Service (AKS)** using production-grade DevOps and cloud-native architecture.

---

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-teal?logo=fastapi)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Kubernetes](https://img.shields.io/badge/Kubernetes-AKS-326CE5?logo=kubernetes)
![Azure](https://img.shields.io/badge/Azure-Cloud-0078D4?logo=microsoftazure)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 Why This Project Exists

Applying for graduate studies abroad is **complex, repetitive, and overwhelming**:
- Finding the *right* programs
- Writing compelling SOPs
- Managing deadlines and documents
- Navigating scholarships and eligibility

**Masters Abroad Platform** solves this with **AI-first design**, **cloud scalability**, and **real-world production deployment** — not just a demo, but a **full SaaS-grade system**.

---

## 🚀 Live System Overview

| Category | Details |
|-------|--------|
| ☁️ **Deployment** | Azure Kubernetes Service (AKS) |
| 🧠 **AI Stack** | OpenAI GPT-4 · Groq (LLaMA 3.3) · Anthropic Claude |
| 🏗️ **Architecture** | Microservices · Containerized · Cloud-native |
| 🔐 **Security** | JWT Auth · RBAC · Secrets Management |
| 📦 **MLOps** | Docker → ACR → AKS → Helm |
| 📊 **Persistence** | PostgreSQL with PVC-backed storage |

---

## ✨ Key Capabilities

### 🤖 AI-Driven Intelligence
- ✍️ **AI SOP Generator**
  - Personalized SOPs using academic + professional profile
  - Multi-LLM routing for quality vs speed optimization
- 📊 **SOP Analysis Engine**
  - Scores clarity, motivation, relevance, coherence, grammar
  - Real-time feedback & re-analysis
- 🌐 **Autonomous AI Agents**
  - CrewAI-powered web scraping & enrichment
  - Scholarship and program metadata automation
- 🎯 **Multi-LLM Orchestration**
  - Dynamic selection between GPT-4, Claude, and Groq

---

### 📚 Core Platform Features
- 🌍 **Program Discovery**
  - 1000+ global graduate programs
  - Advanced filters: country, field, degree, deadlines
- 💰 **Scholarship Explorer**
  - Eligibility-aware funding opportunities
- 🗂️ **Application Tracker**
  - Status, deadlines, submissions, progress
- 👤 **Academic Profile Management**
  - GPA, GRE, TOEFL, IELTS, work experience
- 📄 **Document Versioning**
  - SOP history, edits, and scoring evolution

---

### 🔐 Security & Reliability
- JWT-based authentication
- Role-based access (User / Admin)
- bcrypt password hashing
- Kubernetes Secrets & ConfigMaps
- Persistent Volumes for PostgreSQL
- Stateless backend services for scalability

---

## 🏗️ System Architecture

```

Frontend (React + MUI)
↓
FastAPI Gateway (JWT Auth)
↓
Business Services (Programs, SOPs, Profiles)
↓
AI Orchestration Layer (CrewAI + LLMs)
↓
PostgreSQL (PVC-backed, StatefulSet)

```

📦 **Everything runs inside Kubernetes**, managed via **Helm charts**.

---

## 🧰 Tech Stack

### ⚙️ Backend
- FastAPI (Python 3.12)
- SQLAlchemy 2.0 + Alembic
- PostgreSQL 16
- JWT Authentication
- RESTful APIs

### 🧠 AI / ML
- OpenAI GPT-4
- Groq (LLaMA 3.3)
- Anthropic Claude
- CrewAI agent workflows
- Prompt engineering + scoring heuristics

### 💻 Frontend
- React 18
- Material-UI v5
- React Router v6
- Axios with interceptors
- Context API

### ☁️ DevOps & Cloud
- Docker (multi-stage builds)
- Kubernetes (AKS)
- Helm 3
- Azure Container Registry
- Azure Managed Disks
- LoadBalancer & ClusterIP services

---

## 📂 Repository Structure

```

masters-abroad-platform/
├── backend/        # FastAPI + AI logic
├── frontend/       # React UI
├── helm/           # Helm charts (AKS-ready)
├── migrate-job.yaml
├── seed-job.yaml
└── README.md

````

Clean separation of **frontend, backend, infrastructure, and data ops**.

---

## ⚡ Quick Start (Local)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
````

📘 API Docs → `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm start
```

🟢 UI → `http://localhost:3000`

---

## ☁️ Production Deployment (AKS)

### Infrastructure

* Azure Resource Group
* Azure Container Registry
* Azure Kubernetes Service
* Helm-managed deployments

### Deployment Flow

```
Code → Docker → ACR → AKS → Helm → Live Service
```

### Operational Controls

* Scale deployments
* Restart services
* Run DB migrations as Kubernetes Jobs
* Stop/start AKS to reduce cost

---

## 🧠 AI SOP Generation Flow

```
User Profile + Program
        ↓
Prompt Engineering
        ↓
LLM Invocation
        ↓
Post-processing & Scoring
        ↓
Database Persistence
        ↓
Frontend Visualization
```

Supports **multi-version SOPs**, re-analysis, and quality comparisons.

---

## 🗄️ Database Design

| Table         | Purpose               |
| ------------- | --------------------- |
| users         | Auth & roles          |
| user_profiles | Academic data         |
| programs      | University catalog    |
| scholarships  | Funding data          |
| applications  | Application lifecycle |
| sops          | AI-generated SOPs     |

Designed with **real SaaS data modeling principles**.

---

## 🛣️ Roadmap

### ✅ Completed

* Full-stack application
* Multi-LLM AI system
* AKS production deployment
* Helm-based orchestration
* Secure authentication
* Persistent data storage

### 🚧 In Progress

* Admin dashboard
* Email notifications
* PDF SOP exports
* Analytics dashboard
* RAG-based chatbot
* Semantic program search

### 🔜 Planned

* GitHub Actions CI/CD
* Prometheus + Grafana
* ELK logging stack
* HPA auto-scaling
* CDN integration

---

## 🏆 What This Project Demonstrates

✅ **End-to-end ownership** (idea → production)
✅ **Real cloud deployment (AKS)**
✅ **Strong MLOps foundations**
✅ **Modern AI orchestration**
✅ **Scalable backend engineering**
✅ **Production DevOps practices**

This is **not a tutorial project** — it’s a **deployable SaaS system**.

---

## 👨‍💻 Author

**Ayaan Shaheer**
Full-Stack AI Engineer | MLOps | Cloud-Native Systems

🔗 GitHub: [https://github.com/AyaanShaheer](https://github.com/AyaanShaheer)
📧 Contact: *gfever252@gmail.com*

---

## ⭐ Support

If this project impressed you or helped you learn:

👉 **Star the repository**
👉 **Fork it**
👉 **Reach out — I’m open to opportunities**

---

*Built with curiosity, discipline, and a lot of Kubernetes YAML.* ☕🚀

