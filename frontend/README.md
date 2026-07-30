<div align="center">

<h1> 🌐 ABP - Next.js Frontend </h1>

**The highly responsive, dark-mode SaaS dashboard interface for the Autonomous Business Platform.**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-Email-000000?style=for-the-badge&logo=resend&logoColor=white)

> **Note:** For the full project documentation and architecture, please see the [Main Project README](../README.md).

</div>

---

## 🎨 Overview

This directory contains the client-facing Next.js App Router application and Serverless API routes. It serves as the primary dashboard for users to interact with AI agents (Otto), generate visual assets, configure campaigns, dispatch real email outreach via Resend.com, and view live marketing analytics.

**Key UI Highlights:**
- Mobile-first, responsive slide-out sidebar navigation.
- Real-time polling logic for asynchronous AI image/video generation tasks.
- Integrated **Resend.com Email Outreach** with CRM Recipient selector.
- 1-Click **🐦 Twitter/X Sharing**, **📄 PDF Export Generator**, and **📅 Post Scheduler**.
- Saved Campaigns History tab and Live Database Analytics with Recharts.
- NextAuth authentication with Telegram Bot instant login notifications (`@AbpMonitorBot`).
- Premium glassmorphism and curated dark mode aesthetic.
- In-memory fallback serverless store (`store.ts`) for zero downtime on Vercel deployments.

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+ installed.
- Ensure the FastAPI backend is running locally on port 8000.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

The frontend will start at [http://localhost:3000](http://localhost:3000).

---

## 🌍 Environment Variables

When deploying to Vercel (or running locally with a remote backend), configure these in `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
TELEGRAM_BOT_TOKEN=8588600733:AAFpMB0UgUccGZXYUXlsVcLVMn4yjZ-UalY
TELEGRAM_CHAT_ID=6006434323
RESEND_API_KEY=your_resend_api_key
GROQ_API_KEY=your_groq_api_key
```
*(If NEXT_PUBLIC_API_URL is empty, the app defaults to `http://localhost:8000`)*
