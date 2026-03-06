import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, Loader2, ChevronLeft } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductCard from "@/components/shared/ProductCard";
import { categories, fabrics } from "@/data/staticData";
import { useProducts } from "@/hooks/useProducts";

const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.33, 1, 0.68, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.22 } },
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFabric, setSelectedFabric] = useState(searchParams.get("fabric") || "");
  const [showFilters, setShowFilters] = useState(false);
  const { products, loading } = useProducts();

  const results = useMemo(() =>
    products.filter((p) => {
      const q = query.toLowerCase();
      return (
        (!q || p.name.toLowerCase().includes(q) || p.fabric.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) &&
        (!selectedCategory || p.category === selectedCategory) &&
        (!selectedFabric || p.fabric === selectedFabric)
      );
    }),
    [query, selectedCategory, selectedFabric, products]
  );

  const filterCount = [selectedCategory, selectedFabric].filter(Boolean).length;
  const clearAll = () => { setSelectedCategory(""); setSelectedFabric(""); setQuery(""); };

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen pb-[80px] pt-[60px] md:pb-10"
    >
      <div className="container mx-auto px-4 pt-5">
        {/* Back */}
        <motion.button onClick={() => navigate(-1)} className="back-btn mb-4" whileTap={{ scale: 0.95 }}>
          <ChevronLeft className="h-4 w-4" /><span>Back</span>
        </motion.button>

        <h1 className="mb-4 font-heading text-2xl font-bold text-foreground">Search</h1>

        {/* Search input */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            className="input-base pl-11 pr-10"
            placeholder="Search by name, fabric, or category…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Controls row */}
        <div className="mb-5 flex items-center justify-between">
          <p className="font-body text-sm text-muted-foreground">
            {loading ? "Loading…" : `${results.length} result${results.length !== 1 ? "s" : ""}`}
            {filterCount > 0 && <span className="ml-1 text-primary"> · filtered</span>}
          </p>
          <div className="flex items-center gap-2.5">
            {filterCount > 0 && (
              <button onClick={clearAll} className="font-body text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
                Clear all
              </button>
            )}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 font-body text-xs font-medium transition-all ${showFilters || filterCount ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"}`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {filterCount > 0 && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">{filterCount}</span>}
            </motion.button>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                <div>
                  <p className="mb-2.5 font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</p>
                  <div className="scroll-strip">
                    {categories.map((c) => (
                      <motion.button key={c.slug} whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedCategory(selectedCategory === c.name ? "" : c.name)}
                        className={`filter-chip flex-none ${selectedCategory === c.name ? "active-primary" : ""}`}>
                        {c.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2.5 font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fabric</p>
                  <div className="scroll-strip">
                    {fabrics.map((f) => (
                      <motion.button key={f.name} whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedFabric(selectedFabric === f.name ? "" : f.name)}
                        className={`filter-chip flex-none ${selectedFabric === f.name ? "active" : ""}`}>
                        {f.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
            {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-52 flex-col items-center justify-center text-center">
            <span className="mb-3 text-4xl">🔎</span>
            <p className="font-heading text-xl text-muted-foreground">No results found</p>
            <p className="mt-1 font-body text-sm text-muted-foreground">Try a different search or clear your filters</p>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
};

export default SearchPage;
