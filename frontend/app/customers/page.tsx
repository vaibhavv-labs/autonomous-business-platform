"use client";
import { useState, useEffect } from "react";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, DBCustomer } from "@/lib/api";

const STATUS_BADGE: Record<string, string> = {
  Active: "badge-success",
  Inactive: "badge-warning",
  VIP: "badge-primary",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<DBCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    product: "",
    status: "Active",
    spent: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data.customers || []);
    } catch (err: unknown) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email) {
      setError("Name and Email are required.");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      await createCustomer(newCustomer);
      setShowAddModal(false);
      setNewCustomer({ name: "", email: "", product: "", status: "Active", spent: 0 });
      await loadCustomers();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const statusCycle: Record<string, string> = {
      Active: "VIP",
      VIP: "Inactive",
      Inactive: "Active",
    };
    const nextStatus = statusCycle[currentStatus] || "Active";
    try {
      await updateCustomer(id, { status: nextStatus });
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
      );
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.product.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = customers.reduce((sum, c) => sum + (c.spent || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>
            👥 Customers Database
          </h2>
          <p className="text-slate-500 text-sm mt-1">CRM & persistent customer relationship management</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <span>➕</span> Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: customers.length, icon: "👥", color: "#818cf8" },
          { label: "Active Customers", value: customers.filter((c) => c.status === "Active").length, icon: "✅", color: "#10b981" },
          { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: "💰", color: "#fbbf24" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="glass-card p-4 space-y-2">
            <span className="text-xl">{icon}</span>
            <div className="text-2xl font-bold" style={{ color }}>{value}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>

      {/* Customer List Card */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <input
            type="text"
            className="input-field max-w-xs"
            placeholder="🔍 Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="text-xs text-slate-400 font-medium">
            Showing {filtered.length} of {customers.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading customers from database...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No customers found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Customer", "Email", "Product", "Status (Click to toggle)", "Spent", "Joined", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td className="px-5 py-3 font-medium text-slate-200">{c.name}</td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{c.email}</td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{c.product || "—"}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleStatusChange(c.id, c.status)}
                        className={`badge cursor-pointer ${STATUS_BADGE[c.status] ?? "badge-warning"}`}
                        title="Click to cycle status: Active → VIP → Inactive"
                      >
                        {c.status}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-emerald-400 font-mono text-xs">${c.spent}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{c.joined || "N/A"}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                        title="Delete Customer"
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

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100">➕ Add New Customer</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg"
              >
                ✕
              </button>
            </div>

            {error && <div className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20">{error}</div>}

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Alex Morgan"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="alex@example.com"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Product Purchased</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Premium Plan / Custom Mug"
                  value={newCustomer.product}
                  onChange={(e) => setNewCustomer({ ...newCustomer, product: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
                  <select
                    className="input-field"
                    value={newCustomer.status}
                    onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="VIP">VIP</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Amount Spent ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input-field"
                    value={newCustomer.spent}
                    onChange={(e) => setNewCustomer({ ...newCustomer, spent: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs"
                >
                  {submitting ? "Saving..." : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
