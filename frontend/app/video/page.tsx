"use client";
import { useState } from "react";
import { generateVideo, pollJob } from "@/lib/api";

const MODELS = [
  {
    value: "kwaivgi/kling-v2.5-turbo-pro",
    label: "Kling v2.5 Pro",
    icon: "🎬",
    badge: "FAST",
    badgeColor: "#34d399",
    desc: "High-quality video, 5-15s, fast generation",
  },
  {
    value: "minimax/video-01",
    label: "MiniMax Video-01",
    icon: "🎥",
    badge: "QUALITY",
    badgeColor: "#818cf8",
    desc: "Cinematic quality, smooth motion",
  },
  {
    value: "stability-ai/stable-video-diffusion",
    label: "Stable Video",
    icon: "🎞",
    badge: "FREE",
    badgeColor: "#fbbf24",
    desc: "Open source, image-to-video",
  },
];
const DURATIONS = [5, 10, 15];
const RATIOS = ["16:9", "9:16", "1:1"];

export default function VideoPage() {
  const [form, setForm] = useState({
    prompt: "",
    model: MODELS[0].value,
    duration: 5,
    aspect_ratio: "16:9",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!form.prompt.trim()) return;
    setStatus("loading");
    setProgress(0);
    setError("");
    setVideoUrl("");
    try {
      const { job_id } = await generateVideo(form);
      const job = await pollJob(job_id, (j) => {
        setProgress(Number(j.progress ?? 0));
        const logs = j.logs as string[] | undefined;
        if (logs?.length) setStatusMsg(logs[logs.length - 1]);
      });
      const result = job.result as { video_url?: string };
      setVideoUrl(result?.video_url ?? "");
      setStatus("done");
    } catch (e: unknown) {
      setError((e as Error).message);
      setStatus("error");
    }
  };

  const selectedModel = MODELS.find((m) => m.value === form.model);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>
          🎬 Video Producer
        </h2>
        <p className="text-slate-500 text-sm mt-1">AI-generated promotional videos for your products</p>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {MODELS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setForm((f) => ({ ...f, model: m.value }))}
            className={`glass-card p-4 text-left transition-all ${
              form.model === m.value ? "" : "opacity-60 hover:opacity-100"
            }`}
            style={
              form.model === m.value
                ? { borderColor: "rgba(99,102,241,0.5)", boxShadow: "0 0 20px rgba(99,102,241,0.15)" }
                : {}
            }
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{m.icon}</span>
              <span
                className="badge text-xs"
                style={{
                  background: `${m.badgeColor}20`,
                  color: m.badgeColor,
                  border: `1px solid ${m.badgeColor}40`,
                }}
              >
                {m.badge}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-200">{m.label}</div>
            <div className="text-xs text-slate-500 mt-1">{m.desc}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Video Settings</h3>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Video Prompt *</label>
              <textarea
                className="input-field"
                rows={5}
                placeholder="e.g., A luxurious skincare product on a marble table with soft golden lighting, camera slowly zooming in..."
                value={form.prompt}
                onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-2 block">Duration</label>
              <div className="flex gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, duration: d }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      form.duration === d ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-2 block">Aspect Ratio</label>
              <div className="flex gap-2">
                {RATIOS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, aspect_ratio: r }))}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                      form.aspect_ratio === r ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="text-xs p-3 rounded-lg"
              style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", color: "#94a3b8" }}
            >
              <span className="text-indigo-400 font-semibold">Model: </span>
              {selectedModel?.label} · {form.duration}s · {form.aspect_ratio}
            </div>

            <button
              className="btn-primary w-full justify-center py-2.5"
              onClick={handleGenerate}
              disabled={status === "loading" || !form.prompt.trim()}
            >
              {status === "loading" ? `⏳ ${progress}%` : "🎬 Generate Video"}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-2">
          {status === "loading" && (
            <div className="glass-card p-8 space-y-4 text-center">
              <div className="text-4xl mb-2 animate-spin" style={{ display: "inline-block" }}>⚙️</div>
              <h3 className="text-base font-semibold text-slate-200">AI is generating your video...</h3>
              <div className="progress-bar max-w-xs mx-auto">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-sm text-slate-500">{statusMsg || "This may take 1-3 minutes"}</p>
              <p className="text-xs text-slate-600">
                ⚠️ Video generation is slow by nature — AI is rendering every frame
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="glass-card p-5 text-sm" style={{ borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }}>
              ❌ {error}
            </div>
          )}

          {status === "idle" && (
            <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
              <div className="text-7xl mb-4">🎬</div>
              <div className="text-slate-400 font-medium">Your video will appear here</div>
              <div className="text-slate-600 text-sm mt-2 max-w-xs">
                Write a cinematic prompt and the AI will render a professional video
              </div>
            </div>
          )}

          {status === "done" && videoUrl && (
            <div className="glass-card overflow-hidden space-y-4">
              <div
                className="px-4 pt-4 flex items-center gap-2 text-sm"
                style={{ color: "#34d399" }}
              >
                ✅ Video generated!
              </div>
              <div className="px-4">
                <video
                  controls
                  className="w-full rounded-xl"
                  style={{ maxHeight: 400, background: "#000" }}
                  src={videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="px-4 pb-4 flex gap-2">
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm"
                >
                  🔗 Open in new tab
                </a>
                <a
                  href={videoUrl}
                  download={`abp-video-${Date.now()}.mp4`}
                  className="btn-primary text-sm"
                >
                  ⬇ Download
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
