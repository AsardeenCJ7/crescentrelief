import { motion } from "framer-motion";
import { PARTNERS } from "../../constants/data";

const PARTNER_NAMES = ["UNICEF", "UNHCR", "WHO", "Red Cross", "Oxfam", "Save The Children", "WFP", "MSF"];

const PartnersSection = () => (
  <section className="py-12 bg-white border-y border-border-light">
    <div className="container-max">
      <p className="text-center text-xs font-bold text-neutral-400 uppercase tracking-widest mb-8">Trusted Partners & Accreditations</p>
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
        {PARTNER_NAMES.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="px-6 py-3 rounded-xl border border-border-light bg-neutral-50 hover:bg-white hover:border-primary/20 hover:shadow-card transition-all group cursor-pointer"
          >
            <span className="text-sm font-bold text-neutral-400 group-hover:text-primary transition-colors">{name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PartnersSection;
