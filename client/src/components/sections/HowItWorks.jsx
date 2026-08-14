import { motion } from "framer-motion";
import { HOW_IT_WORKS } from "../../constants/data";

const HowItWorks = () => {
  return (
    <section className="section-padding bg-white dark:bg-neutral-900 transition-colors duration-300">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-bold text-primary dark:text-primary-400 uppercase tracking-widest mb-3">Simple Process</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle mt-3 mx-auto">
            From your donation to real-world impact — we make giving simple, transparent, and powerful.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 z-0" />

          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              {/* Icon Circle */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-50 dark:from-primary-900/30 to-white dark:to-neutral-800 border-2 border-primary/20 flex items-center justify-center shadow-card dark:shadow-none group-hover:shadow-card-hover transition-shadow">
                  <span className="material-symbols-outlined text-primary dark:text-primary-400 text-[28px]">{step.icon}</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary dark:bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold font-heading shadow-sm">
                  {step.step}
                </div>
              </div>
              <h3 className="font-heading font-bold text-lg text-neutral-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
