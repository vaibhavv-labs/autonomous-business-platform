"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/",           icon: "🏠", label: "Dashboard" },
  { href: "/chat",       icon: "🤖", label: "AI Chat (Otto)" },
  { href: "/campaigns",  icon: "🎯", label: "Campaign Creator" },
  { href: "/content",    icon: "📝", label: "Content Generator" },
  { href: "/products",   icon: "📦", label: "Product Studio" },
  { href: "/email",      icon: "💌", label: "Email Outreach" },
  { href: "/contacts",   icon: "🔍", label: "Contacts" },
  { href: "/customers",  icon: "👥", label: "Customers" },
  { href: "/analytics",  icon: "📊", label: "Analytics" },
  { href: "/workflows",  icon: "🔧", label: "Workflows" },
  { href: "/brand",      icon: "🎨", label: "Brand Templates" },
  { href: "/settings",   icon: "⚙️", label: "Settings" },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    if (onMobileClose) onMobileClose();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/login", redirect: true });
    } catch {
      // Fallback
    }
    window.location.href = "/login";
  };

  const SidebarInner = (
    <aside
      className={`flex flex-col h-full transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
      style={{
        background: "linear-gradient(180deg, rgba(10,14,23,0.98) 0%, rgba(7,11,20,0.99) 100%)",
        borderRight: "1px solid rgba(99,102,241,0.12)",
        backdropFilter: "blur(20px)",
        minWidth: collapsed ? "4rem" : "16rem",
      }}
    >
      {/* Brand Header */}
      <div
        className="flex items-center px-4 py-5 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(99,102,241,0.12)" }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
              boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
            }}
          >
            🚀
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div
                className="text-sm font-bold truncate"
                style={{
                  background: "linear-gradient(135deg, #f1f5f9 0%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.03em",
                }}
              >
                ABP Pro
              </div>
              <div className="text-xs text-slate-500 truncate mt-0.5">Business Platform</div>
            </div>
          )}
        </div>
        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-2 w-6 h-6 hidden lg:flex items-center justify-center rounded text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all flex-shrink-0"
        >
          {collapsed ? "›" : "‹"}
        </button>
        {/* Close button — mobile only */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="ml-2 w-6 h-6 lg:hidden flex items-center justify-center rounded text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all flex-shrink-0 text-lg"
          >
            ✕
          </button>
        )}
      </div>

      {/* Status Badges */}
      {!collapsed && (
        <div className="px-4 py-2 flex gap-2 flex-shrink-0">
          <span className="badge badge-success">● LIVE</span>
          <span className="badge badge-primary">AI POWERED</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="space-y-0.5">
          {navItems.map(({ href, icon, label }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                  isActive ? "nav-active" : "text-slate-400 hover:text-slate-100"
                }`}
                style={
                  isActive
                    ? {
                        background: "rgba(99,102,241,0.15)",
                        color: "#818cf8",
                        borderLeft: "2px solid #6366f1",
                      }
                    : {
                        borderLeft: "2px solid transparent",
                      }
                }
                title={collapsed ? label : undefined}
              >
                <span className="text-base leading-none flex-shrink-0">{icon}</span>
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{label}</span>
                )}
              </Link>
            );
          })}

          {/* Dedicated Sign Out nav button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-left mt-2"
            style={{ borderLeft: "2px solid transparent" }}
            title={collapsed ? "Sign Out" : undefined}
          >
            <span className="text-base leading-none flex-shrink-0">🚪</span>
            {!collapsed && (
              <span className="text-sm font-medium truncate">Sign Out</span>
            )}
          </button>
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div
          className="px-4 py-3 text-xs text-slate-600 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(99,102,241,0.08)" }}
        >
          <div className="font-medium text-slate-500">ABP Pro v2.1</div>
          <div>Multi-Agent AI Platform</div>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <div className="hidden lg:flex h-screen flex-shrink-0">
        {SidebarInner}
      </div>

      {/* ── Mobile Drawer ───────────────────────────────────── */}
      {/* Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onMobileClose}
      />
      {/* Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "16rem" }}
      >
        <aside
          className="flex flex-col h-full w-full"
          style={{
            background: "linear-gradient(180deg, rgba(10,14,23,0.99) 0%, rgba(7,11,20,1) 100%)",
            borderRight: "1px solid rgba(99,102,241,0.12)",
          }}
        >
          {/* Brand Header */}
          <div
            className="flex items-center px-4 py-5 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(99,102,241,0.12)" }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
                  boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
                }}
              >
                🚀
              </div>
              <div className="min-w-0">
                <div
                  className="text-sm font-bold truncate"
                  style={{
                    background: "linear-gradient(135deg, #f1f5f9 0%, #a78bfa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.03em",
                  }}
                >
                  ABP Pro
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5">Business Platform</div>
              </div>
            </div>
            <button
              onClick={onMobileClose}
              className="ml-2 w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-all flex-shrink-0 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Status */}
          <div className="px-4 py-2 flex gap-2 flex-shrink-0">
            <span className="badge badge-success">● LIVE</span>
            <span className="badge badge-primary">AI POWERED</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-3 px-2">
            <div className="space-y-0.5">
              {navItems.map(({ href, icon, label }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                      isActive ? "nav-active" : "text-slate-400 hover:text-slate-100"
                    }`}
                    style={
                      isActive
                        ? {
                            background: "rgba(99,102,241,0.15)",
                            color: "#818cf8",
                            borderLeft: "2px solid #6366f1",
                          }
                        : { borderLeft: "2px solid transparent" }
                    }
                  >
                    <span className="text-base leading-none flex-shrink-0">{icon}</span>
                    <span className="text-sm font-medium truncate">{label}</span>
                  </Link>
                );
              })}

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-left mt-2"
              >
                <span className="text-base leading-none flex-shrink-0">🚪</span>
                <span className="text-sm font-medium truncate">Sign Out</span>
              </button>
            </div>
          </nav>

          {/* Footer */}
          <div
            className="px-4 py-3 text-xs text-slate-600 flex-shrink-0"
            style={{ borderTop: "1px solid rgba(99,102,241,0.08)" }}
          >
            <div className="font-medium text-slate-500">ABP Pro v2.1</div>
            <div>Multi-Agent AI Platform</div>
          </div>
        </aside>
      </div>
    </>
  );
}
