"use client";
import { useEffect, useState } from "react";
import { getHealth } from "@/lib/api";

type Status = "checking" | "waking" | "online" | "offline";

export default function BackendStatus() {
  const [status, setStatus] = useState<Status>("checking");
  const [dots, setDots]     = useState(".");

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20; // 60 s total (20 × 3 s)

    const check = async () => {
      try {
        await getHealth();
        setStatus("online");
      } catch {
        attempts++;
        if (attempts === 1) setStatus("waking");
        if (attempts >= maxAttempts) { setStatus("offline"); return; }
        setTimeout(check, 3000);
      }
    };

    check();
  }, []);

  // Animate dots while waking
  useEffect(() => {
    if (status !== "waking" && status !== "checking") return;
    const iv = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 500);
    return () => clearInterval(iv);
  }, [status]);

  // Don't render anything when backend is online
  if (status === "online") return null;

  const bannerStyle: React.CSSProperties = {
    position:        "fixed",
    bottom:          "1.25rem",
    right:           "1.25rem",
    zIndex:          9999,
    padding:         "0.75rem 1.25rem",
    borderRadius:    "0.75rem",
    fontSize:        "0.8rem",
    display:         "flex",
    alignItems:      "center",
    gap:             "0.6rem",
    backdropFilter:  "blur(16px)",
    boxShadow:       "0 4px 24px rgba(0,0,0,0.4)",
    border:          "1px solid rgba(255,255,255,0.08)",
    fontFamily:      "inherit",
    background:      status === "offline"
                       ? "rgba(239,68,68,0.15)"
                       : "rgba(99,102,241,0.15)",
    borderColor:     status === "offline"
                       ? "rgba(239,68,68,0.3)"
                       : "rgba(99,102,241,0.3)",
  };

  return (
    <div style={bannerStyle} role="status" aria-live="polite">
      {status === "offline" ? (
        <>
          <span style={{ fontSize: "1rem" }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 600, color: "#fca5a5" }}>Backend Offline</div>
            <div style={{ color: "#94a3b8", marginTop: "0.1rem" }}>
              Could not reach the server. Please try again later.
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Spinner */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" stroke="rgba(99,102,241,0.3)" strokeWidth="3"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#818cf8" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <div>
            <div style={{ fontWeight: 600, color: "#a5b4fc" }}>
              {status === "checking" ? `Connecting${dots}` : `Waking up backend${dots}`}
            </div>
            <div style={{ color: "#64748b", marginTop: "0.1rem" }}>
              Free server spins down when idle — takes ~30 sec
            </div>
          </div>
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
