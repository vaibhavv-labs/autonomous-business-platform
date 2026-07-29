"use client";
import { useState } from "react";
import { generateImage, pollJob } from "@/lib/api";

const STYLES = ["Minimalist", "Vintage", "Abstract", "Watercolor", "Bold", "Cyberpunk", "Kawaii", "Photorealistic", "Geometric"];
const COLORS = ["Vibrant", "Pastel", "Monochrome", "Earth Tones", "Neon", "Ocean Blues", "Sunset Warm"];
const SIZES = [512, 768, 1024];

export default function ProductsPage() {
  const [form, setForm] = useState({
    prompt: "",
    style: "Minimalist",
    color_palette: "Vibrant",
    width: 1024,
    height: 1024,
    num_outputs: 2,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!form.prompt.trim()) return;
    setStatus("loading");
    setProgress(0);
    setError("");
    setImages([]);
    try {
      const payload = {
        prompt: form.prompt,
        style: form.style,
        color_palette: form.color_palette,
        width: form.width,
        height: form.height,
        num_outputs: form.num_outputs,
      };
      const { job_id } = await generateImage(payload);
      const job = await pollJob(job_id, (j) => setProgress(Number(j.progress ?? 0)));
      const result = job.result as { images?: string[] };
      setImages(result?.images ?? []);
      setStatus("done");
    } catch (e: unknown) {
      setError((e as Error).message);
      setStatus("error");
    }
  };

  const handleDownload = (url: string, idx: number) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `abp-design-${idx + 1}.png`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>
          📦 Product Studio
        </h2>
        <p className="text-slate-500 text-sm mt-1">Generate AI product designs & artwork with Flux</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1">
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Design Settings</h3>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Image Prompt *</label>
              <textarea
                className="input-field"
                rows={4}
                placeholder="e.g., Cute husky dog wearing sunglasses, illustration style, t-shirt design"
                value={form.prompt}
                onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-2 block">Style</label>
              <div className="flex flex-wrap gap-1.5">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, style: s }))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      form.style === s ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-2 block">Color Palette</label>
              <select
                className="input-field"
                value={form.color_palette}
                onChange={(e) => setForm((f) => ({ ...f, color_palette: e.target.value }))}
              >
                {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Width</label>
                <select
                  className="input-field"
                  value={form.width}
                  onChange={(e) => setForm((f) => ({ ...f, width: Number(e.target.value) }))}
                >
                  {SIZES.map((s) => <option key={s} value={s}>{s}px</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Height</label>
                <select
                  className="input-field"
                  value={form.height}
                  onChange={(e) => setForm((f) => ({ ...f, height: Number(e.target.value) }))}
                >
                  {SIZES.map((s) => <option key={s} value={s}>{s}px</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                Number of Images: <span className="text-indigo-400 font-bold">{form.num_outputs}</span>
              </label>
              <input
                type="range"
                min={1}
                max={4}
                value={form.num_outputs}
                onChange={(e) => setForm((f) => ({ ...f, num_outputs: Number(e.target.value) }))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>1</span><span>2</span><span>3</span><span>4</span>
              </div>
            </div>

            <button
              className="btn-primary w-full justify-center py-2.5"
              onClick={handleGenerate}
              disabled={status === "loading" || !form.prompt.trim()}
            >
              {status === "loading" ? `⏳ ${progress}%` : "✨ Generate Images"}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-2">
          {status === "loading" && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-300">🎨 AI Rendering...</h3>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(form.num_outputs)].map((_, i) => (
                  <div key={i} className="skeleton rounded-xl" style={{ aspectRatio: `${form.width}/${form.height}`, minHeight: 180 }} />
                ))}
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="glass-card p-5 text-sm" style={{ borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }}>
              ❌ {error}
            </div>
          )}

          {status === "idle" && (
            <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">🎨</div>
              <div className="text-slate-400 font-medium">Your designs will appear here</div>
              <div className="text-slate-600 text-sm mt-1">Powered by Flux AI — 1024×1024 by default</div>
            </div>
          )}

          {status === "done" && images.length > 0 && (
            <div className="space-y-4">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" }}
              >
                ✅ {images.length} image{images.length > 1 ? "s" : ""} generated! (Loading from Flux AI...)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {images.map((url, i) => (
                  <div key={i} className="glass-card overflow-hidden group">
                    <div className="relative" style={{ minHeight: 200, background: "rgba(0,0,0,0.3)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Generated design ${i + 1}`}
                        className="w-full object-cover"
                        style={{ maxHeight: 360, display: "block" }}
                        onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = "1"; }}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = "none";
                          const parent = img.parentElement!;
                          if (!parent.querySelector(".img-fallback")) {
                            const div = document.createElement("div");
                            div.className = "img-fallback";
                            div.style.cssText = "padding:20px;text-align:center;color:#94a3b8;font-size:13px;";
                            div.innerHTML = `<div style="font-size:32px;margin-bottom:8px">🎨</div><div>Image generated! Click <strong>👁 View</strong> to open it</div><div style="margin-top:8px;word-break:break-all;font-size:10px;color:#64748b">${url.slice(0, 80)}...</div>`;
                            parent.appendChild(div);
                          }
                        }}
                      />
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Design #{i + 1}</span>
                      <div className="flex gap-2">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs px-2 py-1">
                          👁 View Full
                        </a>
                        <button
                          className="btn-primary text-xs px-2 py-1"
                          onClick={() => handleDownload(url, i)}
                        >
                          ⬇ Save
                        </button>
                      </div>
                    </div>
                    {/* Always show direct URL */}
                    <div className="px-3 pb-3">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 break-all underline"
                      >
                        🔗 Open image in new tab →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {status === "done" && images.length === 0 && (
            <div className="glass-card p-6 text-center text-yellow-400 text-sm">
              ⚠️ Job completed but no images returned. Try again with a different prompt.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
