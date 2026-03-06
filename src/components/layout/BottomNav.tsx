import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Search, Heart, MessageCircle } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: LayoutGrid, label: "Shop", path: "/categories" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: Heart, label: "Saved", path: "/wishlist" },
  { icon: MessageCircle, label: "Contact", path: "/contact" },
];

const BottomNav = () => {
  const { pathname } = useLocation();
  const { wishlist } = useWishlist();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 glass border-t border-border/50 bottom-nav-safe md:hidden">
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = pathname === path || (path !== "/" && pathname.startsWith(path));
          const isWishlist = path === "/wishlist";
          return (
            <Link
              key={path}
              to={path}
              className={`relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors duration-200 ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              {/* Active pill indicator */}
              <AnimatePresence>
                {active && (
                  <motion.span
                    className="absolute -top-1 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-primary"
                    layoutId="bottomIndicator"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ type: "spring", damping: 24, stiffness: 300 }}
                  />
                )}
              </AnimatePresence>

              <div className="relative">
                <motion.div whileTap={{ scale: 0.82 }} transition={{ type: "spring", damping: 15 }}>
                  <Icon
                    className={`h-[22px] w-[22px] transition-all duration-200 ${active ? "stroke-[2.2]" : "stroke-[1.6]"}`}
                  />
                </motion.div>

                {/* Wishlist badge */}
                <AnimatePresence>
                  {isWishlist && wishlist.length > 0 && (
                    <motion.span
                      key="wl-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-2 -top-1.5 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-primary font-body text-[8px] font-bold text-primary-foreground"
                    >
                      {wishlist.length > 9 ? "9+" : wishlist.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <span className={`font-body text-[10px] font-medium leading-none ${active ? "text-primary" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
