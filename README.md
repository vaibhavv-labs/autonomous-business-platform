<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Space+Mono&size=30&pause=1000&color=6366f1&center=true&vCenter=true&width=800&lines=Autonomous+Business+Platform+%F0%9F%9A%80;Enterprise+AI+SaaS+Monorepo;Groq+Llama+3.3+70B+%C2%B7+Flux+AI+%C2%B7+Resend.com;Rate+Limited+%C2%B7+Pytest+Tested+%C2%B7+GitHub+Actions+CI" alt="Typing SVG" />

<br/>

![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-f55036?style=for-the-badge&logo=groq&logoColor=white)
![Resend](https://img.shields.io/badge/Resend.com-Email_Outreach-000000?style=for-the-badge&logo=resend&logoColor=white)
![CI/CD](https://img.shields.io/badge/GitHub_Actions-CI_Passed-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Production_Live-000000?style=for-the-badge&logo=vercel&logoColor=white)

<br/>

> ⚡ **Autonomous Business Platform (ABP) is a complete, enterprise-grade AI SaaS platform. It autonomously generates multi-channel marketing campaigns, renders 1024×1024 product designs via Flux AI, dispatches real email outreach via Resend.com, schedules social media posts, and provides live analytics with automated testing & rate limiting.**
> 
> 🔗 **[Live Production Site](https://autonomous-business-platform-master.vercel.app)**

</div>

---

## 🚀 Key Modules & Capabilities

| Module | Feature & Capabilities |
|---|---|
| 🎨 **AI Product Studio** | Render high-res 1024×1024 product mockups with Pollinations Flux AI, client retries, unique seeds, and persistent product catalog management. |
| 🎯 **Campaign Creator** | Multi-channel AI marketing strategies (strategy, social posts, email sequences) with 1-click **💾 Save to DB** and **Saved History** tab. |
| 📝 **AI Content Studio** | Generate SEO blog posts, social captions, and emails with **🐦 1-Click Twitter/X Share**, **📄 PDF Export Generator**, and **📅 Post Scheduler**. |
| 💌 **Email Outreach & Resend** | Integrated with **Resend.com API** for sending real emails + CRM Recipient selector to pick directly from saved Customers or Contacts. |
| 🤖 **Otto AI Assistant** | Instant business strategy chat powered by **Groq LLaMA 3.3 70B** versatile model. |
| 👥 **Contact Studio & CRM** | AI influencer finder + persistent Contacts DB with bulk import and strategy notes. |
| 📊 **Live Analytics Engine** | Real-time calculations for Total Revenue, Customers, Designs, Contacts, and AI Campaigns with interactive Recharts. |
| 📅 **Workflows & Post Scheduler** | Manage, inspect, and cancel scheduled social media posts queue. |
| 🛡️ **Security & Stability** | Sliding window IP rate limiter (60 req/min), strict Pydantic validation (`Field` constraints), and sanitized JSON error handlers. |
| 🧪 **Pytest & GitHub Actions CI** | 5 automated backend unit/integration tests and GitHub Actions CI workflow running on every push. |

---

## 🧠 AI Models & Integrations

| Layer | Provider / Model | Purpose |
|---|---|---|
| **Text Generation / Assistant** | Groq `llama-3.3-70b-versatile` | High-speed LLM inference for Otto chat and content creation |
| **Image Generation** | Pollinations / Flux AI | 1024×1024 high-resolution product photography & mockups |
| **Email Delivery** | Resend.com API | Commercial email dispatch with simulated fallback |
| **Security Alerts** | Telegram Bot Webhook (`@AbpMonitorBot`) | Real-time Markdown notifications sent on user login |
| **Database & Storage** | SQLite + Next.js Serverless Store (`store.ts`) | Dual persistence ensuring zero data loss on Vercel lambdas |

---

## 🛠️ Architecture & Data Flow

```text
  📱 Next.js 16 Client (App Router + Turbopack)
           │
           ├── 🔐 NextAuth Session + Telegram Monitor Alert
           │
           ├── 🌐 Next.js Serverless API Routes (/app/api/...)
           │       ├── Resend.com Email Sender (/api/email/send)
           │       ├── Real Live Analytics (/api/analytics/overview)
           │       ├── Campaigns DB Store (/api/campaigns/db)
           │       └── Scheduled Posts Queue (/api/schedule)
           │
           └── ⚙️ FastAPI Python Backend (Port 8000)
                   ├── IP Rate Limiting Middleware (60 req/min)
                   ├── Strict Pydantic Field Validation
                   ├── SQLite DB (customers, contacts, products, campaigns)
                   └── Groq LLaMA 3.3 70B Engine
```

---

## 🧪 Testing & CI/CD Pipeline

Backend unit and integration tests are located in `backend/tests/test_api.py` and run automatically on every commit via GitHub Actions (`.github/workflows/ci.yml`).

### Running Tests Locally:
```bash
cd backend
python -m pytest tests/test_api.py -v
```

---

## 📁 Repository Structure (Monorepo)

```text
autonomous-business-platform/
├── .github/
│   └── workflows/ci.yml         # 🤖 GitHub Actions CI Workflow
│
├── frontend/                     # 🌐 Next.js 16 Application
│   ├── app/                      # App Router pages (products, campaigns, content, etc.)
│   │   ├── api/                  # Serverless API routes (email, analytics, store)
│   │   └── ...                   # Custom pages & components
│   ├── components/               # Glassmorphic layout & provider components
│   └── lib/                      # Unified API client & TypeScript interfaces
│
└── backend/                      # ⚙️ FastAPI Backend
    ├── api_server.py             # FastAPI server with Rate Limiting & Pydantic models
    ├── database.py               # SQLite Database Manager & CRUD helpers
    └── tests/                    # 🧪 Pytest test suite (test_api.py)
```

---

## 💻 Local Development Setup

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python api_server.py
```
*Backend runs at `http://localhost:8000` (Swagger docs at `/docs`)*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:3000`*

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.