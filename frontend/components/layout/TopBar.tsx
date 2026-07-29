"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/":           { title: "Dashboard",          subtitle: "Overview of your business platform" },
  "/campaigns":  { title: "Campaign Creator",   subtitle: "AI-powered marketing campaigns" },
  "/products":   { title: "Product Studio",     subtitle: "Generate AI product designs" },
  "/content":    { title: "Content Generator",  subtitle: "Blogs, social media & ad copy" },
  "/video":      { title: "Video Producer",     subtitle: "AI-generated promotional videos" },
  "/playground": { title: "AI Playground",      subtitle: "Experiment with 50+ AI models" },
  "/analytics":  { title: "Analytics",          subtitle: "Performance metrics & insights" },
  "/contacts":   { title: "Contact Finder",     subtitle: "AI-powered outreach discovery" },
  "/brand":      { title: "Brand Templates",    subtitle: "Consistent brand identity" },
  "/email":      { title: "Email Outreach",     subtitle: "Automated email campaigns" },
  "/digital":    { title: "Digital Products",   subtitle: "E-books, courses & more" },
  "/workflows":  { title: "Workflows",          subtitle: "Automation builder" },
  "/calendar":   { title: "Calendar",           subtitle: "Content scheduling" },
  "/journal":    { title: "Journal",            subtitle: "Notes & ideas" },
  "/customers":  { title: "Customers",          subtitle: "CRM & customer management" },
  "/files":      { title: "File Library",       subtitle: "All generated assets" },
  "/music":      { title: "Music Platforms",    subtitle: "Music distribution" },
  "/browser":    { title: "Browser-Use",        subtitle: "AI browser automation" },
  "/jobs":       { title: "Job Monitor",        subtitle: "Background task tracking" },
  "/shortcuts":  { title: "Shortcuts",          subtitle: "Quick action buttons" },
  "/settings":   { title: "Settings",           subtitle: "Platform configuration" },
};

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  const matchedKey =
    Object.keys(pageTitles)
      .filter((k) => pathname === k || (k !== "/" && pathname.startsWith(k)))
      .sort((a, b) => b.length - a.length)[0] || "/";
  const { title, subtitle } = pageTitles[matchedKey] || pageTitles["/"];

  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 py-3 flex-shrink-0"
      style={{
        background: "rgba(10, 14, 23, 0.8)",
        borderBottom: "1px solid rgba(99,102,241,0.1)",
        backdropFilter: "blur(12px)",
        minHeight: "60px",
      }}
    >
      {/* Left — Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex flex-col items-center justify-center w-8 h-8 gap-1.5 rounded-lg hover:bg-white/5 transition-all flex-shrink-0"
          aria-label="Open navigation"
        >
          <span className="w-5 h-0.5 bg-slate-400 rounded-full" />
          <span className="w-5 h-0.5 bg-slate-400 rounded-full" />
          <span className="w-4 h-0.5 bg-slate-400 rounded-full" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-100 leading-tight" style={{ fontWeight: 700 }}>
            {title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right — Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status pill — hidden on very small screens */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.2)",
            color: "#34d399",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ animation: "pulse-glow 2s infinite" }}
          />
          <span className="hidden md:inline">API Connected</span>
          <span className="md:hidden">Live</span>
        </div>

        {/* Time — md+ only */}
        <div className="hidden md:block text-xs text-slate-500 font-mono">{time}</div>

        {/* Otto Chat Quick Launch */}
        <button
          className="btn-primary text-xs px-2.5 sm:px-3 py-1.5 whitespace-nowrap"
          onClick={() => (window.location.href = "/chat")}
          style={{ fontSize: "0.78rem" }}
        >
          🤖 <span className="hidden sm:inline">Otto AI</span>
          <span className="sm:hidden">AI</span>
        </button>
      </div>
    </header>
  );
}
