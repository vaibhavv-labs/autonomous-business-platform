"use client";
import { useState } from "react";
import { generateContent, pollJob } from "@/lib/api";

const CONTENT_TYPES = [
  { value: "blog_post", label: "📝 Blog Post", desc: "SEO-optimized long-form content" },
  { value: "social_media", label: "📱 Social Media", desc: "Platform-ready posts with hashtags" },
  { value: "email", label: "💌 Email", desc: "Subject, preview & body copy" },
  { value: "ad_copy", label: "🎯 Ad Copy", desc: "Headlines and descriptions for ads" },
];
const TONES = ["Professional", "Playful", "Inspirational", "Educational", "Bold", "Conversational", "Luxury"];

export default function ContentPage() {
  const [form, setForm] = useState({
    topic: "",
    content_type: "blog_post",
    tone: "Professional",
    target_audience: "",
    keywords: "",
    word_count: 600,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!form.topic.trim()) return;
    setStatus("loading");
    setProgress(0);
    setError("");
    setContent("");
    try {
      const payload = {
        topic: form.topic,
        content_type: form.content_type,
        tone: form.tone,
        target_audience: form.target_audience,
        keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        word_count: form.word_count,
      };
      const { job_id } = await generateContent(payload);
      const job = await pollJob(job_id, (j) => setProgress(Number(j.progress ?? 0)));
      const result = job.result as { content?: string };
      setContent(result?.content ?? "");
      setStatus("done");
    } catch (e: unknown) {
      setError((e as Error).message);
      setStatus("error");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedType = CONTENT_TYPES.find((t) => t.value === form.content_type);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>
          📝 Content Generator
        </h2>
        <p className="text-slate-500 text-sm mt-1">AI-powered blogs, social posts, emails & ad copy</p>
      </div>

      {/* Content Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CONTENT_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setForm((f) => ({ ...f, content_type: type.value }))}
            className={`glass-card p-3 text-left transition-all ${
              form.content_type === type.value ? "" : "opacity-60 hover:opacity-100"
            }`}
            style={
              form.content_type === type.value
                ? { borderColor: "rgba(99,102,241,0.5)", boxShadow: "0 0 16px rgba(99,102,241,0.15)" }
                : {}
            }
          >
            <div className="text-sm font-medium text-slate-200">{type.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{type.desc}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              {selectedType?.label} Settings
            </h3>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Topic / Subject *</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Why electric bikes are the future"
                value={form.topic}
                onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Tone</label>
              <select
                className="input-field"
                value={form.tone}
                onChange={(e) => setForm((f) => ({ ...f, tone: e.target.value }))}
              >
                {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Target Audience</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Tech-savvy commuters"
                value={form.target_audience}
                onChange={(e) => setForm((f) => ({ ...f, target_audience: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Keywords (comma-separated)</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., eco-friendly, sustainable, commute"
                value={form.keywords}
                onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
              />
            </div>

            {form.content_type === "blog_post" && (
              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Word Count: <span className="text-indigo-400 font-bold">{form.word_count}</span>
                </label>
                <input
                  type="range"
                  min={100}
                  max={2000}
                  step={100}
                  value={form.word_count}
                  onChange={(e) => setForm((f) => ({ ...f, word_count: Number(e.target.value) }))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>100</span><span>2000</span>
                </div>
              </div>
            )}

            <button
              className="btn-primary w-full justify-center py-2.5"
              onClick={handleGenerate}
              disabled={status === "loading" || !form.topic.trim()}
            >
              {status === "loading" ? `⏳ ${progress}%` : "✍️ Generate Content"}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-2">
          {status === "loading" && (
            <div className="glass-card p-6 space-y-3">
              <h3 className="text-sm font-semibold text-slate-300">✍️ Writing with AI...</h3>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="glass-card p-5 text-sm" style={{ borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }}>
              ❌ {error}
            </div>
          )}

          {status === "idle" && (
            <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">✍️</div>
              <div className="text-slate-400 font-medium">Your content will appear here</div>
              <div className="text-slate-600 text-sm mt-1">Fill in the details and hit Generate</div>
            </div>
          )}

          {status === "done" && content && (
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "#34d399" }}
                >
                  ✅ {selectedType?.label} ready!
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary text-xs" onClick={handleCopy}>
                    {copied ? "✅ Copied!" : "📋 Copy All"}
                  </button>
                  <button
                    className="btn-secondary text-xs"
                    onClick={() => {
                      const blob = new Blob([content], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${form.content_type}-${Date.now()}.txt`;
                      a.click();
                    }}
                  >
                    ⬇ Download
                  </button>
                </div>
              </div>
              <div
                className="text-sm text-slate-300 leading-relaxed rounded-lg p-4 whitespace-pre-wrap max-h-[600px] overflow-y-auto"
                style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                {content}
              </div>
              <div className="text-xs text-slate-600">
                ~{content.split(" ").length} words · {content.length} characters
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
