import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CampaignCard from "../campaign/CampaignCard";
import { CampaignCardSkeleton } from "../common/Skeleton";
import { CAMPAIGNS, CAMPAIGN_CATEGORIES } from "../../constants/data";

const FeaturedCampaigns = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (cat) => {
    if (cat === activeCategory) return;
    setLoading(true);
    setActiveCategory(cat);
    setTimeout(() => setLoading(false), 400);
  };

  const filtered = activeCategory === "All"
    ? CAMPAIGNS
    : CAMPAIGNS.filter((c) => c.category === activeCategory);

  return (
    <section className="section-padding bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10"
        >
          <div>
            <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-3">Featured Campaigns</span>
            <h2 className="section-title">Make a Difference Today</h2>
            <p className="section-subtitle mt-3">Every campaign is verified, transparent, and directly impacts the lives of those in need.</p>
          </div>
          <Link to="/campaigns" className="btn-outline-primary text-sm whitespace-nowrap self-start md:self-auto">
            View All Campaigns
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8"
        >
          {CAMPAIGN_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-button"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-border-light dark:border-neutral-800 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Campaign Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {Array(4).fill(0).map((_, i) => <CampaignCardSkeleton key={i} />)}
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filtered.map((campaign, i) => (
                <CampaignCard key={campaign.id} campaign={campaign} delay={i * 0.05} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
