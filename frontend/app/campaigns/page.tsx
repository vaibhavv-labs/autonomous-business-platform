"use client";
import { useState, useEffect } from "react";
import { generateCampaign, pollJob, getDBCampaigns, createDBCampaign, deleteDBCampaign, DBCampaign } from "@/lib/api";

interface CampaignResult {
  strategy?: string;
  social_posts?: string;
  email?: string;
  metadata?: Record<string, unknown>;
}

const PLATFORMS = ["Instagram", "Facebook", "TikTok", "LinkedIn", "YouTube", "Twitter"];
const GOALS = ["Brand Awareness", "Lead Generation", "Sales Conversion", "Engagement", "Product Launch", "Retargeting"];
const TONES = ["Professional", "Playful", "Inspirational", "Bold", "Educational", "Luxury", "Conversational"];

function ResultSection({ title, icon, content }: { title: string; icon: string; content: string }) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-semibold text-slate-200 flex items-center gap-2">
          <span>{icon}</span> {title}
        </span>
        <span className="text-slate-500 text-sm">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <div
            className="text-sm text-slate-300 leading-relaxed rounded-lg p-4 whitespace-pre-wrap"
            style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            {content}
          </div>
          <button className="btn-secondary mt-3 text-xs" onClick={handleCopy}>
            {copied ? "✅ Copied!" : "📋 Copy Content"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState<"creator" | "history">("creator");

  const [form, setForm] = useState({
    product_description: "",
    target_audience: "",
    budget: 5000,
    platforms: ["Instagram", "Facebook"] as string[],
    campaign_goal: "Brand Awareness",
    campaign_tone: "Professional",
    competitor_info: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [error, setError] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  // History State
  const [history, setHistory] = useState<DBCampaign[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [savingCamp, setSavingCamp] = useState(false);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await getDBCampaigns();
      let fetched = data.campaigns || [];
      const local = typeof window !== "undefined" ? localStorage.getItem("abp_campaigns") : null;
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const ids = new Set(fetched.map((c: any) => c.id));
            for (const item of parsed) {
              if (!ids.has(item.id)) fetched.unshift(item);
            }
          }
        } catch {}
      }
      setHistory(fetched);
      if (typeof window !== "undefined") localStorage.setItem("abp_campaigns", JSON.stringify(fetched));
    } catch (err) {
      console.error("Failed to load history:", err);
      const local = typeof window !== "undefined" ? localStorage.getItem("abp_campaigns") : null;
      if (local) {
        try { setHistory(JSON.parse(local)); } catch {}
      }
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [activeTab]);

  const togglePlatform = (p: string) => {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p)
        ? f.platforms.filter((x) => x !== p)
        : [...f.platforms, p],
    }));
  };

  const handleGenerate = async () => {
    if (!form.product_description.trim()) return;
    setStatus("loading");
    setProgress(0);
    setError("");
    setSaveMsg("");
    setResult(null);
    try {
      const { job_id } = await generateCampaign(form);
      const job = await pollJob(job_id, (j) => setProgress(Number(j.progress ?? 0)));
      setResult(job.result as CampaignResult);
      setStatus("done");
    } catch (e: unknown) {
      setError((e as Error).message);
      setStatus("error");
    }
  };

  const handleSaveToDB = async () => {
    if (!result) return;
    try {
      setSavingCamp(true);
      const campName = `Campaign - ${form.product_description.slice(0, 30)}...`;
      const newCamp: DBCampaign = {
        id: "camp_" + Math.random().toString(36).substring(2, 9),
        name: campName,
        product: form.product_description,
        audience: form.target_audience,
        budget: form.budget,
        platforms: form.platforms,
        goal: form.campaign_goal,
        tone: form.campaign_tone,
        strategy: result.strategy || "",
        social_posts: result.social_posts || "",
        email: result.email || "",
        created_at: new Date().toISOString(),
      };

      createDBCampaign(newCamp).catch(() => {});

      setHistory((prev) => {
        const next = [newCamp, ...prev];
        if (typeof window !== "undefined") localStorage.setItem("abp_campaigns", JSON.stringify(next));
        return next;
      });

      setSaveMsg("Campaign saved to Database History! ✅");
    } catch (err: unknown) {
      setError("Save failed: " + (err as Error).message);
    } finally {
      setSavingCamp(false);
    }
  };

  const handleDeleteHistory = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" from database history?`)) return;
    deleteDBCampaign(id).catch(() => {});
    setHistory((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (typeof window !== "undefined") localStorage.setItem("abp_campaigns", JSON.stringify(next));
      return next;
    });
  };

  const handleLoadHistoryItem = (c: DBCampaign) => {
    setResult({
      strategy: c.strategy,
      social_posts: c.social_posts,
      email: c.email,
      metadata: { product: c.product, audience: c.audience, budget: c.budget, goal: c.goal },
    });
    setActiveTab("creator");
    setStatus("done");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>
            🎯 Campaign Creator & History
          </h2>
          <p className="text-slate-500 text-sm mt-1">Multi-channel AI campaign strategy, copy & persistent history</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("creator")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "creator" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🎯 Campaign Creator
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "history" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            💾 Saved History ({history.length})
          </button>
        </div>
      </div>

      {/* ── TAB 1: CREATOR ── */}
      {activeTab === "creator" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Campaign Input</h3>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Product / Service *</label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="e.g., AI-powered noise canceling headphones for remote workers"
                  value={form.product_description}
                  onChange={(e) => setForm((f) => ({ ...f, product_description: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Target Audience</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Remote professionals 25-45"
                  value={form.target_audience}
                  onChange={(e) => setForm((f) => ({ ...f, target_audience: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-2 block">Platforms</label>
                <div className="flex flex-wrap gap-1.5">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        form.platforms.includes(p)
                          ? "bg-indigo-600/30 border-indigo-500 text-indigo-300 font-semibold"
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Goal</label>
                  <select
                    className="input-field"
                    value={form.campaign_goal}
                    onChange={(e) => setForm((f) => ({ ...f, campaign_goal: e.target.value }))}
                  >
                    {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Tone</label>
                  <select
                    className="input-field"
                    value={form.campaign_tone}
                    onChange={(e) => setForm((f) => ({ ...f, campaign_tone: e.target.value }))}
                  >
                    {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <button
                className="btn-primary w-full justify-center py-2.5"
                onClick={handleGenerate}
                disabled={status === "loading" || !form.product_description.trim()}
              >
                {status === "loading" ? `🚀 Generating ${progress}%` : "🚀 Launch AI Campaign"}
              </button>

              {saveMsg && <div className="text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded border border-emerald-500/20">{saveMsg}</div>}
              {error && <div className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded border border-rose-500/20">{error}</div>}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {status === "loading" && (
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-300">🤖 AI Crafting Campaign Strategy & Copy...</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="space-y-3">
                  <div className="skeleton h-16 rounded-xl" />
                  <div className="skeleton h-24 rounded-xl" />
                  <div className="skeleton h-20 rounded-xl" />
                </div>
              </div>
            )}

            {status === "idle" && (
              <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center space-y-2">
                <span className="text-6xl mb-2">🎯</span>
                <div className="text-slate-300 font-semibold">Your AI Campaign Strategy Will Appear Here</div>
                <p className="text-xs text-slate-500">Fill in product details on the left and click "Launch AI Campaign".</p>
              </div>
            )}

            {status === "done" && result && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
                  <span className="text-sm font-semibold text-indigo-300">🎉 AI Campaign Generated Successfully!</span>
                  <button onClick={handleSaveToDB} disabled={savingCamp} className="btn-primary text-xs">
                    {savingCamp ? "Saving..." : "💾 Save Campaign to DB"}
                  </button>
                </div>

                {result.strategy && <ResultSection title="Campaign Strategy & Timeline" icon="📊" content={result.strategy} />}
                {result.social_posts && <ResultSection title="Social Media Posts" icon="📱" content={result.social_posts} />}
                {result.email && <ResultSection title="High-Converting Email Copy" icon="✉️" content={result.email} />}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: SAVED HISTORY ── */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {loadingHistory ? (
            <div className="glass-card p-8 text-center text-slate-400">Loading campaign history from database...</div>
          ) : history.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-500 space-y-2">
              <span className="text-4xl block mb-2">💾</span>
              <div className="font-semibold text-slate-300">No Saved Campaigns Yet</div>
              <p className="text-xs text-slate-500">Generate a campaign in Creator tab and click "Save Campaign to DB".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item) => (
                <div key={item.id} className="glass-card p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-slate-100 text-base">{item.name}</div>
                      <span className="badge badge-primary">{item.goal || "Campaign"}</span>
                    </div>
                    <div className="text-xs text-slate-400"><strong>Product:</strong> {item.product}</div>
                    <div className="text-xs text-slate-500">
                      <strong>Budget:</strong> ${item.budget} | <strong>Tone:</strong> {item.tone}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleLoadHistoryItem(item)}
                      className="btn-primary text-xs px-3 py-1"
                    >
                      👁 View & Load Campaign
                    </button>
                    <button
                      onClick={() => handleDeleteHistory(item.id, item.name)}
                      className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
