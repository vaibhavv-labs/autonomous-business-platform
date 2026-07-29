"use client";
import { useState } from "react";
import { generateCampaign, pollJob } from "@/lib/api";

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
          <button
            className="btn-secondary mt-3 text-xs"
            onClick={() => navigator.clipboard.writeText(content)}
          >
            📋 Copy
          </button>
        </div>
      )}
    </div>
  );
}

export default function CampaignsPage() {
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
  const [statusMsg, setStatusMsg] = useState("");
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [error, setError] = useState("");

  const togglePlatform = (p: string) => {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p)
        ? f.platforms.filter((x) => x !== p)
        : [...f.platforms, p],
    }));
  };

  const handleSubmit = async () => {
    if (!form.product_description.trim()) return;
    setStatus("loading");
    setProgress(0);
    setError("");
    setResult(null);
    try {
      const { job_id } = await generateCampaign(form);
      const job = await pollJob(job_id, (j) => {
        setProgress(Number(j.progress ?? 0));
        const logs = j.logs as string[] | undefined;
        if (logs && logs.length > 0) setStatusMsg(logs[logs.length - 1]);
      });
      setResult(job.result as CampaignResult);
      setStatus("done");
    } catch (e: unknown) {
      setError((e as Error).message);
      setStatus("error");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>
          🎯 Campaign Creator
        </h2>
        <p className="text-slate-500 text-sm mt-1">AI-powered full marketing campaign — strategy, posts, email</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Campaign Setup</h3>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Product / Service *</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Describe what you're selling..."
                value={form.product_description}
                onChange={(e) => setForm((f) => ({ ...f, product_description: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Target Audience</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Pet owners aged 25-45"
                value={form.target_audience}
                onChange={(e) => setForm((f) => ({ ...f, target_audience: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Budget (USD)</label>
              <input
                type="number"
                className="input-field"
                min={100}
                value={form.budget}
                onChange={(e) => setForm((f) => ({ ...f, budget: Number(e.target.value) }))}
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-2 block">Platforms</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      form.platforms.includes(p) ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Campaign Goal</label>
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

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Competitor Info (optional)</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Nike, Adidas"
                value={form.competitor_info}
                onChange={(e) => setForm((f) => ({ ...f, competitor_info: e.target.value }))}
              />
            </div>

            <button
              className="btn-primary w-full justify-center py-2.5"
              onClick={handleSubmit}
              disabled={status === "loading" || !form.product_description.trim()}
            >
              {status === "loading" ? "⏳ Generating..." : "🚀 Generate Campaign"}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {status === "loading" && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-300">⚡ AI Working...</h3>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{statusMsg || "Initializing AI agents..."}</span>
                <span>{progress}%</span>
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-5 rounded" style={{ width: `${70 + i * 10}%` }} />
              ))}
            </div>
          )}

          {status === "error" && (
            <div
              className="glass-card p-5 text-sm"
              style={{ borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }}
            >
              ❌ {error}
            </div>
          )}

          {status === "idle" && (
            <div className="glass-card p-12 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <div className="text-slate-400 font-medium">Fill the form and generate your campaign</div>
              <div className="text-slate-600 text-sm mt-1">AI will create strategy, social posts & email sequence</div>
            </div>
          )}

          {status === "done" && result && (
            <>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" }}
              >
                ✅ Campaign generated successfully!
              </div>
              {result.strategy && (
                <ResultSection title="Marketing Strategy" icon="📋" content={result.strategy} />
              )}
              {result.social_posts && (
                <ResultSection title="Social Media Posts" icon="📱" content={result.social_posts} />
              )}
              {result.email && (
                <ResultSection title="Email Sequence" icon="💌" content={result.email} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
