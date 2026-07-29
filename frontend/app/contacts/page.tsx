"use client";
import { useState } from "react";
import { findContacts, pollJob } from "@/lib/api";

const CONTACT_TYPES = ["influencer", "blogger", "journalist", "brand", "affiliate", "youtuber", "podcaster"];

interface Contact {
  name?: string;
  role?: string;
  company?: string;
  channel?: string;
  score?: number;
  strategy?: string;
  email?: string;
}

export default function ContactsPage() {
  const [form, setForm] = useState({
    product_description: "",
    target_market: "",
    contact_types: ["influencer"] as string[],
    num_contacts: 20,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState("");

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
    setContacts([]);
    setRawText("");
    try {
      const { job_id } = await findContacts(form);
      const job = await pollJob(job_id, (j) => setProgress(Number(j.progress ?? 0)));
      const result = job.result as { contacts?: Contact[]; raw?: string };
      setContacts(result?.contacts ?? []);
      setRawText(result?.raw ?? "");
      setStatus("done");
    } catch (e: unknown) {
      setError((e as Error).message);
      setStatus("error");
    }
  };

  const handleExport = () => {
    if (contacts.length === 0) return;
    const header = "Name,Role,Company,Channel,Score,Email,Strategy";
    const rows = contacts.map((c) =>
      [c.name, c.role, c.company, c.channel, c.score, c.email, c.strategy]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>
          🔍 Contact Finder
        </h2>
        <p className="text-slate-500 text-sm mt-1">AI-powered outreach contact discovery</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Form */}
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
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                      form.contact_types.includes(t) ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                Contacts: <span className="text-indigo-400 font-bold">{form.num_contacts}</span>
              </label>
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={form.num_contacts}
                onChange={(e) => setForm((f) => ({ ...f, num_contacts: Number(e.target.value) }))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>5</span><span>50</span>
              </div>
            </div>

            <button
              className="btn-primary w-full justify-center py-2.5"
              onClick={handleFind}
              disabled={status === "loading" || !form.product_description.trim()}
            >
              {status === "loading" ? `⏳ ${progress}%` : "🔍 Find Contacts"}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {status === "loading" && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-300">🔍 AI Searching...</h3>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="skeleton h-10 w-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-32 rounded" />
                    <div className="skeleton h-3 w-48 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="glass-card p-5 text-sm" style={{ borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }}>
              ❌ {error}
            </div>
          )}

          {status === "idle" && (
            <div className="glass-card p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-slate-400 font-medium">AI will find your ideal contacts</div>
              <div className="text-slate-600 text-sm mt-1">Influencers, bloggers, journalists & brand partners</div>
            </div>
          )}

          {status === "done" && (
            <>
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" }}
                >
                  ✅ Found {contacts.length} contacts
                </div>
                <button className="btn-secondary text-sm" onClick={handleExport} disabled={contacts.length === 0}>
                  ⬇ Export CSV
                </button>
              </div>

              {contacts.length > 0 ? (
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                          {["Name", "Role", "Company", "Channel", "Score", "Strategy"].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((c, i) => (
                          <tr
                            key={i}
                            className="hover:bg-white/[0.03] transition-colors"
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                          >
                            <td className="px-4 py-3 font-medium text-slate-200 whitespace-nowrap">
                              {c.name ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{c.role ?? "—"}</td>
                            <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{c.company ?? "—"}</td>
                            <td className="px-4 py-3">
                              <span className="badge badge-primary text-xs">{c.channel ?? "—"}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                <div className="w-16 progress-bar">
                                  <div
                                    className="progress-fill"
                                    style={{ width: `${(Number(c.score ?? 0) / 10) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs font-mono text-indigo-400">
                                  {Number(c.score ?? 0)}/10
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-500 text-xs max-w-[200px]">
                              {c.strategy ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Fallback: show raw text if JSON parsing failed */
                rawText && (
                  <div className="glass-card p-5">
                    <h4 className="text-sm font-semibold text-slate-300 mb-3">Raw Results</h4>
                    <pre className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                      {rawText}
                    </pre>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
