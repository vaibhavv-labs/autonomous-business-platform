"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState<string | null>(null); // "google" | "credentials" | "guest" | null
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const handleGoogleSignIn = async () => {
    try {
      setErrorMsg(null);
      setLoading("google");
      await signIn("google", { callbackUrl: "/" });
    } catch {
      setErrorMsg("Failed to initialize Google Sign In.");
      setLoading(null);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please fill in email and password.");
      return;
    }

    if (isSignUp && !name) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading("credentials");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      name: isSignUp ? name : undefined,
      callbackUrl: "/",
    });

    if (res?.error) {
      setErrorMsg(res.error || "Authentication failed. Check your details.");
      setLoading(null);
    } else {
      router.replace("/");
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setErrorMsg(null);
      setLoading("guest");
      const res = await signIn("credentials", {
        redirect: false,
        isGuest: "true",
        callbackUrl: "/",
      });

      if (res?.error) {
        setErrorMsg("Failed to start guest session.");
        setLoading(null);
      } else {
        router.replace("/");
      }
    } catch {
      setErrorMsg("Failed to start guest session.");
      setLoading(null);
    }
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
      {/* Background radial effects */}
      <div style={{ ...styles.blob, top: "-10%", left: "-10%", background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)" }} />
      <div style={{ ...styles.blob, bottom: "-10%", right: "-10%", background: "radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)" }} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>🚀</div>
        </div>

        <h1 style={styles.title}>ABP Pro</h1>
        <p style={styles.subtitle}>Autonomous Business Platform</p>

        {/* Tab Switcher */}
        <div style={styles.tabContainer}>
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMsg(null); }}
            style={{
              ...styles.tabBtn,
              ...(isSignUp ? {} : styles.activeTab),
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMsg(null); }}
            style={{
              ...styles.tabBtn,
              ...(isSignUp ? styles.activeTab : {}),
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={styles.errorAlert}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSubmit} style={styles.form}>
          {isSignUp && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required={isSignUp}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!!loading}
            style={{
              ...styles.primaryBtn,
              opacity: loading === "credentials" ? 0.7 : 1,
            }}
          >
            {loading === "credentials" ? (
              <div style={styles.btnLoading}>
                <div style={styles.smallSpinner} />
                {isSignUp ? "Creating Account..." : "Signing in..."}
              </div>
            ) : (
              isSignUp ? "Create Free Account" : "Sign In with Email"
            )}
          </button>
        </form>

        <div style={styles.dividerWrap}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>OR</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleSignIn}
          disabled={!!loading}
          type="button"
          style={{
            ...styles.oauthBtn,
            opacity: loading === "google" ? 0.7 : 1,
          }}
        >
          {loading === "google" ? (
            <div style={styles.btnLoading}>
              <div style={styles.smallSpinner} />
              Connecting Google...
            </div>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Guest Option */}
        <button
          onClick={handleGuestSignIn}
          disabled={!!loading}
          type="button"
          style={{
            ...styles.guestBtn,
            opacity: loading === "guest" ? 0.7 : 1,
          }}
        >
          {loading === "guest" ? (
            <div style={styles.btnLoading}>
              <div style={styles.smallSpinner} />
              Entering Guest Mode...
            </div>
          ) : (
            <>⚡ Instant Guest Demo Mode</>
          )}
        </button>

        <p style={styles.terms}>
          By continuing you agree to our{" "}
          <span style={{ color: "#818cf8" }}>Terms</span> &{" "}
          <span style={{ color: "#818cf8" }}>Privacy Policy</span>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  fullscreen: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #060911 0%, #0a0e17 50%, #060911 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "inherit",
    padding: "1rem",
  },
  blob: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    filter: "blur(90px)",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "430px",
    padding: "2rem 1.75rem",
    borderRadius: "1.25rem",
    background: "rgba(10,14,23,0.92)",
    border: "1px solid rgba(99,102,241,0.25)",
    backdropFilter: "blur(24px)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
    animation: "fadeUp 0.4s ease both",
  },
  logoWrap: {
    width: "52px",
    height: "52px",
    borderRadius: "0.875rem",
    background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
    boxShadow: "0 6px 20px rgba(99,102,241,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    margin: "0 auto 0.75rem",
  },
  logoIcon: {},
  title: {
    fontSize: "1.5rem",
    fontWeight: 800,
    textAlign: "center",
    background: "linear-gradient(135deg, #f1f5f9 0%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.03em",
    margin: "0 0 0.2rem",
  },
  subtitle: {
    fontSize: "0.8rem",
    color: "#64748b",
    textAlign: "center",
    margin: "0 0 1.25rem",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tabContainer: {
    display: "flex",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "0.625rem",
    padding: "3px",
    marginBottom: "1.25rem",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  tabBtn: {
    flex: 1,
    padding: "0.5rem",
    borderRadius: "0.5rem",
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  activeTab: {
    background: "rgba(99,102,241,0.25)",
    color: "#818cf8",
    boxShadow: "0 2px 8px rgba(99,102,241,0.2)",
  },
  errorAlert: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#fca5a5",
    borderRadius: "0.5rem",
    padding: "0.625rem 0.875rem",
    fontSize: "0.8rem",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.875rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
    textAlign: "left",
  },
  label: {
    fontSize: "0.78rem",
    color: "#cbd5e1",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    padding: "0.7rem 0.875rem",
    borderRadius: "0.625rem",
    border: "1px solid rgba(99, 102, 241, 0.25)",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border 0.2s",
  },
  primaryBtn: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.625rem",
    border: "none",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "#ffffff",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "0.25rem",
    boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
  },
  dividerWrap: {
    display: "flex",
    alignItems: "center",
    margin: "1.25rem 0 1rem",
    gap: "0.75rem",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "rgba(255,255,255,0.08)",
  },
  dividerText: {
    fontSize: "0.7rem",
    color: "#64748b",
    fontWeight: 600,
  },
  oauthBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    padding: "0.65rem 1rem",
    borderRadius: "0.625rem",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#f1f5f9",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "0.625rem",
  },
  guestBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.65rem 1rem",
    borderRadius: "0.625rem",
    border: "1px solid rgba(16,185,129,0.3)",
    background: "rgba(16,185,129,0.1)",
    color: "#34d399",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  btnLoading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  terms: {
    fontSize: "0.72rem",
    color: "#475569",
    marginTop: "1.25rem",
    textAlign: "center",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(99,102,241,0.2)",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  smallSpinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.2)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};
