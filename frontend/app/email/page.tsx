"use client";
import { useState } from "react";
import { generateContent, pollJob } from "@/lib/api";

const EMAIL_TYPES = ["Promotional", "Welcome Series", "Abandoned Cart", "Re-engagement", "Newsletter", "Cold Outreach"];

export default function EmailPage() {
  const [form, setForm] = useState({ subject: "", recipient_name: "", product_info: "", tone: "Professional", email_type: "Promotional" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!form.subject.trim()) return;
    setStatus("loading"); setProgress(0); setError(""); setOutput("");
    const topic = `${form.email_type} email. Subject: "${form.subject}". Product: ${form.product_info || "our product"}. Recipient: ${form.recipient_name || "valued customer"}. Tone: ${form.tone}.`;
    try {
      const { job_id } = await generateContent({ topic, content_type: "email", tone: form.tone, word_count: 300 });
      const job = await pollJob(job_id, (j) => setProgress(Number(j.progress ?? 0)));
      const result = job.result as { content?: string };
      setOutput(result?.content ?? ""); setStatus("done");
    } catch (e: unknown) { setError((e as Error).message); setStatus("error"); }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>💌 Email Outreach</h2>
        <p className="text-slate-500 text-sm mt-1">AI-crafted email campaigns that convert</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email Subject *</label>
            <input type="text" className="input-field" placeholder="e.g., Exclusive offer just for you 🎁" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email Type</label>
            <select className="input-field" value={form.email_type} onChange={(e) => setForm((f) => ({ ...f, email_type: e.target.value }))}>
              {EMAIL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Recipient Name</label>
            <input type="text" className="input-field" placeholder="e.g., Sarah" value={form.recipient_name} onChange={(e) => setForm((f) => ({ ...f, recipient_name: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Product / Offer Info</label>
            <textarea className="input-field" rows={3} placeholder="Describe what you're promoting..." value={form.product_info} onChange={(e) => setForm((f) => ({ ...f, product_info: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Tone</label>
            <select className="input-field" value={form.tone} onChange={(e) => setForm((f) => ({ ...f, tone: e.target.value }))}>
              {["Professional", "Friendly", "Urgent", "Luxury", "Casual"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button className="btn-primary w-full justify-center py-2.5" onClick={handleGenerate} disabled={status === "loading" || !form.subject.trim()}>
            {status === "loading" ? `⏳ ${progress}%` : "💌 Generate Email"}
          </button>
        </div>
        <div className="glass-card p-5">
          {status === "idle" && <div className="flex flex-col items-center justify-center h-64 text-slate-600"><div className="text-5xl mb-3">💌</div><div className="text-sm">Your email will appear here</div></div>}
          {status === "loading" && <div className="space-y-3"><div className="progress-bar mb-4"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>{[...Array(10)].map((_, i) => <div key={i} className="skeleton h-4 rounded" style={{ width: `${50 + i * 5}%` }} />)}</div>}
          {status === "error" && <div className="text-red-400 text-sm p-3 bg-red-950/20 rounded-lg">❌ {error}</div>}
          {status === "done" && (
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-emerald-400">✅ Email ready!</span><button className="btn-secondary text-xs" onClick={() => navigator.clipboard.writeText(output)}>📋 Copy</button></div>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap p-4 rounded-lg max-h-[420px] overflow-y-auto" style={{ background: "rgba(0,0,0,0.25)" }}>{output}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
