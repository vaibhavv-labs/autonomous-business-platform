<div align="center">

<h1> ⚙️ ABP - FastAPI Backend </h1>

**The highly robust, async Python REST API & SQLite Database for the Autonomous Business Platform.**

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama_3-f55036?style=for-the-badge&logo=groq&logoColor=white)
![Pytest](https://img.shields.io/badge/Pytest-Testing-0A9EDC?style=for-the-badge&logo=pytest&logoColor=white)

> **Note:** For the full project documentation and architecture, please see the [Main Project README](../README.md).

</div>

---

## ⚙️ Overview

This directory contains the FastAPI server that orchestrates all AI generation tasks and manages database persistence. It serves as the brain for the autonomous business platform, managing tasks between the frontend dashboard, SQLite database, and external model providers.

**Key Capabilities:**
- Handles real-time chat with the "Otto" AI agent (powered by Groq/Llama 3).
- Persistent SQLite tables (`customers`, `contacts`, `products`, `campaigns`) with database manager (`database.py`).
- IP sliding window rate limiting middleware (60 req/min) & strict Pydantic Field validation.
- Sanitized global exception handlers to prevent raw Python tracebacks.
- Automated Pytest test suite (`tests/test_api.py`) with 5 unit & integration tests.
- Queues and manages long-running asynchronous jobs.
- Direct integration with Replicate APIs for text-to-image (Flux) and text-to-video (Sora) generation.

---

## 🧪 Running Tests

```bash
cd backend
python -m pytest tests/test_api.py -v
```

---

## 🚀 Running Locally

### Prerequisites
- Python 3.11 or higher installed.

### 1. Setup Virtual Environment (Recommended)
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements_railway.txt
```

### 3. Environment Variables
Create a `.env` file or export these variables in your terminal:
```env
GROQ_API_KEY=your_groq_api_key_here
REPLICATE_API_TOKEN=your_replicate_token_here
```

### 4. Start the Server
```bash
uvicorn api_server:app --host 0.0.0.0 --port 8000 --reload
```

The API will start at [http://127.0.0.1:8000](http://127.0.0.1:8000). You can view the auto-generated Swagger UI docs at `http://127.0.0.1:8000/docs`.

---

## ☁️ Deployment

This backend is pre-configured to deploy easily on **Render** (Free Tier compatible) using the included `requirements_railway.txt` file.

**Render Settings:**
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements_railway.txt`
- **Start Command:** `uvicorn api_server:app --host 0.0.0.0 --port 10000`
