import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/shared/ProductCard";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";

const FeaturedCollection = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="bg-secondary/40 py-14 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-8 flex items-end justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="section-tag mb-1.5 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> Handpicked for You
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Featured Pieces
            </h2>
          </div>
          <button
            onClick={() => navigate("/categories")}
            className="hidden items-center gap-1.5 font-body text-sm font-medium text-primary underline-offset-4 hover:underline md:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="skeleton rounded-2xl" style={{ aspectRatio: "3/4" }} />
                <div className="skeleton h-3 w-2/3 rounded" />
                <div className="skeleton h-4 w-full rounded" />
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <p className="font-heading text-xl text-muted-foreground">No featured items yet</p>
            <p className="mt-1 font-body text-sm text-muted-foreground">Check back soon for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-8 md:hidden">
          <motion.button
            onClick={() => navigate("/categories")}
            className="btn-outline w-full"
            whileTap={{ scale: 0.97 }}
          >
            View All Collections
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
