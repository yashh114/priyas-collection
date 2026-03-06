import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";
import { useWishlist } from "@/contexts/WishlistContext";
import { useSettings } from "@/hooks/useSettings";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: Math.min(i * 0.06, 0.28), ease: "easeOut" as const },
  }),
};

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { settings } = useSettings();
  const wishlisted = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    wishlisted ? removeFromWishlist(product.id) : addToWishlist(product.id);
  };

  const handleEnquire = (e: React.MouseEvent) => {
    e.stopPropagation();
    const num = settings.storeInfo.whatsapp.replace(/\D/g, "");
    const url = `${window.location.origin}/product/${product.id}`;
    const text = `Hi! I'm interested in "${product.name}" (${product.priceRange}).\n${url}`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <motion.article
      className="group relative cursor-pointer"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden rounded-2xl bg-muted shadow-sm card-lift" style={{ aspectRatio: "3/4" }}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-4xl opacity-20">👗</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 product-overlay opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {product.featured && (
            <span className="gold-gradient rounded-lg px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-widest text-charcoal shadow-sm">
              Featured
            </span>
          )}
          {product.trending && !product.featured && (
            <span className="luxury-gradient rounded-lg px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
              Trending
            </span>
          )}
        </div>

        {/* Wishlist — always on mobile, hover on desktop */}
        <motion.button
          onClick={handleWishlist}
          whileTap={{ scale: 0.82 }}
          className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 ${wishlisted ? "bg-primary text-white" : "glass text-foreground"
            }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-3.5 w-3.5 ${wishlisted ? "fill-current" : ""}`} />
        </motion.button>

        {/* WhatsApp enquiry — desktop hover */}
        <div className="absolute inset-x-3 bottom-3 hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleEnquire}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 font-body text-[11px] font-bold uppercase tracking-wider text-white shadow-md transition-opacity hover:opacity-90"
          >
            <WaIcon /> Enquire
          </button>
        </div>
      </div>

      {/* Text info */}
      <div className="mt-3 space-y-0.5 px-0.5">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {product.fabric}
        </p>
        <h3 className="font-heading text-[15px] font-semibold leading-snug text-foreground line-clamp-1 md:text-base">
          {product.name}
        </h3>
        <p className="font-body text-[13px] font-semibold text-gold-dark">
          {product.priceRange}
        </p>
      </div>
    </motion.article>
  );
};

const WaIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current flex-shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default ProductCard;
