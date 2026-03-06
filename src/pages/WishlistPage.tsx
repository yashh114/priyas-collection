import { motion } from "framer-motion";
import { Trash2, Share2, Heart, Loader2, ChevronLeft } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useProducts } from "@/hooks/useProducts";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/shared/ProductCard";

const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.33, 1, 0.68, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.22 } },
};

const WishlistPage = () => {
  const { wishlist, clearWishlist } = useWishlist();
  const { products: all, loading } = useProducts();
  const navigate = useNavigate();
  const products = all.filter((p) => wishlist.includes(p.id));

  const share = () => {
    const names = products.map((p) => `• ${p.name} (${p.priceRange})`).join("\n");
    const text = `My Wishlist from Priya's Collection:\n\n${names}\n\n${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

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

        {/* Header */}
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="section-tag mb-1.5">Your Picks</p>
            <h1 className="font-heading text-3xl font-bold text-foreground">Wishlist</h1>
            {!loading && (
              <p className="mt-1 font-body text-sm text-muted-foreground">
                {products.length} saved {products.length === 1 ? "piece" : "pieces"}
              </p>
            )}
          </div>

          {products.length > 0 && (
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.92 }} onClick={share}
                className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 font-body text-xs font-medium transition-colors hover:bg-muted">
                <Share2 className="h-3.5 w-3.5" /> Share
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={clearWishlist}
                className="flex items-center gap-1.5 rounded-full border border-destructive/30 px-3.5 py-2 font-body text-xs font-medium text-destructive transition-colors hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </motion.button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-accent" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-56 flex-col items-center justify-center text-center">
            <motion.div
              className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-muted"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
              <Heart className="h-9 w-9 text-muted-foreground/35" />
            </motion.div>
            <p className="font-heading text-xl text-muted-foreground">Your wishlist is empty</p>
            <p className="mt-1.5 font-body text-sm text-muted-foreground">Tap the heart on any piece to save it here</p>
            <motion.button
              onClick={() => navigate("/categories")}
              className="btn-primary mt-6 px-7"
              whileTap={{ scale: 0.95 }}
            >
              Explore Collection
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
};

export default WishlistPage;
