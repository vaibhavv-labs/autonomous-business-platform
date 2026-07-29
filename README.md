<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Space+Mono&size=30&pause=1000&color=6366f1&center=true&vCenter=true&width=800&lines=Autonomous+Business+Platform+%F0%9F%9A%80;Decoupled+Next.js+%2B+FastAPI+Architecture;Groq+Llama+3+%C2%B7+Replicate+Flux+%C2%B7+AI+Agents;Smart+Content+Generation+%26+Automation" alt="Typing SVG" />

<br/>

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama_3-f55036?style=for-the-badge&logo=groq&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Hosting-46E3B7?style=for-the-badge&logo=render&logoColor=white)

<br/>

> ⚡ **A fully automated, AI-powered SaaS platform for running a business. Generates ad copy, creates product videos, handles social media campaigns, and organizes workflows using cutting-edge LLMs and Image/Video Generation APIs.**
> 
> 🔗 **[Live Demo: autonomous-business-platform-dskp.vercel.app](https://autonomous-business-platform-dskp.vercel.app)**

<br/>

![Header](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6&height=120&section=header&text=Autonomous%20Business%20Platform&fontSize=30&fontColor=ffffff&animation=fadeIn&desc=AI-Driven+Marketing+%26+SaaS+Platform&descSize=15&descAlignY=78)

</div>

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🤖 **AI Agents & Chat** | Interact with "Otto", your personal AI business assistant powered by Groq & Llama 3. |
| 🎨 **Image & Video Generation** | Instantly create high-quality product images and video clips via Replicate, Flux, and Sora models. |
| 📱 **Social Media Automation** | Generate complete marketing campaigns, captions, and posts for multi-platform deployment. |
| ⚡ **Next.js App Router** | Highly responsive, premium client-side user interface with mobile-first slide-out sidebars. |
| 🚄 **FastAPI Backend** | Robust Python backend capable of queuing complex AI jobs and returning real-time data. |
| 🌙 **Premium Dark Mode UI** | Beautiful, sleek aesthetics featuring glassmorphism and modern CSS styling. |
| 📊 **Analytics & Campaigns** | Track business performance, manage customer data, and monitor AI workflows from one dashboard. |

---

## 🧠 AI Model Architecture

| Property | Details |
|---|---|
| Brain / Logic (Fast Text) | `llama3-8b-8192` (via Groq for instant inference) |
| Image Generation | `black-forest-labs/flux-schnell` (via Replicate) / Pollinations AI |
| Video Generation | Text-to-Video models (via Replicate APIs) |
| Architecture | Next.js Client → FastAPI REST Backend → External AI APIs |

---

## 🛠️ How It Works (Decoupled System)

```text
  📱 User Interaction (Next.js Dashboard)
           ⬇️
           ⬇️ HTTP GET / POST
  🌐 Vercel Frontend Edge Network
           ⬇️
           ⬇️ API Call to backend (/api/chat, /api/generate)
  ⚙️ FastAPI Backend on Render
           ⬇️
           ⬇️ Async Job Queueing
  🤖 External APIs (Groq / Replicate / Pollinations)
           ⬇️
           ⬇️ Real-time Streaming & Polling
  📈 Final Content Delivered to UI
```

---

## 💻 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15 & React 19** | Frontend Framework and UI Rendering |
| **TailwindCSS** | Utility-first responsive styling and layout |
| **Python 3.11+** | Backend scripting and logic |
| **FastAPI & Uvicorn** | High-performance REST API |
| **Groq SDK** | Ultra-fast LLM inference |
| **Replicate API** | Cloud-based Image and Video Generation |

---

## 📁 Project Structure (Monorepo)

```text
autonomous-business-platform/
├── frontend/                     # 🌐 Next.js Application
│   ├── app/                      # Page routing & layouts
│   ├── components/layout/        # Sidebar, Topbar, RootLayout
│   ├── lib/                      # API endpoints & polling logic
│   └── public/                   # Static assets & SVG icons
│
└── backend/                      # ⚙️ FastAPI Server
    ├── app/                      # Backend endpoints & configurations
    ├── modules/                  # Business logic (Video, Audio, AI Generation)
    ├── api_server.py             # Main FastAPI entry point
    └── requirements.txt          # Python dependencies
```

---

## ⚙️ Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/vaibhavv-labs/autonomous-business-platform.git
cd autonomous-business-platform
```

### 2. Setup the Backend (Terminal 1)
```bash
cd backend
pip install -r requirements_railway.txt
# Set your environment variables (GROQ_API_KEY, REPLICATE_API_TOKEN)
uvicorn api_server:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Setup the Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the App
Visit [http://localhost:3000](http://localhost:3000) in your browser. The frontend will automatically route API requests to your local FastAPI backend running on port 8000.

---

## 👨‍💻 Contributor

**Vaibhav Bhoyate** (Creator/Author)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/vaibhav-bhoyate-6328802a9/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/vaibhavv-labs)

---

## 📄 License

This project is licensed under the **MIT License**.