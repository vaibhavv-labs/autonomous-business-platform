"use client";
import { useState, useEffect } from "react";

interface Note { id: string; title: string; body: string; ts: string; }

export default function JournalPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [active, setActive] = useState<Note | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "" });

  useEffect(() => {
    try { setNotes(JSON.parse(localStorage.getItem("abp_notes") || "[]")); } catch {}
  }, []);

  const save = () => {
    if (!draft.title.trim()) return;
    const updated = active
      ? notes.map((n) => n.id === active.id ? { ...n, ...draft, ts: new Date().toISOString() } : n)
      : [{ id: Date.now().toString(), ...draft, ts: new Date().toISOString() }, ...notes];
    setNotes(updated);
    localStorage.setItem("abp_notes", JSON.stringify(updated));
    setEditing(false);
    setActive(updated[0]);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    localStorage.setItem("abp_notes", JSON.stringify(updated));
    setActive(null);
  };

  const openNew = () => { setActive(null); setDraft({ title: "", body: "" }); setEditing(true); };
  const openNote = (n: Note) => { setActive(n); setDraft({ title: n.title, body: n.body }); setEditing(false); };

  return (
    <div className="space-y-4 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>📓 Journal</h2>
          <p className="text-slate-500 text-sm mt-1">Your ideas, notes & business insights</p>
        </div>
        <button className="btn-primary text-sm" onClick={openNew}>+ New Note</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
        <div className="lg:col-span-1 space-y-2 overflow-y-auto">
          {notes.length === 0 && !editing && (
            <div className="glass-card p-8 text-center text-slate-600">
              <div className="text-4xl mb-2">📓</div><div className="text-sm">No notes yet — create your first one!</div>
            </div>
          )}
          {notes.map((n) => (
            <div key={n.id} className={`glass-card p-4 cursor-pointer transition-all ${active?.id === n.id ? "" : ""}`}
              style={active?.id === n.id ? { borderColor: "rgba(99,102,241,0.5)" } : {}}
              onClick={() => openNote(n)}>
              <div className="text-sm font-medium text-slate-200 truncate">{n.title}</div>
              <div className="text-xs text-slate-500 mt-1 truncate">{n.body.slice(0, 60)}...</div>
              <div className="text-xs text-slate-600 mt-1">{new Date(n.ts).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 glass-card p-5 flex flex-col overflow-hidden">
          {!editing && !active && (
            <div className="flex flex-col items-center justify-center flex-1 text-slate-600">
              <div className="text-5xl mb-3">📓</div>
              <div className="text-sm">Select or create a note</div>
            </div>
          )}
          {active && !editing && (
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100">{active.title}</h3>
                <div className="flex gap-2">
                  <button className="btn-secondary text-xs" onClick={() => { setDraft({ title: active.title, body: active.body }); setEditing(true); }}>✏️ Edit</button>
                  <button className="btn-secondary text-xs" style={{ color: "#f87171" }} onClick={() => deleteNote(active.id)}>🗑 Delete</button>
                </div>
              </div>
              <div className="flex-1 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap overflow-y-auto">{active.body}</div>
              <div className="text-xs text-slate-600 mt-3">{new Date(active.ts).toLocaleString()}</div>
            </div>
          )}
          {editing && (
            <div className="flex flex-col flex-1 gap-3">
              <input type="text" className="input-field text-base font-semibold" placeholder="Note title..." value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
              <textarea className="input-field flex-1 resize-none text-sm leading-relaxed" placeholder="Write your thoughts..." value={draft.body} onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))} />
              <div className="flex gap-2">
                <button className="btn-primary text-sm" onClick={save}>💾 Save</button>
                <button className="btn-secondary text-sm" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
