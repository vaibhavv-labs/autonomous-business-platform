"use client";
export default function ShortcutsPage() {
  const shortcuts = [
    { label: "Generate Campaign", icon: "🎯", href: "/campaigns", hotkey: "C", color: "#6366f1" },
    { label: "Create Image", icon: "🎨", href: "/products", hotkey: "I", color: "#10b981" },
    { label: "Write Content", icon: "📝", href: "/content", hotkey: "W", color: "#a78bfa" },
    { label: "Produce Video", icon: "🎬", href: "/video", hotkey: "V", color: "#f59e0b" },
    { label: "Chat with Otto", icon: "🤖", href: "/chat", hotkey: "O", color: "#818cf8" },
    { label: "Find Contacts", icon: "🔍", href: "/contacts", hotkey: "F", color: "#ec4899" },
    { label: "View Analytics", icon: "📊", href: "/analytics", hotkey: "A", color: "#34d399" },
    { label: "Job Monitor", icon: "🔄", href: "/jobs", hotkey: "J", color: "#64748b" },
    { label: "AI Playground", icon: "🎮", href: "/playground", hotkey: "P", color: "#fbbf24" },
    { label: "Email Outreach", icon: "💌", href: "/email", hotkey: "E", color: "#6366f1" },
    { label: "Brand Templates", icon: "🎨", href: "/brand", hotkey: "B", color: "#a78bfa" },
    { label: "Digital Products", icon: "💾", href: "/digital", hotkey: "D", color: "#10b981" },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>⚡ Shortcuts</h2>
        <p className="text-slate-500 text-sm mt-1">Quick access to all platform features</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {shortcuts.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="glass-card p-5 flex flex-col items-center text-center gap-3 transition-all hover:scale-105 active:scale-95"
            style={{ textDecoration: "none" }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `${s.color}18`, border: `1px solid ${s.color}35` }}>
              {s.icon}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">{s.label}</div>
              <div className="mt-1">
                <span className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {s.hotkey}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
