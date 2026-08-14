import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MonthlyDonorCTA = () => (
  <section className="section-padding bg-gradient-hero relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

    <div className="container-max relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="material-symbols-outlined text-accent text-[18px]">favorite</span>
            <span className="text-sm font-semibold text-white/90">Monthly Giving</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white mb-5 leading-tight">
            Become a Monthly Donor
          </h2>
          <p className="text-lg text-white/75 mb-8 max-w-2xl mx-auto leading-relaxed">
            Just £10 a month can provide clean water to a family of 4 for an entire year. Recurring donors power our long-term projects that create lasting change.
          </p>

          {/* Amount Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-8">
            {["£5", "£10", "£25", "£50"].map((amount, i) => (
              <motion.button
                key={amount}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`py-3 rounded-2xl font-heading font-bold text-base transition-all border-2 ${
                  amount === "£10"
                    ? "bg-accent border-accent text-neutral-900 shadow-lg"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                {amount}
                <span className="block text-xs font-normal opacity-70 mt-0.5">/month</span>
              </motion.button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/monthly-giving" className="btn-accent text-base px-10 py-4 rounded-full font-heading font-bold shadow-xl hover:-translate-y-1 transition-all">
              Start Monthly Giving
            </Link>
            <Link to="/impact" className="inline-flex items-center justify-center gap-2 text-white font-semibold text-base px-8 py-4 rounded-full border-2 border-white/30 hover:bg-white/10 transition-all">
              See Your Impact
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default MonthlyDonorCTA;
