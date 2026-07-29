<div align="center">

<h1> 🌐 ABP - Next.js Frontend </h1>

**The highly responsive, dark-mode SaaS dashboard interface for the Autonomous Business Platform.**

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

> **Note:** For the full project documentation and architecture, please see the [Main Project README](../README.md).

</div>

---

## 🎨 Overview

This directory contains the client-facing Next.js App Router application. It serves as the primary dashboard for users to interact with AI agents (Otto), generate visual assets, configure campaigns, and view marketing analytics.

**Key UI Highlights:**
- Mobile-first, responsive slide-out sidebar navigation.
- Real-time polling logic for asynchronous AI image/video generation tasks.
- Premium glassmorphism and curated dark mode aesthetic.
- Zero server-side state (fully decoupled and edge-deployable via Vercel).

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

When deploying to Vercel (or running locally with a remote backend), you must provide the API endpoint:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```
*(If empty, the app defaults to `http://localhost:8000`)*
