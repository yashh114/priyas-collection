import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import FabricDiscovery from "@/components/home/FabricDiscovery";
import TrendingProducts from "@/components/home/TrendingProducts";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSettings } from "@/hooks/useSettings";
import { Instagram, Phone, MessageCircle } from "lucide-react";
import { useRef, useCallback } from "react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { whatsapp, phone, instagram } = settings.storeInfo;

  // ─── 5-tap secret admin access ───
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoTap = useCallback(() => {
    tapCount.current += 1;

    // Cancel previous reset timer
    if (tapTimer.current) clearTimeout(tapTimer.current);

    if (tapCount.current === 3) {
      toast.info("Keep tapping…", { duration: 1200, id: "admin-hint" });
    }

    if (tapCount.current >= 5) {
      tapCount.current = 0;
      toast.dismiss("admin-hint");
      navigate("/admin");
      return;
    }

    // Reset after 2 seconds of inactivity
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 2000);
  }, [navigate]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pb-[68px] md:pb-0"
    >
      <HeroSection />
      <CategorySection />
      <FeaturedCollection />
      <FabricDiscovery />
      <TrendingProducts />

      {/* Footer */}
      <footer className="relative overflow-hidden bg-charcoal py-14">
        {/* Decorative copper line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-copper/50 to-transparent" />
        <div className="container mx-auto px-4 text-center">

          {/* Logo — 5-tap secret admin trigger */}
          <button
            onClick={handleLogoTap}
            className="mb-2 cursor-default select-none"
            aria-label="Priya's Collection"
          >
            <h3 className="font-heading text-2xl font-bold">
              <span className="text-gold-gradient">Priya's Collection</span>
            </h3>
          </button>

          <p className="mb-8 font-body text-[11px] uppercase tracking-[0.3em] text-primary-foreground/40">
            Handcrafted Indian Ethnic Wear
          </p>

          {/* Social icon links */}
          <div className="mb-8 flex justify-center gap-3">
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-primary-foreground/50 transition-all hover:border-[#25D366]/40 hover:text-[#25D366]"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-primary-foreground/50 transition-all hover:border-pink-400/40 hover:text-pink-400"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-primary-foreground/50 transition-all hover:border-copper/40 hover:text-copper"
              aria-label="Phone"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>

          <div className="mb-6 flex justify-center gap-6">
            {[
              { label: "Categories", to: "/categories" },
              { label: "Search", to: "/search" },
              { label: "Contact", to: "/contact" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="font-body text-xs text-primary-foreground/40 transition-colors hover:text-copper"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <p className="font-body text-[11px] text-primary-foreground/20">
            © {new Date().getFullYear()} Priya's Collection. All rights reserved.
          </p>
        </div>
      </footer>
    </motion.main>
  );
};

export default Index;
