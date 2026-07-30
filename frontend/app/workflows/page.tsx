"use client";
import { useState, useEffect } from "react";
import { getScheduledPosts, deleteScheduledPost, DBScheduledPost } from "@/lib/api";

export default function WorkflowsPage() {
  const [scheduledPosts, setScheduledPosts] = useState<DBScheduledPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const loadScheduledPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await getScheduledPosts();
      setScheduledPosts(res.scheduled_posts || []);
    } catch (err) {
      console.error("Failed to load scheduled posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const handleDeletePost = async (id: string) => {
    if (!confirm("Cancel & delete this scheduled post?")) return;
    deleteScheduledPost(id).catch(() => {});
    setScheduledPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const workflows = [
    { name: "Full Campaign Pipeline", steps: ["Generate Images", "Create Social Posts", "Write Email Sequence", "Find Contacts"], status: "ready", icon: "🎯" },
    { name: "Product Launch", steps: ["Product Design", "Campaign Strategy", "Content Calendar", "Email Outreach"], status: "ready", icon: "🚀" },
    { name: "Content Machine", steps: ["Blog Post", "Social Media Adaptation", "Email Newsletter"], status: "ready", icon: "📝" },
    { name: "Influencer Outreach", steps: ["Find Contacts", "Draft Pitch Email", "Follow-up Sequence"], status: "ready", icon: "🤝" },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>
          🔧 Workflows & Post Scheduler
        </h2>
        <p className="text-slate-500 text-sm mt-1">Multi-step AI automation pipelines & scheduled publication queue</p>
      </div>

      {/* Task 21: Scheduled Posts Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-200 text-lg flex items-center gap-2">
            <span>📅 Scheduled Posts Queue</span>
            <span className="badge badge-primary">{scheduledPosts.length}</span>
          </h3>
        </div>

        {loadingPosts ? (
          <div className="glass-card p-6 text-center text-slate-400">Loading scheduled posts...</div>
        ) : scheduledPosts.length === 0 ? (
          <div className="glass-card p-8 text-center text-slate-500">
            No posts currently scheduled. Schedule content from <strong>AI Content Studio</strong>!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="glass-card p-5 space-y-3 flex flex-col justify-between border-indigo-500/20">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-primary">{post.platform}</span>
                    <span className="badge badge-success">{post.status}</span>
                  </div>
                  <div className="font-bold text-slate-100 text-sm">{post.title}</div>
                  <div className="text-xs text-slate-300 line-clamp-3 bg-black/20 p-2.5 rounded border border-white/5 whitespace-pre-wrap">
                    {post.content}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-slate-400">
                  <span>⏰ {new Date(post.scheduled_time).toLocaleString()}</span>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    🗑️ Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workflow Automation Pipelines */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-200 text-lg">⚡ Autonomous Workflow Templates</h3>

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
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", fontSize: "0.6rem", fontWeight: 700 }}
                    >
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
    </div>
  );
}
