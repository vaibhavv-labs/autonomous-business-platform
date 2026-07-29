"use client";
import { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const SAMPLE_EVENTS = [
  { day: 3, label: "Blog Post", color: "#6366f1" },
  { day: 5, label: "Instagram Reel", color: "#10b981" },
  { day: 10, label: "Email Newsletter", color: "#f59e0b" },
  { day: 15, label: "TikTok Video", color: "#ec4899" },
  { day: 18, label: "Product Launch", color: "#a78bfa" },
  { day: 22, label: "Ad Campaign", color: "#6366f1" },
  { day: 25, label: "Influencer Post", color: "#10b981" },
];

export default function CalendarPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>📅 Content Calendar</h2>
        <p className="text-slate-500 text-sm mt-1">Plan and schedule your content pipeline</p>
      </div>
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-6">
          <button className="btn-secondary text-sm px-3 py-1.5" onClick={prevMonth}>← Prev</button>
          <h3 className="text-base font-bold text-slate-200">{MONTHS[month]} {year}</h3>
          <button className="btn-secondary text-sm px-3 py-1.5" onClick={nextMonth}>Next →</button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-slate-500 py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const events = SAMPLE_EVENTS.filter((e) => e.day === day);
            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
            return (
              <div
                key={day}
                className="rounded-lg p-1.5 min-h-[64px] transition-all hover:bg-white/5 cursor-pointer"
                style={{ border: `1px solid ${isToday ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.04)"}`, background: isToday ? "rgba(99,102,241,0.08)" : undefined }}
              >
                <div className={`text-xs font-bold mb-1 ${isToday ? "text-indigo-400" : "text-slate-400"}`}>{day}</div>
                {events.map((e, j) => (
                  <div key={j} className="text-xs px-1 py-0.5 rounded truncate mb-0.5"
                    style={{ background: `${e.color}25`, color: e.color, fontSize: "0.65rem" }}>
                    {e.label}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Upcoming</h3>
        <div className="space-y-2">
          {SAMPLE_EVENTS.map((e, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
              <span className="text-slate-400 w-8">{e.day}</span>
              <span className="text-slate-300">{e.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
