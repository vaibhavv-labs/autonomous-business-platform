"use client";
import { useState, useEffect, useCallback } from "react";
import { getJobs, cancelJob } from "@/lib/api";

const STATUS_COLORS: Record<string, string> = {
  completed: "badge-success",
  running: "badge-primary",
  failed: "badge-danger",
  queued: "badge-warning",
  cancelled: "badge-warning",
};

const STATUS_ICONS: Record<string, string> = {
  completed: "✅",
  running: "⚡",
  failed: "❌",
  queued: "⏳",
  cancelled: "🚫",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Record<string, unknown> | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const params = filter !== "all" ? { status: filter } : {};
      const res = await getJobs({ ...params, limit: 100 });
      setJobs(res.jobs || []);
    } catch {}
  }, [filter]);

  useEffect(() => {
    fetchJobs();
    const iv = setInterval(fetchJobs, 2000);
    return () => clearInterval(iv);
  }, [fetchJobs]);

  const handleCancel = async (jobId: string) => {
    setCancelling(jobId);
    try {
      await cancelJob(jobId);
      fetchJobs();
    } catch {}
    setCancelling(null);
  };

  const filterOptions = ["all", "queued", "running", "completed", "failed", "cancelled"];
  const jobCount = (status: string) =>
    status === "all" ? jobs.length : jobs.filter((j) => j.status === status).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>
            🔄 Job Monitor
          </h2>
          <p className="text-slate-500 text-sm mt-1">Real-time background task tracking</p>
        </div>
        <button className="btn-secondary text-sm" onClick={fetchJobs}>↻ Refresh</button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === s ? "btn-primary" : "btn-secondary"
            }`}
          >
            {STATUS_ICONS[s] || "📋"} {s.charAt(0).toUpperCase() + s.slice(1)} ({jobCount(s)})
          </button>
        ))}
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job List */}
        <div className="lg:col-span-2 space-y-2">
          {jobs.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-5xl mb-4">🔄</div>
              <div className="text-slate-400 font-medium">No jobs found</div>
              <div className="text-slate-600 text-sm mt-1">Start a campaign or generate content to see jobs here</div>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={String(job.id)}
                className={`glass-card p-4 cursor-pointer transition-all ${
                  selectedJob?.id === job.id ? "border-indigo-500/40" : ""
                }`}
                style={selectedJob?.id === job.id ? { borderColor: "rgba(99,102,241,0.4)" } : {}}
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{STATUS_ICONS[String(job.status)] || "📋"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-200 truncate flex-1">
                        {String(job.description || "")}
                      </span>
                      <span className={`badge ${STATUS_COLORS[String(job.status)] || "badge-warning"} flex-shrink-0`}>
                        {String(job.status || "")}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {String(job.type || "").replace(/_/g, " ")} · {String(job.created_at || "").split("T")[0]}
                    </div>
                    {job.status === "running" && (
                      <div className="mt-2 progress-bar">
                        <div className="progress-fill" style={{ width: `${Number(job.progress || 0)}%` }} />
                      </div>
                    )}
                  </div>
                  {(job.status === "queued" || job.status === "running") && (
                    <button
                      className="btn-secondary text-xs px-2 py-1 flex-shrink-0"
                      style={{ color: "#f87171", borderColor: "rgba(239,68,68,0.3)" }}
                      onClick={(e) => { e.stopPropagation(); handleCancel(String(job.id)); }}
                      disabled={cancelling === String(job.id)}
                    >
                      {cancelling === String(job.id) ? "..." : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="glass-card p-5">
          {selectedJob ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                {STATUS_ICONS[String(selectedJob.status)]} Job Details
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">ID</div>
                  <div className="text-xs font-mono text-slate-400 break-all">{String(selectedJob.id)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Type</div>
                  <div className="text-sm text-slate-300">{String(selectedJob.type || "").replace(/_/g, " ")}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</div>
                  <span className={`badge ${STATUS_COLORS[String(selectedJob.status)]}`}>{String(selectedJob.status)}</span>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Progress</div>
                  <div className="flex items-center gap-2">
                    <div className="progress-bar flex-1">
                      <div className="progress-fill" style={{ width: `${Number(selectedJob.progress || 0)}%` }} />
                    </div>
                    <span className="text-xs text-slate-400">{Number(selectedJob.progress || 0).toFixed(0)}%</span>
                  </div>
                </div>
                {selectedJob.error != null && (
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Error</div>
                    <div className="text-xs text-red-400 bg-red-950/20 p-2 rounded-lg border border-red-900/30">
                      {String(selectedJob.error)}
                    </div>
                  </div>
                )}
                {selectedJob.result != null && (
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Result Preview</div>
                    <div className="text-xs text-slate-400 bg-black/20 p-2 rounded-lg border border-white/5 max-h-48 overflow-y-auto">
                      <pre className="whitespace-pre-wrap break-words">
                        {JSON.stringify(selectedJob.result, null, 2).slice(0, 800)}
                        {JSON.stringify(selectedJob.result, null, 2).length > 800 ? "..." : ""}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">👈</div>
              <div className="text-slate-500 text-sm">Select a job to see details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
