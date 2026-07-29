"use client";
import { useState, useEffect, useCallback } from "react";
import { getAnalytics, getJobs } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

interface AnalyticsData {
  total_jobs?: number;
  campaigns?: { total?: number; completed?: number };
  images?: { total?: number; completed?: number };
  videos?: { total?: number; completed?: number };
  content?: { total?: number; completed?: number };
  jobs_by_status?: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  completed: "#10b981",
  running: "#6366f1",
  failed: "#ef4444",
  queued: "#f59e0b",
  cancelled: "#64748b",
};

const STATUS_BADGE: Record<string, string> = {
  completed: "badge-success",
  running: "badge-primary",
  failed: "badge-danger",
  queued: "badge-warning",
  cancelled: "badge-warning",
};

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="glass-card p-5 flex flex-col gap-2">
      <span className="text-2xl">{icon}</span>
      <div className="text-3xl font-bold tracking-tight" style={{ color, letterSpacing: "-0.03em" }}>{value}</div>
      <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [a, j] = await Promise.all([getAnalytics(), getJobs({ limit: 50 })]);
      setAnalytics(a as AnalyticsData);
      setJobs(j.jobs || []);
    } catch {
      // silently fail on poll
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 10000);
    return () => clearInterval(iv);
  }, [fetchData]);

  const chartData = [
    { name: "Campaigns", total: analytics?.campaigns?.total ?? 0, done: analytics?.campaigns?.completed ?? 0 },
    { name: "Images", total: analytics?.images?.total ?? 0, done: analytics?.images?.completed ?? 0 },
    { name: "Videos", total: analytics?.videos?.total ?? 0, done: analytics?.videos?.completed ?? 0 },
    { name: "Content", total: analytics?.content?.total ?? 0, done: analytics?.content?.completed ?? 0 },
  ];

  const statusData = Object.entries(analytics?.jobs_by_status ?? {}).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: STATUS_COLORS[status] ?? "#64748b",
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>
          📊 Analytics
        </h2>
        <p className="text-slate-500 text-sm mt-1">Real-time platform performance metrics</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-5 space-y-3">
              <div className="skeleton h-8 w-8 rounded-lg" />
              <div className="skeleton h-8 w-16 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Jobs" value={analytics?.total_jobs ?? 0} icon="⚡" color="#818cf8" />
          <StatCard label="Completed" value={analytics?.jobs_by_status?.completed ?? 0} icon="✅" color="#10b981" />
          <StatCard label="Running" value={analytics?.jobs_by_status?.running ?? 0} icon="⚡" color="#6366f1" />
          <StatCard label="Failed" value={analytics?.jobs_by_status?.failed ?? 0} icon="❌" color="#ef4444" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart — Jobs by Type */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">Jobs by Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(22,28,45,0.95)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: 8,
                  color: "#f1f5f9",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="total" name="Total" fill="rgba(99,102,241,0.3)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="done" name="Completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut-style status breakdown */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">Status Breakdown</h3>
          {statusData.length === 0 ? (
            <div className="text-center py-12 text-slate-600">No data yet</div>
          ) : (
            <div className="space-y-3">
              {statusData.map(({ name, value, color }) => {
                const total = analytics?.total_jobs ?? 1;
                const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                return (
                  <div key={name} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-slate-400 text-right flex-shrink-0">{name}</div>
                    <div className="flex-1 progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
                    </div>
                    <div className="w-10 text-xs text-right font-mono" style={{ color }}>
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent Jobs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["Description", "Type", "Status", "Progress", "Created"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-600">
                    No jobs yet — start generating!
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr
                    key={String(job.id)}
                    className="hover:bg-white/[0.02] transition-colors"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                  >
                    <td className="px-5 py-3 text-slate-300 max-w-[200px] truncate">
                      {String(job.description ?? "")}
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">
                      {String(job.type ?? "").replace(/_/g, " ")}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`badge ${STATUS_BADGE[String(job.status)] ?? "badge-warning"}`}>
                        {String(job.status ?? "")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400">
                      {Number(job.progress ?? 0)}%
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {String(job.created_at ?? "").split("T")[0]}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
