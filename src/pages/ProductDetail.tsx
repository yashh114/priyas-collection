import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, ChevronRight, Share2, Loader2, Ruler } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { SIZED_CATEGORIES } from "@/types/product";
import { useSettings } from "@/hooks/useSettings";

const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.33, 1, 0.68, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.22 } },
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const product = products.find((p) => p.id === id);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { settings } = useSettings();
  const [currentImage, setCurrentImage] = useState(0);
  const wishlisted = product ? isInWishlist(product.id) : false;

  const next = () => setCurrentImage((p) => (p + 1) % (product?.images.length ?? 1));
  const prev = () => setCurrentImage((p) => (p - 1 + (product?.images.length ?? 1)) % (product?.images.length ?? 1));

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );

  if (!product) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 pt-16">
      <span className="text-5xl">🔍</span>
      <p className="font-heading text-xl text-muted-foreground">Product not found</p>
      <button onClick={() => navigate(-1)} className="btn-outline px-6 py-2.5 text-sm">Go Back</button>
    </div>
  );

  const whatsappNum = settings.storeInfo.whatsapp.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
    `Hi! I'm interested in "${product.name}" (${product.priceRange}).\n${window.location.href}`
  )}`;
  const hasSizes = SIZED_CATEGORIES.includes(product.category) && product.sizes && product.sizes.length > 0;

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen pb-[80px] pt-[60px] md:pb-12"
    >
      <div className="container mx-auto px-4 pt-5">
        {/* Back */}
        <motion.button onClick={() => navigate(-1)} className="back-btn mb-5" whileTap={{ scale: 0.95 }}>
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </motion.button>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          {/* ─── Gallery ─── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-muted shadow-lg" style={{ aspectRatio: "3/4" }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={product.images[currentImage]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35 }}
                />
              </AnimatePresence>

              {product.images.length > 1 && (
                <>
                  <motion.button whileTap={{ scale: 0.88 }} onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 glass flex h-9 w-9 items-center justify-center rounded-full shadow-md" aria-label="Prev">
                    <ChevronLeft className="h-5 w-5" />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.88 }} onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 glass flex h-9 w-9 items-center justify-center rounded-full shadow-md" aria-label="Next">
                    <ChevronRight className="h-5 w-5" />
                  </motion.button>
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                    {product.images.map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        animate={{ width: i === currentImage ? 22 : 6 }}
                        className={`h-[5px] rounded-full transition-colors ${i === currentImage ? "bg-white" : "bg-white/40"}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Badges */}
              <div className="absolute left-3 top-3 flex gap-1.5">
                {product.featured && <span className="gold-gradient rounded-lg px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-widest text-charcoal shadow-sm">Featured</span>}
                {product.trending && <span className="luxury-gradient rounded-lg px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">Trending</span>}
              </div>
            </div>

            {/* Thumbnail strip */}
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    whileTap={{ scale: 0.94 }}
                    className={`relative h-[68px] w-[52px] flex-none overflow-hidden rounded-xl border-2 transition-all ${i === currentImage ? "border-primary shadow-md" : "border-transparent opacity-65 hover:opacity-100"}`}
                    style={{ aspectRatio: "3/4" }}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ─── Info ─── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col"
          >
            <p className="section-tag mb-2">{product.fabric} · {product.category}</p>
            <h1 className="mb-3 font-heading text-[1.9rem] font-bold leading-snug text-foreground md:text-4xl">
              {product.name}
            </h1>
            <p className="mb-5 font-heading text-2xl font-semibold text-gold-dark">{product.priceRange}</p>

            {/* Sizes */}
            {hasSizes && (
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">Available Sizes</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes!.map((size) => (
                    <span
                      key={size}
                      className="flex h-10 w-12 items-center justify-center rounded-lg border border-border bg-card font-body text-sm font-medium text-foreground shadow-sm"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Occasion tags */}
            {product.occasion?.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {product.occasion.map((occ) => (
                  <span key={occ} className="rounded-full border border-border px-3.5 py-1.5 font-body text-[11px] font-medium tracking-wider text-muted-foreground">
                    {occ}
                  </span>
                ))}
              </div>
            )}

            <p className="mb-8 font-body text-[14px] leading-relaxed text-muted-foreground md:text-[15px]">
              {product.description}
            </p>

            {/* ─── CTA ─── */}
            <div className="mt-auto space-y-3">
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3.5 font-body text-sm font-bold uppercase tracking-wider text-white shadow-md transition-opacity hover:opacity-90"
                whileTap={{ scale: 0.97 }}
              >
                <WaIcon className="h-5 w-5" />
                Enquire on WhatsApp
              </motion.a>

              <div className="flex gap-2.5">
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product.id)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 font-body text-sm font-medium transition-all ${wishlisted ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}
                >
                  <Heart className={`h-4 w-4 ${wishlisted ? "fill-primary" : ""}`} />
                  {wishlisted ? "Saved" : "Save"}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => {
                    const text = `${product.name} – ${product.priceRange}\n${window.location.href}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  className="flex items-center justify-center rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted"
                  aria-label="Share"
                >
                  <Share2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
};

const WaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default ProductDetail;
