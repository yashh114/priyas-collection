import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fabrics } from "@/data/staticData";

const FabricDiscovery = () => {
  return (
    <section className="overflow-hidden bg-foreground py-14 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-xs font-medium uppercase tracking-[0.3em] text-gold mb-2">
            Explore by Material
          </p>
          <h2 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
            Fabric Discovery
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {fabrics.slice(0, 8).map((fabric, i) => (
            <motion.div
              key={fabric.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link
                to={`/search?fabric=${fabric.name}`}
                className="group block rounded-sm border border-white/10 bg-white/5 p-4 text-center transition-all duration-300 hover:bg-white/10 hover:border-gold/40 hover:shadow-lg md:p-5"
              >
                <p className="mb-1.5 font-heading text-lg font-semibold text-primary-foreground md:text-xl">
                  {fabric.name}
                </p>
                <p className="font-body text-xs leading-snug text-primary-foreground/50 md:text-[11px]">
                  {fabric.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FabricDiscovery;
