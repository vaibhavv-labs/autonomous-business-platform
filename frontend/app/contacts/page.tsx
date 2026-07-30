"use client";
import { useState, useEffect } from "react";
import {
  findContacts,
  pollJob,
  getDBContacts,
  createDBContact,
  bulkCreateDBContacts,
  updateDBContact,
  deleteDBContact,
  DBContact,
} from "@/lib/api";

const CONTACT_TYPES = ["influencer", "blogger", "journalist", "brand", "affiliate", "youtuber", "podcaster"];

interface AIContact {
  name?: string;
  role?: string;
  company?: string;
  channel?: string;
  score?: number;
  strategy?: string;
  email?: string;
}

export default function ContactsPage() {
  const [activeTab, setActiveTab] = useState<"finder" | "database">("finder");

  // AI Finder State
  const [form, setForm] = useState({
    product_description: "",
    target_market: "",
    contact_types: ["influencer"] as string[],
    num_contacts: 20,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [aiContacts, setAiContacts] = useState<AIContact[]>([]);
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState("");
  const [savedSuccessMsg, setSavedSuccessMsg] = useState("");

  // Database Tab State
  const [dbContacts, setDbContacts] = useState<DBContact[]>([]);
  const [loadingDb, setLoadingDb] = useState(false);
  const [search, setSearch] = useState("");
  const [savingSingle, setSavingSingle] = useState<Record<number, boolean>>({});

  const loadDatabaseContacts = async () => {
    try {
      setLoadingDb(true);
      const res = await getDBContacts();
      setDbContacts(res.contacts || []);
    } catch (err) {
      console.error("Failed to load DB contacts:", err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    if (activeTab === "database") {
      loadDatabaseContacts();
    }
  }, [activeTab]);

  const toggle = (t: string) => {
    setForm((f) => ({
      ...f,
      contact_types: f.contact_types.includes(t)
        ? f.contact_types.filter((x) => x !== t)
        : [...f.contact_types, t],
    }));
  };

  const handleFind = async () => {
    if (!form.product_description.trim()) return;
    setStatus("loading");
    setProgress(0);
    setError("");
    setAiContacts([]);
    setRawText("");
    setSavedSuccessMsg("");
    try {
      const { job_id } = await findContacts(form);
      const job = await pollJob(job_id, (j) => setProgress(Number(j.progress ?? 0)));
      const result = job.result as { contacts?: AIContact[]; raw?: string };
      setAiContacts(result?.contacts ?? []);
      setRawText(result?.raw ?? "");
      setStatus("done");
    } catch (e: unknown) {
      setError((e as Error).message);
      setStatus("error");
    }
  };

  const handleSaveAllToDB = async () => {
    if (aiContacts.length === 0) return;
    try {
      setSavedSuccessMsg("Saving to Database...");
      await bulkCreateDBContacts(
        aiContacts.map((c) => ({
          name: c.name || "Unknown",
          role: c.role || "",
          company: c.company || "",
          channel: c.channel || "Email",
          score: c.score || 5,
          strategy: c.strategy || "",
          email: c.email || "",
          status: "New",
        }))
      );
      setSavedSuccessMsg(`Successfully saved ${aiContacts.length} contacts to Database! ✅`);
    } catch (err: unknown) {
      setError("Failed to save to DB: " + (err as Error).message);
    }
  };

  const handleSaveSingleToDB = async (c: AIContact, idx: number) => {
    try {
      setSavingSingle((prev) => ({ ...prev, [idx]: true }));
      await createDBContact({
        name: c.name || "Unknown",
        role: c.role || "",
        company: c.company || "",
        channel: c.channel || "Email",
        score: c.score || 5,
        strategy: c.strategy || "",
        email: c.email || "",
        status: "New",
      });
      setSavedSuccessMsg(`Saved ${c.name} to Database! ✅`);
    } catch (err: unknown) {
      setError("Failed to save contact: " + (err as Error).message);
    } finally {
      setSavingSingle((prev) => ({ ...prev, [idx]: false }));
    }
  };

  const handleDeleteDbContact = async (id: string, name: string) => {
    if (!confirm(`Delete ${name} from database?`)) return;
    try {
      await deleteDBContact(id);
      setDbContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const cycle: Record<string, string> = {
      New: "Contacted",
      Contacted: "Replied",
      Replied: "Partnered",
      Partnered: "New",
    };
    const nextStatus = cycle[currentStatus] || "New";
    try {
      await updateDBContact(id, { status: nextStatus });
      setDbContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const filteredDbContacts = dbContacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>
            🔍 Contact Studio & CRM
          </h2>
          <p className="text-slate-500 text-sm mt-1">Discover outreach targets with AI & manage them in persistent database</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("finder")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "finder" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🤖 AI Contact Finder
          </button>
          <button
            onClick={() => setActiveTab("database")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "database" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            💾 Saved Database ({dbContacts.length})
          </button>
        </div>
      </div>

      {/* ── TAB 1: AI FINDER ── */}
      {activeTab === "finder" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Search Settings</h3>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Your Product *</label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="e.g., Vegan protein powder for athletes"
                  value={form.product_description}
                  onChange={(e) => setForm((f) => ({ ...f, product_description: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Target Market</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Fitness enthusiasts, US"
                  value={form.target_market}
                  onChange={(e) => setForm((f) => ({ ...f, target_market: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-2 block">Contact Types</label>
                <div className="flex flex-wrap gap-1.5">
                  {CONTACT_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggle(t)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        form.contact_types.includes(t)
                          ? "bg-indigo-600/30 border-indigo-500 text-indigo-300 font-semibold"
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleFind}
                disabled={status === "loading" || !form.product_description.trim()}
                className="btn-primary w-full justify-center"
              >
                {status === "loading" ? `Finding... ${progress}%` : "🔍 Find Contacts"}
              </button>

              {status === "loading" && (
                <div className="space-y-1">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {error && <div className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded border border-rose-500/20">{error}</div>}
              {savedSuccessMsg && <div className="text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded border border-emerald-500/20">{savedSuccessMsg}</div>}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {status === "done" && aiContacts.length > 0 && (
              <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
                <span className="text-sm font-semibold text-indigo-300">
                  🎉 AI Discovered {aiContacts.length} Outreach Targets
                </span>
                <button onClick={handleSaveAllToDB} className="btn-primary text-xs">
                  💾 Save All to Persistent Database
                </button>
              </div>
            )}

            {aiContacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiContacts.map((c, i) => (
                  <div key={i} className="glass-card p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-100 text-base">{c.name}</div>
                          <div className="text-xs text-indigo-400 font-medium">
                            {c.role} {c.company ? `at ${c.company}` : ""}
                          </div>
                        </div>
                        <span className="badge badge-primary">{c.channel}</span>
                      </div>
                      {c.email && <div className="text-xs text-slate-400 font-mono">📧 {c.email}</div>}
                      {c.strategy && <p className="text-xs text-slate-300 bg-white/5 p-2.5 rounded-lg border border-white/5">{c.strategy}</p>}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-xs text-amber-400 font-semibold">Match Score: {c.score}/10</span>
                      <button
                        onClick={() => handleSaveSingleToDB(c, i)}
                        disabled={savingSingle[i]}
                        className="btn-secondary text-xs px-3 py-1"
                      >
                        {savingSingle[i] ? "Saving..." : "💾 Save to DB"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center text-slate-500 space-y-2">
                <span className="text-4xl block">🔍</span>
                <div className="font-semibold text-slate-300">No Contacts Found Yet</div>
                <p className="text-xs text-slate-500">Fill in your product details on the left and click "Find Contacts".</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: SAVED DATABASE ── */}
      {activeTab === "database" && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-white/5">
            <input
              type="text"
              className="input-field max-w-xs"
              placeholder="🔍 Search saved contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="text-xs text-slate-400 font-medium">
              Showing {filteredDbContacts.length} of {dbContacts.length} saved contacts
            </div>
          </div>

          <div className="overflow-x-auto">
            {loadingDb ? (
              <div className="p-8 text-center text-slate-400">Loading contacts database...</div>
            ) : filteredDbContacts.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No saved contacts in database yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Name", "Role & Company", "Channel", "Email", "Status (Click to toggle)", "Outreach Strategy", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDbContacts.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/5">
                      <td className="px-5 py-3 font-semibold text-slate-200">{c.name}</td>
                      <td className="px-5 py-3 text-xs text-slate-400">
                        {c.role} {c.company ? `(${c.company})` : ""}
                      </td>
                      <td className="px-5 py-3 text-xs"><span className="badge badge-primary">{c.channel}</span></td>
                      <td className="px-5 py-3 text-xs font-mono text-slate-300">{c.email || "—"}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleStatusChange(c.id, c.status)}
                          className="badge badge-success cursor-pointer"
                          title="Click to cycle status"
                        >
                          {c.status || "New"}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-400 max-w-xs truncate">{c.strategy || "—"}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleDeleteDbContact(c.id, c.name)}
                          className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
