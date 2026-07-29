"use client";
import { useState } from "react";
import { generateContent, pollJob } from "@/lib/api";

const PRODUCT_TYPES = ["E-book", "Online Course", "Template Pack", "Preset Pack", "Stock Photos", "Digital Art", "Software Tool", "Membership"];

export default function DigitalPage() {
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("E-book");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(27);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const products = [
    { name: "Social Media Mastery E-Book", type: "E-book", price: "$27", sales: 142, icon: "📘" },
    { name: "Canva Template Bundle", type: "Template Pack", price: "$47", sales: 89, icon: "🎨" },
    { name: "Product Photography Presets", type: "Preset Pack", price: "$19", sales: 237, icon: "📸" },
  ];

  const handleGenerate = async () => {
    if (!productName.trim()) return;
    setStatus("loading"); setProgress(0); setError(""); setOutput("");
    const topic = `Complete product description, sales page copy, and marketing strategy for a ${productType} called "${productName}". Description: ${description}. Price: $${price}.`;
    try {
      const { job_id } = await generateContent({ topic, content_type: "ad_copy", tone: "Professional", word_count: 500 });
      const job = await pollJob(job_id, (j) => setProgress(Number(j.progress ?? 0)));
      const result = job.result as { content?: string };
      setOutput(result?.content ?? ""); setStatus("done");
    } catch (e: unknown) { setError((e as Error).message); setStatus("error"); }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>💾 Digital Products</h2>
        <p className="text-slate-500 text-sm mt-1">Create and sell digital products with AI</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p, i) => (
          <div key={i} className="glass-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{p.icon}</span>
              <span className="badge badge-success">{p.price}</span>
            </div>
            <div className="text-sm font-medium text-slate-200">{p.name}</div>
            <div className="text-xs text-slate-500">{p.type}</div>
            <div className="text-xs text-indigo-400">{p.sales} sales</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Create New Product</h3>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Product Name *</label>
            <input type="text" className="input-field" placeholder="e.g., Ultimate Freelancer Toolkit" value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Product Type</label>
            <select className="input-field" value={productType} onChange={(e) => setProductType(e.target.value)}>
              {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Description</label>
            <textarea className="input-field" rows={2} placeholder="What value does it provide?" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Price: <span className="text-indigo-400 font-bold">${price}</span></label>
            <input type="range" min={5} max={497} step={2} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-indigo-500" />
          </div>
          <button className="btn-primary w-full justify-center py-2.5" onClick={handleGenerate} disabled={status === "loading" || !productName.trim()}>
            {status === "loading" ? `⏳ ${progress}%` : "✨ Generate Sales Copy"}
          </button>
        </div>
        <div className="glass-card p-5">
          {status === "idle" && <div className="flex flex-col items-center justify-center h-48 text-slate-600"><div className="text-4xl mb-2">💾</div><div className="text-sm">Sales copy will appear here</div></div>}
          {status === "loading" && <div className="space-y-2"><div className="progress-bar mb-3"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>{[...Array(8)].map((_, i) => <div key={i} className="skeleton h-4 rounded" style={{ width: `${55 + i * 5}%` }} />)}</div>}
          {status === "error" && <div className="text-red-400 text-sm">{error}</div>}
          {status === "done" && <div className="space-y-3"><div className="flex justify-between"><span className="text-emerald-400 text-sm">✅ Done!</span><button className="btn-secondary text-xs" onClick={() => navigator.clipboard.writeText(output)}>📋 Copy</button></div><div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.25)" }}>{output}</div></div>}
        </div>
      </div>
    </div>
  );
}
