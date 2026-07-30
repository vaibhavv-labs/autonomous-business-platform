"use client";
import { useState, useEffect, useCallback } from "react";
import { getAnalytics, getJobs, generateCampaign, generateImage, pollJob } from "@/lib/api";

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  color: string;
}

function StatCard({ label, value, icon, trend, color }: StatCard) {
  return (
    <div className="glass-card p-5 flex flex-col gap-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}
          >
            {trend}
          </span>
        )}
      </div>
      <div
        className="text-3xl font-bold tracking-tight mt-1"
        style={{ color, letterSpacing: "-0.03em" }}
      >
        {value}
      </div>
      <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  description,
  onClick,
  loading,
}: {
  icon: string;
  label: string;
  description: string;
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="glass-card p-4 text-left w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">{loading ? "⏳" : icon}</span>
        <div>
          <div className="text-sm font-600 text-slate-100" style={{ fontWeight: 600 }}>
            {label}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">{description}</div>
        </div>
      </div>
    </button>
  );
}

function JobRow({ job }: { job: Record<string, unknown> }) {
  const statusColors: Record<string, string> = {
    completed: "badge-success",
    running: "badge-primary",
    failed: "badge-danger",
    queued: "badge-warning",
    cancelled: "badge-warning",
  };
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-sm text-slate-300 truncate">{String(job.description || "")}</div>
        <div className="text-xs text-slate-600 mt-0.5">{String(job.type || "").replace("_", " ")}</div>
      </div>
      <div className="flex items-center gap-3 ml-3">
        {job.status === "running" && (
          <div className="w-20">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Number(job.progress || 0)}%` }}
              />
            </div>
          </div>
        )}
        <span className={`badge ${statusColors[String(job.status)] || "badge-warning"}`}>
          {String(job.status || "")}
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState({ campaign: false, image: false });
  const [concept, setConcept] = useState("");
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchData = useCallback(async () => {
    try {
      const [a, j] = await Promise.all([getAnalytics(), getJobs({ limit: 8 })]);
      setAnalytics(a);
      setJobs(j.jobs || []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 5000);
    return () => clearInterval(iv);
  }, [fetchData]);

  const handleQuickCampaign = async () => {
    if (!concept.trim()) { notify("Enter a concept first", "error"); return; }
    setLoading((p) => ({ ...p, campaign: true }));
    try {
      const { job_id } = await generateCampaign({ product_description: concept });
      notify(`Campaign job started! ID: ${job_id.slice(0, 8)}...`);
      pollJob(job_id, fetchData).then(() => {
        notify("✅ Campaign generated!");
        fetchData();
      }).catch((e) => notify(`Campaign failed: ${e.message}`, "error"));
    } catch (e: unknown) {
      notify(`Error: ${(e as Error).message}`, "error");
    } finally {
      setLoading((p) => ({ ...p, campaign: false }));
    }
  };

  const handleQuickImage = async () => {
    if (!concept.trim()) { notify("Enter a concept first", "error"); return; }
    setLoading((p) => ({ ...p, image: true }));
    try {
      const { job_id } = await generateImage({ prompt: concept });
      notify(`Image job started! ID: ${job_id.slice(0, 8)}...`);
      pollJob(job_id, fetchData).then(() => {
        notify("✅ Image generated!");
        fetchData();
      }).catch((e) => notify(`Image failed: ${e.message}`, "error"));
    } catch (e: unknown) {
      notify(`Error: ${(e as Error).message}`, "error");
    } finally {
      setLoading((p) => ({ ...p, image: false }));
    }
  };

  interface AnalyticsData {
    total_jobs?: number;
    campaigns?: { total?: number; completed?: number };
    images?: { total?: number; completed?: number };
    videos?: { total?: number; completed?: number };
    content?: { total?: number; completed?: number };
  }
  const a = analytics as AnalyticsData | null;

  const stats: StatCard[] = [
    { label: "Total Jobs",  value: Number(a?.total_jobs ?? 0),            icon: "⚡", color: "#818cf8" },
    { label: "Campaigns",   value: Number(a?.campaigns?.completed ?? 0),  icon: "🎯", trend: `${a?.campaigns?.total ?? 0} total`,  color: "#a78bfa" },
    { label: "Images",      value: Number(a?.images?.completed ?? 0),     icon: "🎨", trend: `${a?.images?.total ?? 0} total`,     color: "#34d399" },
    { label: "Videos",      value: Number(a?.videos?.completed ?? 0),     icon: "🎬", trend: `${a?.videos?.total ?? 0} total`,     color: "#fbbf24" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Notification */}
      {notification && (
        <div
          className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-xl animate-fade-in"
          style={{
            background: notification.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
            border: `1px solid ${notification.type === "success" ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
            color: notification.type === "success" ? "#34d399" : "#f87171",
            backdropFilter: "blur(12px)",
          }}
        >
          {notification.msg}
        </div>
      )}

      {/* Hero */}
      <div>
        <h2 className="gradient-text text-3xl font-extrabold tracking-tight" style={{ letterSpacing: "-0.04em" }}>
          🚀 Autonomous Business Platform
        </h2>
        <p className="text-slate-500 mt-1.5 text-sm">
          AI-powered end-to-end business automation · <span className="text-indigo-400 font-semibold">Pro v2.1</span>
        </p>
      </div>

      {/* Quick Concept Input */}
      <div className="glass-card p-6">
        <h3 className="text-base font-semibold text-slate-200 mb-3">⚡ Quick Start — What are you selling?</h3>
        <div className="flex gap-3 flex-col sm:flex-row">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="e.g., Cyberpunk neon husky t-shirt design..."
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleQuickCampaign()}
          />
          <div className="flex gap-2">
            <button className="btn-primary whitespace-nowrap" onClick={handleQuickCampaign} disabled={loading.campaign}>
              {loading.campaign ? "⏳" : "🎯"} Campaign
            </button>
            <button className="btn-secondary whitespace-nowrap" onClick={handleQuickImage} disabled={loading.image}>
              {loading.image ? "⏳" : "🎨"} Image
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Quick Actions + Job Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-2">
            <QuickAction icon="🎯" label="Create Campaign" description="Full AI-powered marketing campaign" onClick={handleQuickCampaign} loading={loading.campaign} />
            <QuickAction icon="🎨" label="Generate Images" description="AI product or design images" onClick={handleQuickImage} loading={loading.image} />
            <QuickAction icon="📝" label="Write Content" description="Blog posts, social media, ad copy" onClick={() => window.location.href = "/content"} />
            <QuickAction icon="📧" label="Email Outreach" description="AI-powered email campaign management" onClick={() => window.location.href = "/email"} />
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent Jobs</h3>
            <a href="/jobs" className="text-xs text-indigo-400 hover:text-indigo-300">View all →</a>
          </div>
          {jobs.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              <div className="text-3xl mb-2">🚀</div>
              <div className="text-sm">No jobs yet — start a campaign above!</div>
            </div>
          ) : (
            <div>{jobs.map((job) => <JobRow key={String(job.id)} job={job} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
