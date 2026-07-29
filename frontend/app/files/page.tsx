"use client";
export default function FilesPage() {
  const files = [
    { name: "hero-design-v1.png", type: "image", size: "2.4 MB", created: "Today", icon: "🖼" },
    { name: "campaign-strategy.txt", type: "text", size: "12 KB", created: "Today", icon: "📝" },
    { name: "product-video.mp4", type: "video", size: "45 MB", created: "Yesterday", icon: "🎬" },
    { name: "email-sequence.txt", type: "text", size: "8 KB", created: "Yesterday", icon: "💌" },
    { name: "contact-list.csv", type: "data", size: "24 KB", created: "2 days ago", icon: "📊" },
    { name: "brand-guide.txt", type: "text", size: "18 KB", created: "3 days ago", icon: "🎨" },
  ];
  const TYPE_BADGE: Record<string, string> = { image: "badge-success", text: "badge-primary", video: "badge-warning", data: "badge-primary" };
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>📁 File Library</h2>
          <p className="text-slate-500 text-sm mt-1">All AI-generated assets in one place</p>
        </div>
        <div className="flex gap-2">
          <span className="badge badge-primary">{files.length} files</span>
        </div>
      </div>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["File", "Type", "Size", "Created", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {files.map((f, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{f.icon}</span>
                    <span className="text-slate-300 font-medium">{f.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3"><span className={`badge ${TYPE_BADGE[f.type]}`}>{f.type}</span></td>
                <td className="px-5 py-3 text-slate-500 text-xs">{f.size}</td>
                <td className="px-5 py-3 text-slate-500 text-xs">{f.created}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button className="btn-secondary text-xs px-2 py-1">👁 View</button>
                    <button className="btn-secondary text-xs px-2 py-1">⬇ Save</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="glass-card p-5 text-center">
        <div className="text-slate-500 text-sm">Files are generated and stored when you run campaigns, images, videos, or content.</div>
      </div>
    </div>
  );
}
