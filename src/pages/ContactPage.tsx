import { motion } from "framer-motion";
import { MessageCircle, Instagram, MapPin, Phone, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/hooks/useSettings";

const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.33, 1, 0.68, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.22 } },
};

const ContactPage = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { whatsapp, phone, instagram, address } = settings.storeInfo;

  const contacts = [
    {
      href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
      icon: MessageCircle,
      color: "bg-[#25D366]/12 text-[#25D366]",
      ring: "ring-[#25D366]/20",
      title: "WhatsApp",
      value: whatsapp,
      action: "Chat with us →",
      external: true,
    },
    {
      href: `https://instagram.com/${instagram}`,
      icon: Instagram,
      color: "bg-pink-500/12 text-pink-500",
      ring: "ring-pink-500/20",
      title: "Instagram",
      value: `@${instagram}`,
      action: "Follow us →",
      external: true,
    },
    {
      href: `tel:${phone.replace(/\s/g, "")}`,
      icon: Phone,
      color: "bg-primary/10 text-primary",
      ring: "ring-primary/20",
      title: "Phone",
      value: phone,
      action: "Call us →",
      external: false,
    },
    {
      href: "#",
      icon: MapPin,
      color: "bg-gold/12 text-gold-dark",
      ring: "ring-gold/20",
      title: "Visit Us",
      value: address,
      action: null,
      external: false,
    },
  ];

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen pb-[80px] pt-[60px] md:pb-10"
    >
      <div className="container mx-auto max-w-lg px-4 pt-5">
        {/* Back */}
        <motion.button onClick={() => navigate(-1)} className="back-btn mb-5" whileTap={{ scale: 0.95 }}>
          <ChevronLeft className="h-4 w-4" /><span>Back</span>
        </motion.button>

        <div className="mb-8">
          <p className="section-tag mb-2">Get in Touch</p>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Contact Us</h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            We'd love to help you find the perfect piece
          </p>
        </div>

        <div className="space-y-3">
          {contacts.map((c, i) => (
            <motion.a
              key={c.title}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              onClick={c.href === "#" ? (e) => e.preventDefault() : undefined}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.08 }}
              whileTap={{ scale: c.href !== "#" ? 0.97 : 1 }}
              className={`flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm ring-2 ring-transparent transition-all duration-200 ${c.href !== "#" ? "hover:shadow-md hover:ring-[var(--ring-color)]" : "cursor-default"}`}
              style={{ "--ring-color": c.ring } as React.CSSProperties}
            >
              <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl ${c.color}`}>
                <c.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base font-semibold text-foreground">{c.title}</h3>
                <p className="font-body text-sm text-muted-foreground truncate">{c.value}</p>
              </div>
              {c.action && (
                <span className="flex-none font-body text-xs font-semibold text-primary">{c.action}</span>
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.main>
  );
};

export default ContactPage;
