import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
    visible: boolean;
}

const SplashScreen = ({ visible }: SplashScreenProps) => {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="splash"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-3"
                    style={{ backgroundColor: "#faf8f5" }}
                >
                    {/* Brand name */}
                    <motion.h1
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                        style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: "2.25rem",
                            fontWeight: 700,
                            color: "#7a1c33",
                            letterSpacing: "0.01em",
                            lineHeight: 1.15,
                        }}
                    >
                        Priya's Collection
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                        style={{
                            fontFamily: "'DM Sans', system-ui, sans-serif",
                            fontSize: "0.72rem",
                            fontWeight: 500,
                            letterSpacing: "0.28em",
                            textTransform: "uppercase",
                            color: "#b07a8e",
                        }}
                    >
                        Handcrafted Indian Ethnic Wear
                    </motion.p>

                    {/* Spinner */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="mt-6"
                    >
                        <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#7a1c33" strokeWidth="2.5" className="opacity-20" />
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="#7a1c33" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
