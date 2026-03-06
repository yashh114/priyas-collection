import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, SlidersHorizontal, X, Loader2 } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import { categories, fabrics } from "@/data/staticData";
import { useProducts } from "@/hooks/useProducts";

const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.33, 1, 0.68, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.22 } },
};

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedFabric, setSelectedFabric] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const category = categories.find((c) => c.slug === slug);
  const { products: all, loading } = useProducts();

  const products = useMemo(
    () => all.filter((p) =>
      p.category.toLowerCase().replace(/\s+/g, "-") === slug &&
      (!selectedFabric || p.fabric === selectedFabric)
    ),
    [all, slug, selectedFabric]
  );

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen pb-[80px] pt-[60px] md:pb-10"
    >
      <div className="container mx-auto px-4 pt-5">
        {/* Back button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="back-btn mb-5"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </motion.button>

        {/* Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="section-tag mb-1">Collection</p>
            <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              {category?.name ?? slug}
            </h1>
            {!loading && (
              <p className="mt-1 font-body text-sm text-muted-foreground">
                {products.length} {products.length === 1 ? "piece" : "pieces"}
                {selectedFabric && <span className="text-gold-dark"> · {selectedFabric}</span>}
              </p>
            )}
          </div>

          {/* Filter toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 font-body text-xs font-medium transition-all duration-200 ${showFilters || selectedFabric
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted"
              }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {selectedFabric && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">1</span>
            )}
          </motion.button>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fabric</p>
                  {selectedFabric && (
                    <button
                      onClick={() => setSelectedFabric("")}
                      className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" /> Clear
                    </button>
                  )}
                </div>
                <div className="scroll-strip">
                  {fabrics.map((f) => (
                    <motion.button
                      key={f.name}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setSelectedFabric(selectedFabric === f.name ? "" : f.name)}
                      className={`filter-chip flex-none ${selectedFabric === f.name ? "active" : ""}`}
                    >
                      {f.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="skeleton aspect-product rounded-lg" />
                <div className="skeleton h-3 w-2/3 rounded" />
                <div className="skeleton h-4 w-full rounded" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-52 flex-col items-center justify-center text-center"
          >
            <div className="mb-3 text-4xl">🕯️</div>
            <p className="font-heading text-xl text-muted-foreground">No pieces here yet</p>
            <p className="mt-1 font-body text-sm text-muted-foreground">
              {selectedFabric ? "Try clearing the fabric filter" : "Check back soon for new arrivals"}
            </p>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
};

export default CategoryPage;
