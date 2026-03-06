import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, Menu, X } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { wishlist } = useWishlist();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  const transparent = isHome && !scrolled;
  const textColor = transparent ? "text-white" : "text-foreground";

  const links = [
    { label: "Sarees", path: "/category/sarees" },
    { label: "Kurtis", path: "/category/kurtis" },
    { label: "Lehengas", path: "/category/lehengas" },
    { label: "Kurta Sets", path: "/category/kurta-sets" },
    { label: "All", path: "/categories" },
  ];

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${transparent
            ? "border-b border-white/10 bg-transparent"
            : "glass border-b border-border/60 shadow-sm"
          }`}
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
      >
        <div className="container mx-auto flex h-[60px] items-center justify-between px-4">
          {/* Hamburger (mobile) */}
          <motion.button
            onClick={() => setMobileOpen(true)}
            className={`flex h-9 w-9 items-center justify-center rounded-full md:hidden ${transparent ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted"}`}
            whileTap={{ scale: 0.9 }}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </motion.button>

          {/* Logo */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0"
          >
            <span className="font-heading text-[1.35rem] font-bold tracking-wide">
              {transparent ? (
                <span className="text-white drop-shadow">Priya's Collection</span>
              ) : (
                <span className="text-gold-gradient">Priya's Collection</span>
              )}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((l) => {
              const active = pathname === l.path || (l.path !== "/" && pathname.startsWith(l.path));
              return (
                <Link
                  key={l.path}
                  to={l.path}
                  className={`relative font-body text-[13px] font-medium tracking-wide transition-colors hover:text-accent ${transparent ? "text-white/85 hover:text-white" : active ? "text-primary" : "text-foreground/75"}`}
                >
                  {l.label}
                  {active && !transparent && (
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-primary"
                      layoutId="navUnderline"
                      transition={{ type: "spring", damping: 26, stiffness: 300 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <Link to="/search" className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${transparent ? "text-white hover:bg-white/10" : "text-foreground/75 hover:bg-muted"}`} aria-label="Search">
              <Search className="h-[18px] w-[18px]" />
            </Link>
            <Link to="/wishlist" className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${transparent ? "text-white hover:bg-white/10" : "text-foreground/75 hover:bg-muted"}`} aria-label="Wishlist">
              <Heart className="h-[18px] w-[18px]" />
              <AnimatePresence>
                {wishlist.length > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute right-1 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary font-body text-[9px] font-bold text-primary-foreground"
                  >
                    {wishlist.length > 9 ? "9+" : wishlist.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-charcoal/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-[70] w-[72vw] max-w-[300px] bg-card shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              {/* Drawer header */}
              <div className="flex h-[60px] items-center justify-between border-b border-border px-5">
                <span className="font-heading text-lg font-bold text-gold-gradient">Priya's Collection</span>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-foreground" />
                </motion.button>
              </div>

              {/* Links */}
              <nav className="overflow-y-auto px-3 pt-4">
                {links.map((l, i) => {
                  const active = pathname === l.path || (l.path !== "/" && pathname.startsWith(l.path));
                  return (
                    <motion.div
                      key={l.path}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        to={l.path}
                        className={`flex items-center rounded-md px-4 py-3 font-body text-[15px] font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-foreground/75 hover:bg-muted hover:text-foreground"}`}
                      >
                        {l.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="mt-4 border-t border-border pt-4">
                  {[
                    { label: "Search", path: "/search" },
                    { label: "Wishlist", path: "/wishlist" },
                    { label: "Contact", path: "/contact" },
                  ].map((l, i) => (
                    <motion.div key={l.path} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.05 }}>
                      <Link to={l.path} className="flex items-center rounded-md px-4 py-3 font-body text-[14px] text-muted-foreground hover:bg-muted hover:text-foreground">
                        {l.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
