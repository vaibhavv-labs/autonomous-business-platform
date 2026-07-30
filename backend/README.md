<div align="center">

<h1> ⚙️ ABP - FastAPI Backend </h1>

**The high-performance, rate-limited Python REST API & SQLite Database for the Autonomous Business Platform.**

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Pytest](https://img.shields.io/badge/Pytest-Test_Suite-0A9EDC?style=for-the-badge&logo=pytest&logoColor=white)

> **Note:** For full project documentation, see the [Main Monorepo README](../README.md).

</div>

---

## ⚙️ Capabilities & Architecture

- **FastAPI Core (`api_server.py`)**: Asynchronous endpoints for AI generation, chat, and database management.
- **SQLite Database Manager (`database.py`)**: Persistent SQLite tables for `customers`, `contacts`, `products`, and `campaigns`.
- **Sliding Window Rate Limiter**: IP-based rate limiting middleware capping requests at 60 req/min per IP to prevent API quota burn.
- **Strict Pydantic Validation**: All requests validated with `pydantic.Field` length & numeric range constraints.
- **Sanitized Error Handlers**: Custom exception handlers ensure zero raw Python stack traces are exposed to users.
- **Pytest Suite (`tests/test_api.py`)**: 5 unit & integration tests covering root status, Pydantic validation rejection, and full CRUD lifecycles.

---

## 🧪 Running Tests

```bash
cd backend
python -m pytest tests/test_api.py -v
```

---

## 🚀 Running Backend Locally

### 1. Environment Setup
Create a `.env` file in `backend/`:
```env
GROQ_API_KEY=your_groq_api_key
```

### 2. Install Dependencies & Start
```bash
pip install -r requirements.txt
python api_server.py
```

The API will start at `http://127.0.0.1:8000`. Interactive Swagger UI documentation is available at `http://127.0.0.1:8000/docs`.
