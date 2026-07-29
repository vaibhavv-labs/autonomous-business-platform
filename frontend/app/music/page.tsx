"use client";
export default function MusicPage() {
  const platforms = [
    { name: "Spotify", icon: "🟢", status: "Connected", tracks: 12, desc: "Stream your music to millions" },
    { name: "Apple Music", icon: "🍎", status: "Not connected", tracks: 0, desc: "Distribute to Apple ecosystem" },
    { name: "SoundCloud", icon: "🔶", status: "Connected", tracks: 8, desc: "Share tracks with producers" },
    { name: "TikTok Music", icon: "🎵", status: "Not connected", tracks: 0, desc: "Viral music discovery" },
    { name: "YouTube Music", icon: "▶️", status: "Connected", tracks: 5, desc: "Video & audio distribution" },
    { name: "Bandcamp", icon: "🎸", status: "Not connected", tracks: 0, desc: "Direct fan sales" },
  ];
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>🎵 Music Platforms</h2>
        <p className="text-slate-500 text-sm mt-1">Distribute and manage your music across platforms</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((p) => (
          <div key={p.name} className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{p.icon}</span>
                <span className="font-semibold text-slate-200">{p.name}</span>
              </div>
              <span className={`badge ${p.status === "Connected" ? "badge-success" : "badge-warning"}`}>{p.status === "Connected" ? "● Live" : "○ Off"}</span>
            </div>
            <div className="text-xs text-slate-500">{p.desc}</div>
            {p.tracks > 0 && <div className="text-xs text-indigo-400">{p.tracks} tracks distributed</div>}
            <button className={`w-full text-xs py-2 rounded-lg font-medium transition-all ${p.status === "Connected" ? "btn-secondary" : "btn-primary"}`}>
              {p.status === "Connected" ? "Manage →" : "Connect Platform"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
