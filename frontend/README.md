<div align="center">

<h1> 🌐 ABP - Next.js 16 Frontend & Serverless Engine </h1>

**The dark-mode glassmorphic SaaS dashboard interface and Next.js serverless API layer for the Autonomous Business Platform.**

![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

> **Note:** For full project documentation, see the [Main Monorepo README](../README.md).

</div>

---

## 🎨 Overview & Features

This directory contains the Next.js 16 (Turbopack) App Router client application and Serverless API routes.

**Key Highlights:**
- **Product Studio**: Flux AI image generation with multi-image support, unique random seeds, and retry fallback handlers.
- **Campaign Creator**: Multi-channel marketing strategies with 1-click **💾 Save to DB** and **Saved History** tab.
- **Content Studio**: **🐦 1-Click Twitter/X Share**, **📄 PDF Export Generator**, and **📅 Post Scheduler**.
- **Email Outreach**: Integrated with **Resend.com API** + CRM Recipient picker from Customers / Contacts DB.
- **Live Analytics**: Real-time DB calculations for Revenue, Customers, Products, Contacts, and Campaigns with Recharts.
- **Authentication**: NextAuth session management + Telegram Bot instant login alert notifications (`@AbpMonitorBot`).
- **Serverless API Routes (`app/api/...`)**: Built-in Next.js lambdas backed by global in-memory store (`store.ts`) for zero-downtime Vercel deployments.

---

## 💻 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` in `frontend/`:
```env
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
TELEGRAM_BOT_TOKEN=8588600733:AAFpMB0UgUccGZXYUXlsVcLVMn4yjZ-UalY
TELEGRAM_CHAT_ID=6006434323
RESEND_API_KEY=your_resend_key_here
GROQ_API_KEY=your_groq_key_here
```

### 3. Start Development Server
```bash
npm run dev
```

The application will launch at `http://localhost:3000`.
