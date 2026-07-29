"use client";
export default function WorkflowsPage() {
  const workflows = [
    { name: "Full Campaign Pipeline", steps: ["Generate Images", "Create Social Posts", "Write Email Sequence", "Find Contacts"], status: "ready", icon: "🎯" },
    { name: "Product Launch", steps: ["Product Design", "Campaign Strategy", "Content Calendar", "Email Outreach"], status: "ready", icon: "🚀" },
    { name: "Content Machine", steps: ["Blog Post", "Social Media Adaptation", "Email Newsletter"], status: "ready", icon: "📝" },
    { name: "Influencer Outreach", steps: ["Find Contacts", "Draft Pitch Email", "Follow-up Sequence"], status: "ready", icon: "🤝" },
  ];
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>🔧 Workflows</h2>
        <p className="text-slate-500 text-sm mt-1">Multi-step AI automation pipelines</p>
      </div>
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8" }}
      >
        ⚡ Workflow builder is in active development. Use the pre-built templates below or combine tools manually.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((w, i) => (
          <div key={i} className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{w.icon}</span>
                <span className="text-sm font-semibold text-slate-200">{w.name}</span>
              </div>
              <span className="badge badge-success">Ready</span>
            </div>
            <div className="space-y-1.5">
              {w.steps.map((step, j) => (
                <div key={j} className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", fontSize: "0.6rem", fontWeight: 700 }}>
                    {j + 1}
                  </div>
                  {step}
                </div>
              ))}
            </div>
            <button className="btn-primary text-xs w-full justify-center py-2">▶ Run Workflow</button>
          </div>
        ))}
      </div>
    </div>
  );
}
