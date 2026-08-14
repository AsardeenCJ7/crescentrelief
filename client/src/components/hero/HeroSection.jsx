import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../common/Button";

const TrustBadges = () => (
  <div className="flex flex-wrap gap-3 mt-8">
    {[
      { icon: "verified", label: "Registered Charity", color: "text-green-400" },
      { icon: "lock", label: "SSL Secure", color: "text-blue-400" },
      { icon: "payments", label: "100% Transparent", color: "text-amber-400" },
    ].map((badge) => (
      <span key={badge.label} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 text-sm text-white/90 font-medium">
        <span className={`material-symbols-outlined text-[16px] ${badge.color}`}>{badge.icon}</span>
        {badge.label}
      </span>
    ))}
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-hero">
      {/* Background overlay image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_children.png"
          alt="Children in need"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <div className="container-max relative z-10 py-20 md:py-28">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
            <span className="text-sm font-semibold text-white/90">Responding to crises in 18 countries</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-hero text-white mb-6 leading-[1.05]"
          >
            Helping Humanity{" "}
            <span className="text-accent">Together.</span>
            <br />
            Every Donation{" "}
            <span className="relative">
              Creates Hope.
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 10" fill="none">
                <path d="M0 8 Q150 0 300 8" stroke="#FFC857" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl"
          >
            We provide dignified relief and sustainable development to the world's most vulnerable communities. Your support bridges the gap between despair and a brighter future.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 flex-wrap"
          >
            <Link to="/campaigns" className="btn-accent text-base px-8 py-4 rounded-full font-heading font-bold shadow-xl hover:-translate-y-1 transition-all text-center">
              Donate Now
            </Link>
            <Link to="/fundraising" className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white font-heading font-semibold text-base px-8 py-4 rounded-full hover:bg-white/25 transition-all">
              Start Fundraising
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </Link>
            <Link to="/volunteer" className="inline-flex items-center justify-center gap-2 text-white font-semibold text-base px-6 py-4 rounded-full hover:bg-white/10 transition-all">
              Become Volunteer
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </motion.div>

          <TrustBadges />
        </div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
          <div className="w-1.5 h-2.5 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
