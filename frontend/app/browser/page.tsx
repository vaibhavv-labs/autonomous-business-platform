"use client";
import { useState } from "react";

export default function BrowserPage() {
  const [url, setUrl] = useState("");
  const [task, setTask] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const [log, setLog] = useState<string[]>([]);

  const handleRun = () => {
    if (!task.trim()) return;
    setStatus("running");
    setLog([]);
    const steps = [
      "🚀 Initializing browser agent...",
      `🌐 Navigating to ${url || "target URL"}...`,
      "👁 Analyzing page structure...",
      "🤖 AI agent executing task...",
      `✅ Task completed: ${task.slice(0, 50)}`,
    ];
    steps.forEach((step, i) => {
      setTimeout(() => {
        setLog((l) => [...l, step]);
        if (i === steps.length - 1) setStatus("done");
      }, i * 1200);
    });
  };

  const PRESETS = [
    { label: "Scrape product prices", url: "https://amazon.com", task: "Find top 10 selling products in the fitness category and extract names and prices" },
    { label: "Check competitor website", url: "", task: "Analyze competitor homepage, extract their value proposition and key features" },
    { label: "Find contact emails", url: "", task: "Navigate to the website, find team page and extract all contact email addresses" },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>🌐 Browser-Use</h2>
        <p className="text-slate-500 text-sm mt-1">AI agent that browses the web on your behalf</p>
      </div>
      <div
        className="px-4 py-3 rounded-xl text-sm"
        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8" }}
      >
        ⚡ Browser-Use requires <strong>ANTHROPIC_API_KEY</strong> + <strong>Playwright</strong> on your backend server.
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Task Config</h3>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Target URL (optional)</label>
            <input type="url" className="input-field" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Task Description *</label>
            <textarea className="input-field" rows={4} placeholder="e.g., Go to Amazon, search for wireless headphones, and extract the top 5 product names and prices" value={task} onChange={(e) => setTask(e.target.value)} />
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-2">Quick Presets</div>
            <div className="space-y-1.5">
              {PRESETS.map((p, i) => (
                <button key={i} className="btn-secondary text-xs w-full text-left px-3 py-2" onClick={() => { setUrl(p.url); setTask(p.task); }}>
                  📋 {p.label}
                </button>
              ))}
            </div>
          </div>
          <button className="btn-primary w-full justify-center py-2.5" onClick={handleRun} disabled={status === "running" || !task.trim()}>
            {status === "running" ? "🤖 Agent Running..." : "▶ Run Browser Agent"}
          </button>
        </div>
        <div className="glass-card p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Agent Log</h3>
          {log.length === 0 && status === "idle" && (
            <div className="flex flex-col items-center justify-center flex-1 text-slate-600">
              <div className="text-4xl mb-3">🤖</div>
              <div className="text-sm">Agent log will appear here</div>
            </div>
          )}
          <div className="space-y-2 font-mono">
            {log.map((entry, i) => (
              <div key={i} className="text-xs text-slate-300 animate-fade-in flex items-start gap-2">
                <span className="text-slate-600 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                {entry}
              </div>
            ))}
            {status === "running" && (
              <div className="flex items-center gap-2 text-xs text-indigo-400">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                Processing...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
