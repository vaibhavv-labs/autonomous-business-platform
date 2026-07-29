"use client";
export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>⚙️ Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Platform configuration & API keys</p>
      </div>

      <div className="glass-card p-6 space-y-5">
        <h3 className="text-base font-semibold text-slate-200">🔑 API Configuration</h3>
        <p className="text-sm text-slate-500">API keys are managed via environment variables on your backend server (Railway). Edit the Railway environment variables to update them.</p>

        {[
          { label: "Replicate API Token", env: "REPLICATE_API_TOKEN", description: "Required for all AI generation (images, video, text)", link: "https://replicate.com/account/api-tokens" },
          { label: "Anthropic API Key", env: "ANTHROPIC_API_KEY", description: "Required for Claude AI & Browser-Use features", link: "https://console.anthropic.com" },
          { label: "Printify API Token", env: "PRINTIFY_API_TOKEN", description: "Optional — for print-on-demand product publishing", link: "https://printify.com/app/account/api" },
          { label: "Shopify Access Token", env: "SHOPIFY_ACCESS_TOKEN", description: "Optional — for blog and product publishing", link: "https://shopify.dev/docs/api/admin-rest" },
        ].map(({ label, env, description, link }) => (
          <div key={env} className="flex flex-col gap-1 pb-4 border-b border-white/5 last:border-0 last:pb-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">{label}</span>
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Get key ↗</a>
            </div>
            <code className="text-xs text-slate-500 font-mono bg-black/20 px-2 py-1 rounded">{env}</code>
            <p className="text-xs text-slate-600">{description}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-base font-semibold text-slate-200">🚂 Railway Backend</h3>
        <p className="text-sm text-slate-500">Your Python FastAPI backend runs on Railway. Update the API URL below if you&apos;ve deployed it.</p>
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">API URL</label>
          <input type="text" className="input-field" placeholder="https://your-app.railway.app" defaultValue={process.env.NEXT_PUBLIC_API_URL} readOnly />
          <p className="text-xs text-slate-600 mt-1">Set NEXT_PUBLIC_API_URL in Vercel environment variables.</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-base font-semibold text-slate-200 mb-3">🌐 Vercel Deployment</h3>
        <div className="space-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="badge badge-success">✓</span>
            <span>Next.js app deployed on Vercel</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-primary">→</span>
            <span>Add NEXT_PUBLIC_API_URL as environment variable in Vercel dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-primary">→</span>
            <span>Deploy Python backend to Railway and copy URL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
