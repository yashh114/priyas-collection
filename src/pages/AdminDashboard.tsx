import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Star, TrendingUp, Plus, Pencil, Trash2, LogIn,
  Upload, X, Loader2, LogOut, Eye, EyeOff, Settings, Image, Store,
  ChevronUp, ChevronDown, LayoutGrid, Link as LinkIcon,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { uploadToImageKit } from "@/lib/uploadToImageKit";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { toast } from "sonner";
import { Product, ALL_SIZES, SIZED_CATEGORIES, type Size } from "@/types/product";
import { categories as defaultCategories, fabrics } from "@/data/staticData";
import {
  useSettings, saveSettings, defaultSettings,
  type SiteSettings, type HeroSlide, type CategorySetting, type StoreInfo,
} from "@/hooks/useSettings";

/* ─────────────── Types ─────────────── */
type ProductForm = {
  name: string; category: string; fabric: string;
  priceRange: string; description: string; occasion: string;
  images: string[]; featured: boolean; trending: boolean;
  sizes: Size[];
};
const emptyForm: ProductForm = {
  name: "", category: "Sarees", fabric: "Silk",
  priceRange: "", description: "", occasion: "",
  images: [], featured: false, trending: false,
  sizes: [],
};

type Tab = "products" | "hero" | "categories" | "store";

/* ─────────────── Component ─────────────── */
const AdminDashboard = () => {
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("products");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Settings state
  const { settings: liveSettings } = useSettings();
  const [settingsData, setSettingsData] = useState<SiteSettings>(defaultSettings);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const settingsFileRef = useRef<HTMLInputElement>(null);
  const [settingsUploadTarget, setSettingsUploadTarget] = useState<{ type: string; index: number } | null>(null);

  useEffect(() => { setSettingsData(liveSettings); }, [liveSettings]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthed(!!user);
      setAuthLoading(false);
      if (user) fetchProducts();
    });
    return () => unsub();
  }, []);

  /* ─── Products CRUD ─── */
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
    } catch (err: any) { toast.error("Fetch failed: " + err.message); }
    finally { setProductsLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await deleteDoc(doc(db, "products", id));
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name, category: p.category, fabric: p.fabric,
      priceRange: p.priceRange, description: p.description,
      occasion: (p.occasion || []).join(", "),
      images: p.images || [], featured: !!p.featured, trending: !!p.trending,
      sizes: (p.sizes || []) as Size[],
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadToImageKit(file, "priya-collection/products");
      setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
      toast.success("Image uploaded to ImageKit ✓");
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally { setUploadingImage(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const isSized = SIZED_CATEGORIES.includes(form.category as any);
      const data = {
        name: form.name.trim(), category: form.category, fabric: form.fabric,
        priceRange: form.priceRange.trim(), description: form.description.trim(),
        occasion: form.occasion.split(",").map((s) => s.trim()).filter(Boolean),
        images: form.images, featured: form.featured, trending: form.trending,
        sizes: isSized ? form.sizes : [],
        ...(editingId ? {} : { createdAt: new Date().toISOString() }),
      };
      if (editingId) { await updateDoc(doc(db, "products", editingId), data); toast.success("Updated"); }
      else { await addDoc(collection(db, "products"), data); toast.success("Added"); }
      setShowForm(false); fetchProducts();
    } catch (err: any) { toast.error("Save failed: " + err.message); }
    finally { setSaving(false); }
  };

  /* ─── Settings save ─── */
  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    try {
      await saveSettings(settingsData);
      toast.success("Settings saved!");
    } catch (err: any) { toast.error("Save failed: " + err.message); }
    finally { setSettingsSaving(false); }
  };

  const handleSettingsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file || !settingsUploadTarget) return;
    const { type, index } = settingsUploadTarget;
    const folder = type === "hero" ? "priya-collection/hero" : "priya-collection/categories";
    try {
      toast.loading("Uploading…", { id: "img-upload" });
      const url = await uploadToImageKit(file, folder);
      toast.success("Uploaded to ImageKit ✓", { id: "img-upload" });
      if (type === "hero") {
        const slides = [...settingsData.heroSlides];
        slides[index] = { ...slides[index], imageUrl: url };
        setSettingsData({ ...settingsData, heroSlides: slides });
      } else if (type === "category") {
        const cats = [...settingsData.categories];
        cats[index] = { ...cats[index], imageUrl: url };
        setSettingsData({ ...settingsData, categories: cats });
      }
    } catch (err: any) {
      toast.error("Upload failed: " + err.message, { id: "img-upload" });
    } finally {
      if (settingsFileRef.current) settingsFileRef.current.value = "";
    }
  };

  /* ─── Login Screen ─── */
  if (authLoading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );

  if (!authed) return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-gold-gradient">Priya's Collection</h1>
          <p className="mt-1 font-body text-sm text-muted-foreground">Admin panel — sign in to continue</p>
        </div>
        <form onSubmit={async (e) => { e.preventDefault(); setLoginLoading(true); try { await signInWithEmailAndPassword(auth, email, password); } catch (err: any) { toast.error(err.message); } finally { setLoginLoading(false); } }} className="space-y-4">
          <div>
            <label className="mb-1.5 block font-body text-xs uppercase tracking-wider text-muted-foreground">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-base" placeholder="admin@example.com" required autoComplete="email" />
          </div>
          <div>
            <label className="mb-1.5 block font-body text-xs uppercase tracking-wider text-muted-foreground">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="input-base pr-11" placeholder="••••••••" required autoComplete="current-password" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loginLoading} className="btn-primary w-full disabled:opacity-60">
            {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );

  /* ─── Stats ─── */
  const stats = [
    { label: "Products", value: products.length, icon: Package },
    { label: "Featured", value: products.filter((p) => p.featured).length, icon: Star },
    { label: "Trending", value: products.filter((p) => p.trending).length, icon: TrendingUp },
  ];

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "products", label: "Products", icon: <Package className="h-4 w-4" /> },
    { id: "hero", label: "Hero Slides", icon: <Image className="h-4 w-4" /> },
    { id: "categories", label: "Categories", icon: <LayoutGrid className="h-4 w-4" /> },
    { id: "store", label: "Store Info", icon: <Store className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <span className="font-heading text-lg font-bold text-gold-gradient">Priya's Collection</span>
          <button onClick={() => signOut(auth).then(() => { toast.success("Signed out"); window.location.href = "/"; })} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-body text-xs text-muted-foreground hover:bg-muted">
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4">
              <Icon className="mb-1.5 h-4 w-4 text-gold" />
              <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="font-heading text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-muted p-1 scrollbar-hide">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-none items-center gap-2 rounded-lg px-4 py-2 font-body text-xs font-medium transition-all ${tab === t.id ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Products ── */}
        {tab === "products" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold">Products</h2>
              <button onClick={openAdd} className="btn-primary py-2 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Product
              </button>
            </div>
            {productsLoading ? (
              <div className="flex h-32 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
            ) : products.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border">
                <Package className="mb-2 h-8 w-8 text-muted-foreground/40" />
                <p className="font-body text-sm text-muted-foreground">No products yet</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full border-collapse bg-card">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="py-3 px-4 text-left font-body text-xs uppercase tracking-wider text-muted-foreground">Product</th>
                      <th className="hidden py-3 px-4 text-left font-body text-xs uppercase tracking-wider text-muted-foreground sm:table-cell">Category</th>
                      <th className="hidden py-3 px-4 text-left font-body text-xs uppercase tracking-wider text-muted-foreground md:table-cell">Price</th>
                      <th className="py-3 px-4 text-right font-body text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 flex-none overflow-hidden rounded-lg bg-muted" style={{ aspectRatio: "3/4" }}>
                              {p.images?.[0] ? <img src={p.images[0]} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-xl">👗</div>}
                            </div>
                            <div>
                              <p className="font-body text-sm font-medium line-clamp-1">{p.name}</p>
                              <div className="flex gap-1 mt-0.5">
                                {p.featured && <span className="rounded bg-gold/15 px-1.5 py-0.5 font-body text-[9px] font-bold uppercase text-gold-dark">Featured</span>}
                                {p.trending && <span className="rounded bg-primary/10 px-1.5 py-0.5 font-body text-[9px] font-bold uppercase text-primary">Trending</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden py-3 px-4 font-body text-sm text-muted-foreground sm:table-cell">{p.category}</td>
                        <td className="hidden py-3 px-4 font-body text-sm md:table-cell">{p.priceRange}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => openEdit(p)} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                            <button onClick={() => handleDelete(p.id)} className="rounded-lg border border-destructive/30 p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Hero Slides ── */}
        {tab === "hero" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold">Hero Carousel Slides</h2>
              <button
                onClick={() => setSettingsData((s) => ({
                  ...s,
                  heroSlides: [...s.heroSlides, { id: Date.now().toString(), imageUrl: "", label: "New Slide", subtitle: "", ctaLabel: "Shop Now", ctaLink: "/categories" }],
                }))}
                className="btn-primary py-2 text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Add Slide
              </button>
            </div>
            <div className="space-y-4">
              {settingsData.heroSlides.map((slide, i) => (
                <div key={slide.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slide {i + 1}</span>
                    <div className="flex items-center gap-2">
                      {i > 0 && <button onClick={() => { const s = [...settingsData.heroSlides];[s[i - 1], s[i]] = [s[i], s[i - 1]]; setSettingsData({ ...settingsData, heroSlides: s }); }} className="rounded p-1 text-muted-foreground hover:bg-muted"><ChevronUp className="h-4 w-4" /></button>}
                      {i < settingsData.heroSlides.length - 1 && <button onClick={() => { const s = [...settingsData.heroSlides];[s[i], s[i + 1]] = [s[i + 1], s[i]]; setSettingsData({ ...settingsData, heroSlides: s }); }} className="rounded p-1 text-muted-foreground hover:bg-muted"><ChevronDown className="h-4 w-4" /></button>}
                      <button onClick={() => setSettingsData({ ...settingsData, heroSlides: settingsData.heroSlides.filter((_, idx) => idx !== i) })} className="rounded p-1 text-destructive hover:bg-destructive/10"><X className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Image upload */}
                    <div>
                      <label className="mb-1 block font-body text-xs text-muted-foreground">Background Image</label>
                      <div className="relative overflow-hidden rounded-lg bg-muted" style={{ aspectRatio: "16/7" }}>
                        {slide.imageUrl && <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" />}
                        <label className={`absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 transition-colors hover:bg-black/30 ${slide.imageUrl ? "bg-black/20" : "bg-muted"}`}>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { setSettingsUploadTarget({ type: "hero", index: i }); handleSettingsImageUpload(e); }} ref={settingsFileRef} />
                          <Upload className={`h-5 w-5 ${slide.imageUrl ? "text-white" : "text-muted-foreground"}`} />
                          <span className={`font-body text-[11px] ${slide.imageUrl ? "text-white/80" : "text-muted-foreground"}`}>Upload Image</span>
                        </label>
                      </div>
                      {slide.imageUrl && (
                        <input value={slide.imageUrl} onChange={(e) => { const s = [...settingsData.heroSlides]; s[i] = { ...s[i], imageUrl: e.target.value }; setSettingsData({ ...settingsData, heroSlides: s }); }}
                          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-1.5 font-body text-xs text-muted-foreground focus:border-primary focus:outline-none" placeholder="Or paste image URL…" />
                      )}
                    </div>
                    {/* Text fields */}
                    <div className="space-y-2">
                      {[
                        { label: "Badge Label", key: "label" },
                        { label: "Subtitle", key: "subtitle" },
                        { label: "CTA Button Text", key: "ctaLabel" },
                        { label: "CTA Link (e.g. /category/sarees)", key: "ctaLink" },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label className="mb-0.5 block font-body text-[11px] text-muted-foreground">{label}</label>
                          <input value={(slide as any)[key]} onChange={(e) => { const s = [...settingsData.heroSlides]; s[i] = { ...s[i], [key]: e.target.value }; setSettingsData({ ...settingsData, heroSlides: s }); }}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm focus:border-primary focus:outline-none" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSaveSettings} disabled={settingsSaving} className="btn-primary mt-5 w-full disabled:opacity-60">
              {settingsSaving && <Loader2 className="h-4 w-4 animate-spin" />} Save Hero Slides
            </button>
          </div>
        )}

        {/* ── Tab: Categories ── */}
        {tab === "categories" && (
          <div>
            <h2 className="mb-4 font-heading text-xl font-bold">Category Images & Icons</h2>
            <p className="mb-5 font-body text-sm text-muted-foreground">Upload a circular photo for each category that appears in the "Shop by Style" section on the home page.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {settingsData.categories.map((cat, i) => (
                <div key={cat.slug} className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="relative h-14 w-14 flex-none overflow-hidden rounded-full bg-muted">
                      {cat.imageUrl ? <img src={cat.imageUrl} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-2xl">{cat.icon}</div>}
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-foreground">{cat.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{cat.slug}</p>
                    </div>
                  </div>
                  {/* Image URL */}
                  <div className="mb-2">
                    <label className="mb-1 block font-body text-[11px] text-muted-foreground">Image URL or upload</label>
                    <div className="flex gap-2">
                      <input value={cat.imageUrl} onChange={(e) => { const c = [...settingsData.categories]; c[i] = { ...c[i], imageUrl: e.target.value }; setSettingsData({ ...settingsData, categories: c }); }}
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-body text-xs focus:border-primary focus:outline-none" placeholder="https://…" />
                      <label className="flex cursor-pointer items-center justify-center rounded-lg border border-border px-3 hover:bg-muted">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { setSettingsUploadTarget({ type: "category", index: i }); handleSettingsImageUpload(e); }} />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </div>
                  </div>
                  {/* Icon emoji */}
                  <div>
                    <label className="mb-1 block font-body text-[11px] text-muted-foreground">Emoji icon (fallback)</label>
                    <input value={cat.icon} onChange={(e) => { const c = [...settingsData.categories]; c[i] = { ...c[i], icon: e.target.value }; setSettingsData({ ...settingsData, categories: c }); }}
                      className="w-20 rounded-lg border border-border bg-background px-3 py-2 font-body text-sm focus:border-primary focus:outline-none" />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSaveSettings} disabled={settingsSaving} className="btn-primary mt-5 w-full disabled:opacity-60">
              {settingsSaving && <Loader2 className="h-4 w-4 animate-spin" />} Save Categories
            </button>
          </div>
        )}

        {/* ── Tab: Store Info ── */}
        {tab === "store" && (
          <div>
            <h2 className="mb-4 font-heading text-xl font-bold">Store Information</h2>
            <p className="mb-5 font-body text-sm text-muted-foreground">These details are shown on the Contact page and used for enquiry links throughout the app.</p>
            <div className="space-y-4 rounded-xl border border-border bg-card p-5">
              {(
                [
                  { label: "WhatsApp Number", key: "whatsapp", placeholder: "+91 7044627776", type: "tel" },
                  { label: "Phone Number", key: "phone", placeholder: "+91 7044627776", type: "tel" },
                  { label: "Instagram Handle (without @)", key: "instagram", placeholder: "priyas_collection02", type: "text" },
                  { label: "Store Address", key: "address", placeholder: "Shop No. 1, Fashion Street, Mumbai", type: "text" },
                ] as { label: string; key: keyof StoreInfo; placeholder: string; type: string }[]
              ).map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="mb-1.5 block font-body text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
                  <input
                    type={type}
                    value={settingsData.storeInfo[key]}
                    onChange={(e) => setSettingsData({ ...settingsData, storeInfo: { ...settingsData.storeInfo, [key]: e.target.value } })}
                    className="input-base"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
            <button onClick={handleSaveSettings} disabled={settingsSaving} className="btn-primary mt-5 w-full disabled:opacity-60">
              {settingsSaving && <Loader2 className="h-4 w-4 animate-spin" />} Save Store Info
            </button>
          </div>
        )}
      </main>

      {/* ─── Product form modal ─── */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/50 backdrop-blur-sm md:items-center">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-t-2xl border border-border bg-background p-5 shadow-2xl md:rounded-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-heading text-xl font-bold">{editingId ? "Edit" : "Add"} Product</h3>
                <button onClick={() => setShowForm(false)} className="rounded-full p-1.5 hover:bg-muted"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block font-body text-xs uppercase tracking-wider text-muted-foreground">Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-base" placeholder="e.g. Royal Banarasi Silk Saree" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block font-body text-xs uppercase tracking-wider text-muted-foreground">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-base">
                      {defaultCategories.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block font-body text-xs uppercase tracking-wider text-muted-foreground">Fabric</label>
                    <select value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} className="input-base">
                      {fabrics.map((f) => <option key={f.name} value={f.name}>{f.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block font-body text-xs uppercase tracking-wider text-muted-foreground">Price Range</label>
                  <input value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })} className="input-base" placeholder="₹15,000 – ₹18,000" />
                </div>
                <div>
                  <label className="mb-1.5 block font-body text-xs uppercase tracking-wider text-muted-foreground">Occasions (comma-separated)</label>
                  <input value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} className="input-base" placeholder="Wedding, Festive, Party" />
                </div>
                <div>
                  <label className="mb-1.5 block font-body text-xs uppercase tracking-wider text-muted-foreground">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-base resize-none" />
                </div>
                <div className="flex gap-5">
                  {(["featured", "trending"] as const).map((flag) => (
                    <label key={flag} className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" checked={form[flag]} onChange={(e) => setForm({ ...form, [flag]: e.target.checked })} className="h-4 w-4 rounded accent-primary" />
                      <span className="font-body text-sm capitalize">{flag}</span>
                    </label>
                  ))}
                </div>
                {/* ─── Sizes (Kurtis / Kurta Sets only) ─── */}
                {SIZED_CATEGORIES.includes(form.category as any) && (
                  <div>
                    <label className="mb-2 block font-body text-xs uppercase tracking-wider text-muted-foreground">Available Sizes</label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_SIZES.map((size) => {
                        const active = form.sizes.includes(size);
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setForm((prev) => ({
                              ...prev,
                              sizes: active ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
                            }))}
                            className={`flex h-10 w-12 items-center justify-center rounded-lg border font-body text-sm font-medium transition-all ${active
                              ? "border-primary bg-primary text-primary-foreground shadow-sm"
                              : "border-border text-muted-foreground hover:border-primary/40 hover:bg-muted"
                              }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-1.5 font-body text-[11px] text-muted-foreground">Tap to toggle available sizes</p>
                  </div>
                )}
                {/* Images */}
                <div>
                  <label className="mb-2 block font-body text-xs uppercase tracking-wider text-muted-foreground">Images</label>
                  {form.images.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative h-16 w-[48px] overflow-hidden rounded-lg border border-border" style={{ aspectRatio: "3/4" }}>
                          <img src={img} alt="" className="h-full w-full object-cover" />
                          <button onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })} className="absolute right-0.5 top-0.5 rounded-full bg-destructive p-0.5 text-destructive-foreground">
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border px-4 py-4 hover:bg-muted transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} ref={fileRef} />
                    {uploadingImage ? <Loader2 className="h-5 w-5 animate-spin text-gold" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
                    <span className="font-body text-xs text-muted-foreground">{uploadingImage ? "Uploading…" : "Upload image"}</span>
                  </label>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setShowForm(false)} className="btn-outline flex-1 py-3 text-sm">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-3 text-sm disabled:opacity-60">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />} {editingId ? "Update" : "Add"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
