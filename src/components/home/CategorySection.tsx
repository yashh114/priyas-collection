import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSettings } from "@/hooks/useSettings";
import heroBanner from "@/assets/hero-banner.jpg";
import categoryKurtis from "@/assets/category-kurtis.jpg";
import categoryLehengas from "@/assets/category-lehengas.jpg";
import categorySarees from "@/assets/category-sarees.jpg";
import featuredCollection from "@/assets/featured-collection.jpg";

const fallbackImages: Record<string, string> = {
  sarees: categorySarees,
  "ready-to-wear-sarees": featuredCollection,
  kurtis: categoryKurtis,
  "kurta-sets": categoryKurtis,
  lehengas: categoryLehengas,
  palazzos: categoryLehengas,
  dupattas: heroBanner,
};

const CategorySection = () => {
  const { settings, loading } = useSettings();
  const cats = settings.categories;

  return (
    <section className="overflow-hidden bg-background py-14 md:py-18">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="section-tag mb-2">Discover</p>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Shop by Style</h2>
        </motion.div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="scroll-strip md:grid md:grid-cols-4 md:gap-5 lg:grid-cols-7">
          {(loading ? Array.from({ length: 7 }) : cats).map((cat: any, i) =>
            loading ? (
              <div key={i} className="flex-none w-[88px] md:w-auto">
                <div className="skeleton mx-auto mb-2.5 h-16 w-16 rounded-full" />
                <div className="skeleton mx-auto h-3 w-14 rounded" />
              </div>
            ) : (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                className="flex-none w-[80px] text-center md:w-auto"
              >
                <Link to={`/category/${cat.slug}`} className="group block">
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className="relative mx-auto mb-2.5 h-16 w-16 overflow-hidden rounded-full border-2 border-border bg-muted shadow-sm transition-all duration-300 group-hover:border-gold group-hover:shadow-md md:h-[68px] md:w-[68px]"
                  >
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : fallbackImages[cat.slug] ? (
                      <img
                        src={fallbackImages[cat.slug]}
                        alt={cat.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">{cat.icon}</div>
                    )}
                  </motion.div>
                  <p className="font-body text-[12px] font-medium leading-snug text-foreground/70 transition-colors group-hover:text-primary">
                    {cat.name}
                  </p>
                </Link>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
