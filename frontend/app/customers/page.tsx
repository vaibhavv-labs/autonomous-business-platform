"use client";
import { useState } from "react";

interface Customer { id: string; name: string; email: string; product: string; status: string; spent: number; joined: string; }

const SAMPLE: Customer[] = [
  { id: "1", name: "Emma Johnson", email: "emma@example.com", product: "Eco Tote Bag", status: "Active", spent: 124, joined: "2024-01-15" },
  { id: "2", name: "Liam Chen", email: "liam@example.com", product: "Custom Hoodie", status: "Active", spent: 89, joined: "2024-02-20" },
  { id: "3", name: "Sofia Martinez", email: "sofia@example.com", product: "Phone Case", status: "Inactive", spent: 45, joined: "2024-03-10" },
  { id: "4", name: "Noah Williams", email: "noah@example.com", product: "Ceramic Mug Set", status: "Active", spent: 210, joined: "2024-03-22" },
  { id: "5", name: "Ava Brown", email: "ava@example.com", product: "Wall Art Print", status: "VIP", spent: 560, joined: "2024-04-01" },
];

const STATUS_BADGE: Record<string, string> = { Active: "badge-success", Inactive: "badge-warning", VIP: "badge-primary" };

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(SAMPLE);
  const [search, setSearch] = useState("");
  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.product.toLowerCase().includes(search.toLowerCase())
  );
  const total = customers.reduce((s, c) => s + c.spent, 0);
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div>
        <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>👥 Customers</h2>
        <p className="text-slate-500 text-sm mt-1">CRM & customer relationship management</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{ label: "Total Customers", value: customers.length, icon: "👥", color: "#818cf8" }, { label: "Active", value: customers.filter((c) => c.status === "Active").length, icon: "✅", color: "#10b981" }, { label: "Total Revenue", value: `$${total}`, icon: "💰", color: "#fbbf24" }].map(({ label, value, icon, color }) => (
          <div key={label} className="glass-card p-4 space-y-2">
            <span className="text-xl">{icon}</span>
            <div className="text-2xl font-bold" style={{ color }}>{value}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>
      <div className="glass-card overflow-hidden">
        <div className="p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <input type="text" className="input-field max-w-xs" placeholder="🔍 Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["Customer", "Email", "Product", "Status", "Spent", "Joined"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td className="px-5 py-3 font-medium text-slate-200">{c.name}</td>
                  <td className="px-5 py-3 text-slate-400 text-xs">{c.email}</td>
                  <td className="px-5 py-3 text-slate-400 text-xs">{c.product}</td>
                  <td className="px-5 py-3"><span className={`badge ${STATUS_BADGE[c.status] ?? "badge-warning"}`}>{c.status}</span></td>
                  <td className="px-5 py-3 text-emerald-400 font-mono text-xs">${c.spent}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
