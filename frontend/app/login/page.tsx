"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div style={styles.fullscreen}>
        <div style={styles.spinner} />
      </div>
    );
  }

  return (
    <div style={styles.fullscreen}>
      {/* Animated background blobs */}
      <div style={{ ...styles.blob, top: "-10%", left: "-10%", background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)" }} />
      <div style={{ ...styles.blob, bottom: "-10%", right: "-10%", background: "radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)" }} />
      <div style={{ ...styles.blob, top: "40%", right: "20%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />

      {/* Card */}
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>🚀</div>
        </div>

        <h1 style={styles.title}>ABP Pro</h1>
        <p style={styles.subtitle}>Autonomous Business Platform</p>
        <p style={styles.desc}>
          Your AI-powered command centre for marketing,<br />
          campaigns, and business automation.
        </p>

        <div style={styles.divider} />

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            ...styles.googleBtn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? (
            <>
              <div style={styles.smallSpinner} />
              Signing in…
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <p style={styles.terms}>
          By signing in you agree to our{" "}
          <span style={{ color: "#818cf8" }}>Terms of Service</span>
          {" "}and{" "}
          <span style={{ color: "#818cf8" }}>Privacy Policy</span>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  fullscreen: {
    minHeight:       "100vh",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    background:      "linear-gradient(135deg, #060911 0%, #0a0e17 50%, #060911 100%)",
    position:        "relative",
    overflow:        "hidden",
    fontFamily:      "inherit",
  },
  blob: {
    position:  "absolute",
    width:     "600px",
    height:    "600px",
    borderRadius: "50%",
    filter:    "blur(80px)",
    pointerEvents: "none",
  },
  card: {
    position:        "relative",
    zIndex:          1,
    width:           "100%",
    maxWidth:        "420px",
    margin:          "1rem",
    padding:         "2.5rem 2rem",
    borderRadius:    "1.25rem",
    background:      "rgba(10,14,23,0.85)",
    border:          "1px solid rgba(99,102,241,0.2)",
    backdropFilter:  "blur(24px)",
    boxShadow:       "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)",
    textAlign:       "center",
    animation:       "fadeUp 0.5s ease both",
  },
  logoWrap: {
    width:           "64px",
    height:          "64px",
    borderRadius:    "1rem",
    background:      "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
    boxShadow:       "0 8px 24px rgba(99,102,241,0.5)",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    fontSize:        "1.75rem",
    margin:          "0 auto 1.25rem",
  },
  logoIcon: {},
  title: {
    fontSize:      "1.75rem",
    fontWeight:    800,
    background:    "linear-gradient(135deg, #f1f5f9 0%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor:  "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.04em",
    margin:        "0 0 0.25rem",
  },
  subtitle: {
    fontSize:   "0.85rem",
    color:      "#64748b",
    margin:     "0 0 1rem",
    fontWeight: 500,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  desc: {
    fontSize:   "0.9rem",
    color:      "#94a3b8",
    lineHeight: 1.6,
    margin:     "0",
  },
  divider: {
    height:     "1px",
    background: "rgba(99,102,241,0.12)",
    margin:     "1.75rem 0",
  },
  googleBtn: {
    width:          "100%",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    gap:            "0.75rem",
    padding:        "0.875rem 1.5rem",
    borderRadius:   "0.75rem",
    border:         "1px solid rgba(255,255,255,0.1)",
    background:     "rgba(255,255,255,0.06)",
    color:          "#f1f5f9",
    fontSize:       "0.95rem",
    fontWeight:     600,
    transition:     "all 0.2s ease",
    fontFamily:     "inherit",
  },
  terms: {
    fontSize:  "0.75rem",
    color:     "#475569",
    marginTop: "1.25rem",
    lineHeight: 1.6,
  },
  spinner: {
    width:  "40px",
    height: "40px",
    border: "3px solid rgba(99,102,241,0.2)",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  smallSpinner: {
    width:  "18px",
    height: "18px",
    border: "2px solid rgba(255,255,255,0.2)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};
