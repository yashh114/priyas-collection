import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/shared/ProductCard";
import { TrendingUp } from "lucide-react";

const TrendingProducts = () => {
  const { products, loading } = useProducts();
  const trending = products.filter((p) => p.trending).slice(0, 6);

  return (
    <section className="py-14 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-tag mb-1.5 flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3" /> Trending Now
          </p>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Most Loved Styles
          </h2>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="skeleton rounded-2xl" style={{ aspectRatio: "3/4" }} />
                <div className="skeleton h-3 w-2/3 rounded" />
                <div className="skeleton h-4 w-full rounded" />
              </div>
            ))}
          </div>
        ) : trending.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <p className="font-heading text-xl text-muted-foreground">No trending items yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
            {trending.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingProducts;
