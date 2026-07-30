"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/":          { title: "Dashboard",         subtitle: "Overview of your business platform" },
  "/chat":      { title: "AI Chat (Otto)",    subtitle: "Your AI business assistant" },
  "/campaigns": { title: "Campaign Creator",  subtitle: "AI-powered marketing campaigns" },
  "/products":  { title: "Product Studio",    subtitle: "Generate AI product designs" },
  "/content":   { title: "Content Generator", subtitle: "Blogs, social media & ad copy" },
  "/analytics": { title: "Analytics",         subtitle: "Performance metrics & insights" },
  "/contacts":  { title: "Contacts",          subtitle: "AI-powered outreach discovery" },
  "/customers": { title: "Customers",         subtitle: "CRM & customer management" },
  "/brand":     { title: "Brand Templates",   subtitle: "Consistent brand identity" },
  "/email":     { title: "Email Outreach",    subtitle: "Automated email campaigns" },
  "/workflows": { title: "Workflows",         subtitle: "Automation builder" },
  "/settings":  { title: "Settings",          subtitle: "Platform configuration" },
};

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const pathname          = usePathname();
  const { data: session } = useSession();
  const [time, setTime]   = useState("");

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    update();
    const iv = setInterval(update, 30000);
    return () => clearInterval(iv);
  }, []);

  const matchedKey =
    Object.keys(pageTitles)
      .filter((k) => pathname === k || (k !== "/" && pathname.startsWith(k)))
      .sort((a, b) => b.length - a.length)[0] || "/";
  const { title, subtitle } = pageTitles[matchedKey] || pageTitles["/"];

  const user     = session?.user || { name: "Guest", email: "guest@abp-platform.ai", image: "/guest-avatar.jpg" };
  const isGuest  = user?.email === "guest@abp-platform.ai";
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "G";

  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 py-3 flex-shrink-0"
      style={{
        background:   "rgba(10, 14, 23, 0.95)",
        borderBottom: "1px solid rgba(99,102,241,0.1)",
        minHeight:    "60px",
        /* NO backdropFilter — it breaks position:fixed stacking */
      }}
    >
      {/* Left — Hamburger + Page Title */}
      <div className="flex items-center gap-3">
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
          <h1 className="text-sm sm:text-base font-bold text-slate-100 leading-tight">
            {title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right — Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">

        {/* AI Live */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            background: "rgba(16,185,129,0.1)",
            border:     "1px solid rgba(16,185,129,0.2)",
            color:      "#34d399",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="hidden md:inline">AI Live</span>
        </div>

        {/* Clock */}
        <div className="hidden md:block text-xs text-slate-500 font-mono">{time}</div>

        {/* Otto AI */}
        <button
          className="btn-primary text-xs px-2.5 sm:px-3 py-1.5 whitespace-nowrap"
          onClick={() => (window.location.href = "/chat")}
          style={{ fontSize: "0.78rem" }}
        >
          🤖 <span className="hidden sm:inline">Otto AI</span>
        </button>

        {/* Avatar + Guest Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexShrink: 0 }}>
          {isGuest && (
            <span
              className="hidden sm:inline"
              style={{
                fontSize:       "0.65rem",
                fontWeight:     700,
                padding:        "0.15rem 0.5rem",
                borderRadius:   "9999px",
                background:     "rgba(16,185,129,0.12)",
                border:         "1px solid rgba(16,185,129,0.3)",
                color:          "#34d399",
                letterSpacing:  "0.05em",
                textTransform:  "uppercase",
                whiteSpace:     "nowrap",
              }}
            >
              Guest
            </span>
          )}
          <div
            style={{
              width:          "34px",
              height:         "34px",
              borderRadius:   "50%",
              overflow:       "hidden",
              border:         isGuest ? "2px solid rgba(16,185,129,0.6)" : "2px solid rgba(99,102,241,0.5)",
              flexShrink:     0,
              background:     "linear-gradient(135deg,#6366f1,#a78bfa)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontSize:       "0.72rem",
              fontWeight:     700,
              color:          "white",
            }}
            title={isGuest ? "Guest Account" : (user.name ?? "User")}
          >
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "User"}
                width={34}
                height={34}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                unoptimized={user.image.startsWith("/")}
              />
            ) : (
              initials
            )}
          </div>
        </div>

        {/* ── SIGN OUT — plain visible link, no dropdown, no z-index ── */}
        <a
          href="/api/logout"
          onClick={() => { localStorage.clear(); sessionStorage.clear(); }}
          title="Sign out"
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            "0.35rem",
            padding:        "0.4rem 0.75rem",
            borderRadius:   "0.5rem",
            border:         "1px solid rgba(239,68,68,0.35)",
            background:     "rgba(239,68,68,0.08)",
            color:          "#f87171",
            fontSize:       "0.8rem",
            fontWeight:     600,
            textDecoration: "none",
            cursor:         "pointer",
            whiteSpace:     "nowrap",
            transition:     "background 0.15s, border-color 0.15s",
            flexShrink:     0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background    = "rgba(239,68,68,0.18)";
            e.currentTarget.style.borderColor   = "rgba(239,68,68,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background    = "rgba(239,68,68,0.08)";
            e.currentTarget.style.borderColor   = "rgba(239,68,68,0.35)";
          }}
        >
          <span>🚪</span>
          <span className="hidden sm:inline">Sign Out</span>
        </a>

      </div>
    </header>
  );
}
