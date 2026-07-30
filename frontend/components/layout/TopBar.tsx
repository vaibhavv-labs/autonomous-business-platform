"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/":           { title: "Dashboard",         subtitle: "Overview of your business platform" },
  "/chat":       { title: "AI Chat (Otto)",    subtitle: "Your AI business assistant" },
  "/campaigns":  { title: "Campaign Creator",  subtitle: "AI-powered marketing campaigns" },
  "/products":   { title: "Product Studio",    subtitle: "Generate AI product designs" },
  "/content":    { title: "Content Generator", subtitle: "Blogs, social media & ad copy" },
  "/analytics":  { title: "Analytics",         subtitle: "Performance metrics & insights" },
  "/contacts":   { title: "Contacts",          subtitle: "AI-powered outreach discovery" },
  "/customers":  { title: "Customers",         subtitle: "CRM & customer management" },
  "/brand":      { title: "Brand Templates",   subtitle: "Consistent brand identity" },
  "/email":      { title: "Email Outreach",    subtitle: "Automated email campaigns" },
  "/workflows":  { title: "Workflows",         subtitle: "Automation builder" },
  "/settings":   { title: "Settings",          subtitle: "Platform configuration" },
};

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const pathname              = usePathname();
  const { data: session }     = useSession();
  const [time, setTime]       = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    update();
    const iv = setInterval(update, 30000);
    return () => clearInterval(iv);
  }, []);

  // Close avatar menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const matchedKey =
    Object.keys(pageTitles)
      .filter((k) => pathname === k || (k !== "/" && pathname.startsWith(k)))
      .sort((a, b) => b.length - a.length)[0] || "/";
  const { title, subtitle } = pageTitles[matchedKey] || pageTitles["/"];

  const user      = session?.user || { name: "User", email: "user@abp.ai" };
  const initials  = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  const handleSignOut = async () => {
    setMenuOpen(false);
    try {
      await signOut({ callbackUrl: "/login", redirect: true });
    } catch {
      // Fallback
    }
    window.location.href = "/login";
  };

  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 py-3 flex-shrink-0"
      style={{
        background:    "rgba(10, 14, 23, 0.8)",
        borderBottom:  "1px solid rgba(99,102,241,0.1)",
        backdropFilter:"blur(12px)",
        minHeight:     "60px",
        position:      "relative",
      }}
    >
      {/* Left — Hamburger (mobile) + Page Title */}
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
          <h1 className="text-sm sm:text-base font-bold text-slate-100 leading-tight" style={{ fontWeight: 700 }}>
            {title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right — Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status pill */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            background: "rgba(16,185,129,0.1)",
            border:     "1px solid rgba(16,185,129,0.2)",
            color:      "#34d399",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "pulse-glow 2s infinite" }} />
          <span className="hidden md:inline">AI Live</span>
          <span className="md:hidden">Live</span>
        </div>

        {/* Time */}
        <div className="hidden md:block text-xs text-slate-500 font-mono">{time}</div>

        {/* Otto Quick Launch */}
        <button
          className="btn-primary text-xs px-2.5 sm:px-3 py-1.5 whitespace-nowrap"
          onClick={() => (window.location.href = "/chat")}
          style={{ fontSize: "0.78rem" }}
        >
          🤖 <span className="hidden sm:inline">Otto AI</span>
          <span className="sm:hidden">AI</span>
        </button>

        {/* User Profile Avatar & Dropdown */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              width:        "36px",
              height:       "36px",
              borderRadius: "50%",
              overflow:     "hidden",
              border:       "2px solid rgba(99,102,241,0.5)",
              cursor:       "pointer",
              flexShrink:   0,
              background:   "linear-gradient(135deg,#6366f1,#a78bfa)",
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              fontSize:     "0.75rem",
              fontWeight:   700,
              color:        "white",
              transition:   "border-color 0.2s",
            }}
            title={user.name ?? "User menu"}
          >
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "User"}
                width={36}
                height={36}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            ) : (
              initials
            )}
          </button>

          {/* Floating High Z-Index Dropdown */}
          {menuOpen && (
            <div
              style={{
                position:       "fixed",
                top:            "62px",
                right:          "1.25rem",
                minWidth:       "220px",
                background:     "rgba(10,14,23,0.98)",
                border:         "1px solid rgba(99,102,241,0.3)",
                borderRadius:   "0.75rem",
                backdropFilter: "blur(24px)",
                boxShadow:      "0 20px 50px rgba(0,0,0,0.8)",
                zIndex:         99999,
                overflow:       "hidden",
              }}
            >
              {/* User info */}
              <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9" }}>{user.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>{user.email}</div>
              </div>

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                style={{
                  width:      "100%",
                  padding:    "0.75rem 1rem",
                  textAlign:  "left",
                  background: "transparent",
                  border:     "none",
                  color:      "#f87171",
                  fontSize:   "0.85rem",
                  cursor:     "pointer",
                  display:    "flex",
                  alignItems: "center",
                  gap:        "0.5rem",
                  fontFamily: "inherit",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span>🚪</span> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
