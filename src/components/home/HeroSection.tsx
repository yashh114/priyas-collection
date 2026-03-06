import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { settings, loading } = useSettings();
  const slides = settings.heroSlides;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = slides.length;
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  // Auto-advance
  useEffect(() => {
    if (loading || total <= 1 || isPaused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [loading, total, isPaused, next]);

  // Touch swipe
  useEffect(() => {
    let startX = 0;
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (dx > 50) prev();
      else if (dx < -50) next();
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  const slide = slides[current] ?? slides[0];
  const bgImage = slide?.imageUrl || heroBanner;

  return (
    <section
      className="relative h-[100svh] min-h-[580px] w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
        >
          <img
            src={bgImage}
            alt={slide?.label ?? "Hero"}
            className="h-full w-full object-cover object-top"
            fetchPriority="high"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/8 md:bg-gradient-to-r md:from-black/75 md:via-black/30 md:to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end pb-32 md:justify-center md:pb-0">
        <div className="container mx-auto px-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="max-w-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            >
              {/* Badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                <Sparkles className="h-3 w-3 text-gold" />
                <span className="font-body text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                  {slide?.label ?? "New Collection 2026"}
                </span>
              </div>

              <h1 className="mb-5 font-heading text-[2.8rem] font-bold leading-[1.06] tracking-tight text-white md:text-6xl lg:text-7xl">
                Timeless{" "}
                <em className="not-italic italic text-gold-gradient">Elegance</em>
              </h1>

              <p className="mb-8 max-w-sm font-body text-[15px] leading-relaxed text-white/80">
                {slide?.subtitle ?? "Handcrafted ethnic wear celebrating the artistry of Indian textiles."}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <motion.button
                  onClick={() => navigate(slide?.ctaLink ?? "/categories")}
                  className="btn-primary"
                  whileTap={{ scale: 0.96 }}
                >
                  {slide?.ctaLabel ?? "Explore Collection"}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Prev / Next arrows */}
      {total > 1 && (
        <>
          <motion.button
            aria-label="Previous"
            onClick={prev}
            whileTap={{ scale: 0.88 }}
            className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/12 p-2.5 backdrop-blur-sm transition-colors hover:bg-white/22 md:flex"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </motion.button>
          <motion.button
            aria-label="Next"
            onClick={next}
            whileTap={{ scale: 0.88 }}
            className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/12 p-2.5 backdrop-blur-sm transition-colors hover:bg-white/22 md:flex"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </motion.button>
        </>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div className="absolute bottom-[88px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:bottom-10">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrent(i)}
              animate={{ width: i === current ? 22 : 6 }}
              className={`h-[5px] rounded-full transition-colors duration-300 ${i === current ? "bg-gold" : "bg-white/40"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
