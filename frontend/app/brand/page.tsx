"use client";
import { useState } from "react";
import { generateContent, pollJob } from "@/lib/api";

const TEMPLATE_TYPES = [
  { id: "logo_concept", label: "Logo Concept Brief", icon: "🎨" },
  { id: "brand_guide", label: "Brand Style Guide", icon: "📐" },
  { id: "color_palette", label: "Color Palette Description", icon: "🎭" },
  { id: "tone_of_voice", label: "Tone of Voice Guide", icon: "🗣" },
  { id: "social_bio", label: "Social Media Bio", icon: "📱" },
];

export default function BrandPage() {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [values, setValues] = useState("");
  const [selectedType, setSelectedType] = useState(TEMPLATE_TYPES[0].id);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!brandName.trim()) return;
    setStatus("loading"); setProgress(0); setError(""); setOutput("");
    const topic = `${selectedType.replace(/_/g, " ")} for ${brandName} brand in the ${industry || "general"} industry. Brand values: ${values || "quality, innovation, trust"}`;
    try {
      const { job_id } = await generateContent({ topic, content_type: "blog_post", tone: "Professional", word_count: 400 });
      const job = await pollJob(job_id, (j) => setProgress(Number(j.progress ?? 0)));
      const result = job.result as { content?: string };
      setOutput(result?.content ?? "");
      setStatus("done");
    } catch (e: unknown) { setError((e as Error).message); setStatus("error"); }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>🎨 Brand Templates</h2>
        <p className="text-slate-500 text-sm mt-1">AI-generated brand identity documents</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-5 space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Brand Name *</label>
            <input type="text" className="input-field" placeholder="e.g., NovaBrew" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Industry</label>
            <input type="text" className="input-field" placeholder="e.g., Coffee & Wellness" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Brand Values</label>
            <input type="text" className="input-field" placeholder="e.g., Sustainable, artisan, bold" value={values} onChange={(e) => setValues(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Template Type</label>
            <div className="space-y-1.5">
              {TEMPLATE_TYPES.map((t) => (
                <button key={t.id} type="button" onClick={() => setSelectedType(t.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left ${selectedType === t.id ? "btn-primary" : "btn-secondary"}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
          <button className="btn-primary w-full justify-center py-2.5" onClick={handleGenerate} disabled={status === "loading" || !brandName.trim()}>
            {status === "loading" ? `⏳ ${progress}%` : "✨ Generate Template"}
          </button>
        </div>
        <div className="lg:col-span-2 glass-card p-5">
          {status === "idle" && <div className="flex flex-col items-center justify-center h-64 text-slate-600"><div className="text-5xl mb-3">🎨</div><div className="text-sm">Brand template will appear here</div></div>}
          {status === "loading" && <div className="space-y-3"><div className="progress-bar mb-4"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>{[...Array(8)].map((_, i) => <div key={i} className="skeleton h-4 rounded" style={{ width: `${60 + i * 5}%` }} />)}</div>}
          {status === "error" && <div className="text-red-400 text-sm">{error}</div>}
          {status === "done" && <div className="space-y-3"><div className="flex justify-between items-center mb-2"><span className="text-sm text-emerald-400">✅ Generated!</span><button className="btn-secondary text-xs" onClick={() => navigator.clipboard.writeText(output)}>📋 Copy</button></div><div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap p-4 rounded-lg max-h-96 overflow-y-auto" style={{ background: "rgba(0,0,0,0.25)" }}>{output}</div></div>}
        </div>
      </div>
    </div>
  );
}
