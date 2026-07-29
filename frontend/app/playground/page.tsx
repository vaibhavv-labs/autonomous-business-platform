"use client";
import { useState } from "react";
import { generateImage, generateContent, pollJob } from "@/lib/api";

const MODELS = [
  { id: "flux", label: "Flux Fast", type: "image", icon: "🎨", badge: "Image", desc: "Ultra-fast image generation" },
  { id: "flux-pro", label: "Flux Pro", type: "image", icon: "✨", badge: "Image", desc: "High-quality photorealistic images" },
  { id: "llama-70b", label: "LLaMA 3 70B", type: "text", icon: "🧠", badge: "Text", desc: "Powerful reasoning & writing" },
  { id: "llama-8b", label: "LLaMA 3 8B", type: "text", icon: "⚡", badge: "Text", desc: "Fast & lightweight text model" },
  { id: "kling", label: "Kling v2.5", type: "video", icon: "🎬", badge: "Video", desc: "High-quality video generation" },
];

const BADGE_COLORS: Record<string, string> = {
  Image: "#34d399",
  Text: "#818cf8",
  Video: "#fbbf24",
};

export default function PlaygroundPage() {
  const [selectedModel, setSelectedModel] = useState(MODELS[2]);
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState<{ type: string; content: string } | null>(null);
  const [error, setError] = useState("");

  const handleRun = async () => {
    if (!prompt.trim()) return;
    setStatus("loading");
    setProgress(0);
    setError("");
    setOutput(null);
    try {
      if (selectedModel.type === "image") {
        const { job_id } = await generateImage({ prompt, model: "prunaai/flux-fast", num_outputs: 1 });
        const job = await pollJob(job_id, (j) => setProgress(Number(j.progress ?? 0)));
        const result = job.result as { images?: string[] };
        const images = result?.images ?? [];
        setOutput({ type: "image", content: images[0] ?? "" });
      } else {
        const { job_id } = await generateContent({
          topic: prompt,
          content_type: "social_media",
          tone: "Professional",
          word_count: 200,
        });
        const job = await pollJob(job_id, (j) => setProgress(Number(j.progress ?? 0)));
        const result = job.result as { content?: string };
        setOutput({ type: "text", content: result?.content ?? "" });
      }
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
          🎮 AI Playground
        </h2>
        <p className="text-slate-500 text-sm mt-1">Experiment with 50+ AI models — images, text, video</p>
      </div>

      {/* Model Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {MODELS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSelectedModel(m)}
            className={`glass-card p-3 text-left transition-all ${selectedModel.id === m.id ? "" : "opacity-60 hover:opacity-100"}`}
            style={selectedModel.id === m.id ? { borderColor: "rgba(99,102,241,0.5)", boxShadow: "0 0 16px rgba(99,102,241,0.15)" } : {}}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{m.icon}</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: `${BADGE_COLORS[m.badge]}20`, color: BADGE_COLORS[m.badge], border: `1px solid ${BADGE_COLORS[m.badge]}40` }}>
                {m.badge}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-200">{m.label}</div>
            <div className="text-xs text-slate-600 mt-0.5 leading-snug">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Prompt + Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Prompt</h3>
            <span className="badge badge-primary">{selectedModel.label}</span>
          </div>
          <textarea
            className="input-field"
            rows={8}
            placeholder={
              selectedModel.type === "image"
                ? "e.g., Hyper-realistic photo of a product on a white background..."
                : "e.g., Write 5 Instagram captions for my eco-friendly brand..."
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            className="btn-primary w-full justify-center py-2.5"
            onClick={handleRun}
            disabled={status === "loading" || !prompt.trim()}
          >
            {status === "loading" ? `⏳ Running... ${progress}%` : `▶ Run ${selectedModel.label}`}
          </button>
          {status === "loading" && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Output</h3>
          {status === "idle" && (
            <div className="flex flex-col items-center justify-center h-48 text-slate-600">
              <div className="text-4xl mb-3">▶</div>
              <div className="text-sm">Run a prompt to see output</div>
            </div>
          )}
          {status === "error" && (
            <div className="text-sm text-red-400 bg-red-950/20 p-3 rounded-lg border border-red-900/30">{error}</div>
          )}
          {status === "loading" && (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-4 rounded" style={{ width: `${55 + i * 7}%` }} />
              ))}
            </div>
          )}
          {status === "done" && output && (
            <div>
              {output.type === "image" && output.content ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={output.content} alt="AI generated" className="w-full rounded-xl object-cover" style={{ maxHeight: 320 }} />
                  <a href={output.content} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs">
                    ↗ Open full size
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  <div
                    className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap rounded-lg p-3 max-h-72 overflow-y-auto"
                    style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    {output.content}
                  </div>
                  <button className="btn-secondary text-xs" onClick={() => navigator.clipboard.writeText(output.content)}>
                    📋 Copy
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
