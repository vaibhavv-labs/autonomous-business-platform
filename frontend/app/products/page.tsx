"use client";
import { useState, useEffect } from "react";
import {
  generateImage,
  pollJob,
  getDBProducts,
  createDBProduct,
  updateDBProduct,
  deleteDBProduct,
  DBProduct,
} from "@/lib/api";

const STYLES = ["Minimalist", "Vintage", "Abstract", "Watercolor", "Bold", "Cyberpunk", "Kawaii", "Photorealistic", "Geometric"];
const COLORS = ["Vibrant", "Pastel", "Monochrome", "Earth Tones", "Neon", "Ocean Blues", "Sunset Warm"];
const SIZES = [512, 768, 1024];

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<"studio" | "catalog">("studio");

  // AI Studio Form State
  const [form, setForm] = useState({
    prompt: "",
    style: "Minimalist",
    color_palette: "Vibrant",
    width: 1024,
    height: 1024,
    num_outputs: 2,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Product Catalog State
  const [catalog, setCatalog] = useState<DBProduct[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [search, setSearch] = useState("");
  const [savingIndex, setSavingIndex] = useState<Record<number, boolean>>({});

  const loadCatalog = async () => {
    try {
      setLoadingCatalog(true);
      const data = await getDBProducts();
      let fetched = data.products || [];
      const local = typeof window !== "undefined" ? localStorage.getItem("abp_products") : null;
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const ids = new Set(fetched.map((p: any) => p.id));
            for (const item of parsed) {
              if (!ids.has(item.id)) fetched.unshift(item);
            }
          }
        } catch {}
      }
      setCatalog(fetched);
      if (typeof window !== "undefined") localStorage.setItem("abp_products", JSON.stringify(fetched));
    } catch (err) {
      console.error("Failed to load catalog from API, using local storage:", err);
      const local = typeof window !== "undefined" ? localStorage.getItem("abp_products") : null;
      if (local) {
        try { setCatalog(JSON.parse(local)); } catch {}
      }
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, [activeTab]);

  const handleGenerate = async () => {
    if (!form.prompt.trim()) return;
    setStatus("loading");
    setProgress(0);
    setError("");
    setSaveSuccessMsg("");
    setImages([]);
    try {
      const payload = {
        prompt: form.prompt,
        style: form.style,
        color_palette: form.color_palette,
        width: form.width,
        height: form.height,
        num_outputs: form.num_outputs,
      };
      const { job_id } = await generateImage(payload);
      const job = await pollJob(job_id, (j) => setProgress(Number(j.progress ?? 0)));
      const result = job.result as { images?: string[] };
      setImages(result?.images ?? []);
      setStatus("done");
    } catch (e: unknown) {
      setError((e as Error).message);
      setStatus("error");
    }
  };

  const handleSaveToCatalog = async (url: string, index: number) => {
    try {
      setSavingIndex((prev) => ({ ...prev, [index]: true }));
      const title = form.prompt ? form.prompt.slice(0, 40) + "..." : `Design #${index + 1}`;
      const newProductItem: DBProduct = {
        id: "prod_" + Math.random().toString(36).substring(2, 9),
        title,
        prompt: form.prompt,
        style: form.style,
        color_palette: form.color_palette,
        image_url: url,
        price: 29.99,
        status: "Active",
        created_at: new Date().toISOString(),
      };
      createDBProduct({
        title: newProductItem.title,
        prompt: newProductItem.prompt,
        style: newProductItem.style,
        color_palette: newProductItem.color_palette,
        image_url: newProductItem.image_url,
        price: newProductItem.price,
        status: newProductItem.status,
      }).catch(() => {});

      setCatalog((prev) => {
        const next = [newProductItem, ...prev];
        if (typeof window !== "undefined") localStorage.setItem("abp_products", JSON.stringify(next));
        return next;
      });
      setSaveSuccessMsg(`Saved design #${index + 1} to Product Catalog! ✅`);
    } catch (err: unknown) {
      setError("Failed to save product: " + (err as Error).message);
    } finally {
      setSavingIndex((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleDeleteCatalogProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from your catalog?`)) return;
    deleteDBProduct(id).catch(() => {});
    setCatalog((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (typeof window !== "undefined") localStorage.setItem("abp_products", JSON.stringify(next));
      return next;
    });
  };

  const handleUpdatePrice = async (id: string, currentPrice: number) => {
    const newPriceStr = prompt("Enter new price ($):", currentPrice.toString());
    if (!newPriceStr) return;
    const newPrice = parseFloat(newPriceStr);
    if (isNaN(newPrice)) return;
    updateDBProduct(id, { price: newPrice }).catch(() => {});
    setCatalog((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p));
      if (typeof window !== "undefined") localStorage.setItem("abp_products", JSON.stringify(next));
      return next;
    });
  };

  const handleDownload = (url: string, idx: number) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `abp-design-${idx + 1}.png`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  const filteredCatalog = catalog.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.prompt.toLowerCase().includes(search.toLowerCase()) ||
    p.style.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="gradient-text text-2xl font-bold" style={{ letterSpacing: "-0.03em" }}>
            📦 Product Studio & Catalog
          </h2>
          <p className="text-slate-500 text-sm mt-1">Generate AI product designs & manage persistent catalog</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("studio")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "studio" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🎨 AI Product Studio
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "catalog" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📦 Product Catalog ({catalog.length})
          </button>
        </div>
      </div>

      {/* ── TAB 1: STUDIO ── */}
      {activeTab === "studio" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Design Settings</h3>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Image Prompt *</label>
                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="e.g., Cute husky dog wearing sunglasses, illustration style, t-shirt design"
                  value={form.prompt}
                  onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-2 block">Style</label>
                <div className="flex flex-wrap gap-1.5">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, style: s }))}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        form.style === s ? "btn-primary" : "btn-secondary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-2 block">Color Palette</label>
                <select
                  className="input-field"
                  value={form.color_palette}
                  onChange={(e) => setForm((f) => ({ ...f, color_palette: e.target.value }))}
                >
                  {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Width</label>
                  <select
                    className="input-field"
                    value={form.width}
                    onChange={(e) => setForm((f) => ({ ...f, width: Number(e.target.value) }))}
                  >
                    {SIZES.map((s) => <option key={s} value={s}>{s}px</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Height</label>
                  <select
                    className="input-field"
                    value={form.height}
                    onChange={(e) => setForm((f) => ({ ...f, height: Number(e.target.value) }))}
                  >
                    {SIZES.map((s) => <option key={s} value={s}>{s}px</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Number of Images: <span className="text-indigo-400 font-bold">{form.num_outputs}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={form.num_outputs}
                  onChange={(e) => setForm((f) => ({ ...f, num_outputs: Number(e.target.value) }))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <button
                className="btn-primary w-full justify-center py-2.5"
                onClick={handleGenerate}
                disabled={status === "loading" || !form.prompt.trim()}
              >
                {status === "loading" ? `⏳ Rendering ${progress}%` : "✨ Generate Designs"}
              </button>

              {saveSuccessMsg && <div className="text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded border border-emerald-500/20">{saveSuccessMsg}</div>}
              {error && <div className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded border border-rose-500/20">{error}</div>}
            </div>
          </div>

          <div className="lg:col-span-2">
            {status === "loading" && (
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-300">🎨 Flux AI Generating...</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(form.num_outputs)].map((_, i) => (
                    <div key={i} className="skeleton rounded-xl" style={{ aspectRatio: `${form.width}/${form.height}`, minHeight: 180 }} />
                  ))}
                </div>
              </div>
            )}

            {status === "idle" && (
              <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">🎨</div>
                <div className="text-slate-400 font-medium">Your designs will appear here</div>
                <div className="text-slate-600 text-sm mt-1">Powered by Flux AI — 100% Free & Unlimited</div>
              </div>
            )}

            {status === "done" && images.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {images.map((url, i) => (
                    <div key={i} className="glass-card overflow-hidden group space-y-2 p-3">
                      <div className="relative rounded-lg overflow-hidden bg-black/40" style={{ minHeight: 200 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Design ${i + 1}`}
                          className="w-full object-cover rounded-lg"
                          style={{ maxHeight: 300, display: "block" }}
                          onError={(e) => {
                            const img = e.currentTarget;
                            if (!img.dataset.retried) {
                              img.dataset.retried = "true";
                              const altSeed = Math.floor(Math.random() * 999999);
                              img.src = `${url}&retry=${altSeed}`;
                            }
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-semibold text-slate-300">Design #{i + 1}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveToCatalog(url, i)}
                            disabled={savingIndex[i]}
                            className="btn-primary text-xs px-2.5 py-1"
                          >
                            {savingIndex[i] ? "Saving..." : "📦 Save to Catalog"}
                          </button>
                          <button onClick={() => handleDownload(url, i)} className="btn-secondary text-xs px-2 py-1">
                            ⬇ Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: PRODUCT CATALOG ── */}
      {activeTab === "catalog" && (
        <div className="space-y-4">
          <div className="glass-card p-4 flex items-center justify-between">
            <input
              type="text"
              className="input-field max-w-xs"
              placeholder="🔍 Search product catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="text-xs text-slate-400 font-medium">
              Showing {filteredCatalog.length} of {catalog.length} products
            </div>
          </div>

          {loadingCatalog ? (
            <div className="glass-card p-8 text-center text-slate-400">Loading catalog from database...</div>
          ) : filteredCatalog.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-500">
              <span className="text-4xl block mb-2">📦</span>
              <div>No Products in Catalog Yet</div>
              <p className="text-xs text-slate-500 mt-1">Generate AI designs in Product Studio and click "Save to Catalog".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredCatalog.map((item) => (
                <div key={item.id} className="glass-card p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="relative rounded-lg overflow-hidden bg-black/40 aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="font-bold text-slate-100 text-sm line-clamp-1">{item.title}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-indigo-400 font-medium">{item.style || "AI Design"}</span>
                      <span className="text-emerald-400 font-mono font-bold">${item.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <button
                      onClick={() => handleUpdatePrice(item.id, item.price)}
                      className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      ✏️ Edit Price
                    </button>
                    <button
                      onClick={() => handleDeleteCatalogProduct(item.id, item.title)}
                      className="text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
