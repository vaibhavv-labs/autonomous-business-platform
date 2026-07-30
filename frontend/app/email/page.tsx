"use client";
import { useState, useEffect } from "react";
import { generateContent, pollJob, sendEmailOutreach, getCustomers, getDBContacts, DBCustomer, DBContact } from "@/lib/api";

const EMAIL_TYPES = ["Promotional", "Welcome Series", "Abandoned Cart", "Re-engagement", "Newsletter", "Cold Outreach"];

export default function EmailPage() {
  const [form, setForm] = useState({
    subject: "",
    recipient_name: "",
    recipient_email: "",
    product_info: "",
    tone: "Professional",
    email_type: "Promotional",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  // Send Email State
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ success?: boolean; message?: string; provider?: string } | null>(null);

  // Recipient Database Selector State
  const [savedRecipients, setSavedRecipients] = useState<{ name: string; email: string; type: string }[]>([]);

  useEffect(() => {
    const loadRecipients = async () => {
      try {
        const [custRes, contRes] = await Promise.allSettled([getCustomers(), getDBContacts()]);
        const list: { name: string; email: string; type: string }[] = [];
        if (custRes.status === "fulfilled" && custRes.value.customers) {
          custRes.value.customers.forEach((c: DBCustomer) => {
            if (c.email) list.push({ name: c.name, email: c.email, type: "Customer" });
          });
        }
        if (contRes.status === "fulfilled" && contRes.value.contacts) {
          contRes.value.contacts.forEach((c: DBContact) => {
            if (c.email) list.push({ name: c.name, email: c.email, type: "Contact" });
          });
        }
        setSavedRecipients(list);
      } catch (err) {
        console.error("Failed to load recipients:", err);
      }
    };
    loadRecipients();
  }, []);

  const handleGenerate = async () => {
    if (!form.subject.trim()) return;
    setStatus("loading");
    setProgress(0);
    setError("");
    setOutput("");
    setSendStatus(null);
    const topic = `${form.email_type} email. Subject: "${form.subject}". Product: ${form.product_info || "our product"}. Recipient: ${form.recipient_name || "valued customer"}. Tone: ${form.tone}.`;
    try {
      const { job_id } = await generateContent({ topic, content_type: "email", tone: form.tone, word_count: 300 });
      const job = await pollJob(job_id, (j) => setProgress(Number(j.progress ?? 0)));
      const result = job.result as { content?: string };
      setOutput(result?.content ?? "");
      setStatus("done");
    } catch (e: unknown) {
      setError((e as Error).message);
      setStatus("error");
    }
  };

  const handleSendEmail = async () => {
    if (!form.recipient_email || !form.subject) {
      setError("Please provide a recipient email address and subject.");
      return;
    }
    try {
      setSending(true);
      setError("");
      setSendStatus(null);
      const res = await sendEmailOutreach({
        to: form.recipient_email,
        subject: form.subject,
        html: `<div style="font-family: sans-serif; font-size: 15px; color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${output || form.product_info}</div>`,
        from_name: "ABP Outreach",
      });
      setSendStatus(res);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  const handleRecipientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEmail = e.target.value;
    if (!selectedEmail) return;
    const found = savedRecipients.find((r) => r.email === selectedEmail);
    if (found) {
      setForm((f) => ({ ...f, recipient_name: found.name, recipient_email: found.email }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>
          💌 Email Outreach & Resend Integration
        </h2>
        <p className="text-slate-500 text-sm mt-1">Craft AI emails & send real outreach campaigns via Resend.com</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Controls */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Email Settings</h3>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email Subject *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Exclusive offer just for you 🎁"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Email Type</label>
              <select
                className="input-field"
                value={form.email_type}
                onChange={(e) => setForm((f) => ({ ...f, email_type: e.target.value }))}
              >
                {EMAIL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Tone</label>
              <select
                className="input-field"
                value={form.tone}
                onChange={(e) => setForm((f) => ({ ...f, tone: e.target.value }))}
              >
                {["Professional", "Friendly", "Urgent", "Luxury", "Casual"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Recipient Selection */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="text-xs font-semibold text-indigo-300 block">🎯 Select Recipient (CRM Database)</label>
            {savedRecipients.length > 0 && (
              <select className="input-field mb-2" onChange={handleRecipientSelect} defaultValue="">
                <option value="" disabled>-- Pick from Customers / Contacts DB --</option>
                {savedRecipients.map((r, i) => (
                  <option key={i} value={r.email}>
                    {r.name} ({r.email}) [{r.type}]
                  </option>
                ))}
              </select>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Recipient Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Sarah Johnson"
                  value={form.recipient_name}
                  onChange={(e) => setForm((f) => ({ ...f, recipient_name: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Recipient Email *</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="sarah@example.com"
                  value={form.recipient_email}
                  onChange={(e) => setForm((f) => ({ ...f, recipient_email: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Product / Offer Details</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Describe what you're promoting..."
              value={form.product_info}
              onChange={(e) => setForm((f) => ({ ...f, product_info: e.target.value }))}
            />
          </div>

          <button
            className="btn-primary w-full justify-center py-2.5"
            onClick={handleGenerate}
            disabled={status === "loading" || !form.subject.trim()}
          >
            {status === "loading" ? `⏳ Writing Email ${progress}%` : "✍️ AI Generate Email Copy"}
          </button>
        </div>

        {/* Email Preview & Sending */}
        <div className="space-y-4">
          {status === "loading" && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-300">🤖 AI Writing High-Converting Email...</h3>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {status === "idle" && (
            <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center space-y-2">
              <span className="text-6xl mb-2">💌</span>
              <div className="text-slate-300 font-semibold">Your Email Copy Preview</div>
              <p className="text-xs text-slate-500">Fill in subject and details on the left to generate and send.</p>
            </div>
          )}

          {status === "done" && output && (
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200">📧 Email Preview</h3>
                <span className="badge badge-primary">{form.email_type}</span>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-white/5 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {output}
              </div>

              {/* Real Resend.com Dispatch Action */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <div className="text-xs text-slate-400">
                  Ready to send to: <span className="text-indigo-400 font-semibold">{form.recipient_email || "(Enter recipient email above)"}</span>
                </div>
                <button
                  onClick={handleSendEmail}
                  disabled={sending || !form.recipient_email}
                  className="btn-primary w-full justify-center py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600"
                >
                  {sending ? "🚀 Sending Email via Resend..." : "🚀 Send Email via Resend.com"}
                </button>
              </div>

              {sendStatus && (
                <div className={`text-xs p-3 rounded-lg border ${
                  sendStatus.success
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}>
                  {sendStatus.message}
                </div>
              )}

              {error && <div className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded border border-rose-500/20">{error}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
