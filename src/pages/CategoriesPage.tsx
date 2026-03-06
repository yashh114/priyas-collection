import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

// Local fallback images (used only when no admin image is set)
import categoryKurtis from "@/assets/category-kurtis.jpg";
import categoryLehengas from "@/assets/category-lehengas.jpg";
import categorySarees from "@/assets/category-sarees.jpg";
import featuredCollection from "@/assets/featured-collection.jpg";

const localFallback: Record<string, string> = {
  "sarees": categorySarees,
  "ready-to-wear-sarees": featuredCollection,
  "kurtis": categoryKurtis,
  "kurta-sets": categoryKurtis,
  "lehengas": categoryLehengas,
  "palazzos": categoryKurtis,
  "dupattas": featuredCollection,
};

const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.22 } },
};

const CategoriesPage = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  // Use admin-managed categories from Firestore, fall back to defaults
  const cats = settings.categories;

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
        <motion.button onClick={() => navigate(-1)} className="back-btn mb-5" whileTap={{ scale: 0.95 }}>
          <ChevronLeft className="h-4 w-4" /><span>Back</span>
        </motion.button>

        <div className="mb-7">
          <p className="section-tag mb-1.5">Browse</p>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">All Collections</h1>
        </div>

        {/* Uniform 2-col grid — all cards identical 3:4 ratio */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {cats.map((cat, i) => {
            const imgSrc = cat.imageUrl || localFallback[cat.slug] || categorySarees;

            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.055, ease: "easeOut" }}
              >
                <Link
                  to={`/category/${cat.slug}`}
                  className="group relative block overflow-hidden rounded-2xl bg-muted shadow-sm"
                  style={{ aspectRatio: "3/4" }}
                >
                  {/* Image or emoji fallback */}
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      loading={i < 4 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary">
                      <span className="text-6xl">{cat.icon}</span>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 product-overlay" />

                  {/* Name + CTA */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="font-heading text-lg font-bold leading-snug text-white drop-shadow-md md:text-xl">
                      {cat.name}
                    </p>
                    <p className="mt-0.5 font-body text-xs font-medium text-white/70 transition-colors group-hover:text-white">
                      Shop now →
                    </p>
                  </div>

                  {/* Hover ring */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition-all group-hover:ring-white/25" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.main>
  );
};

export default CategoriesPage;
