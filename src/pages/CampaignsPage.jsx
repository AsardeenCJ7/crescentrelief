import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CAMPAIGNS, CAMPAIGN_CATEGORIES } from "../constants/data";
import CampaignCard from "../components/campaign/CampaignCard";

const SORT_OPTIONS = [
  { value: "priority", label: "Recommended Priority" },
  { value: "endingSoon", label: "Ending Soon" },
  { value: "almostFunded", label: "Almost Funded" },
  { value: "newest", label: "Recently Added" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const CampaignsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState("priority");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAndSortedCampaigns = useMemo(() => {
    // 1. Filter
    let result = CAMPAIGNS.filter((campaign) => {
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || campaign.category === activeCategory;
      
      const matchesUrgent = urgentOnly ? campaign.urgent === true : true;

      return matchesSearch && matchesCategory && matchesUrgent;
    });

    // 2. Sort
    result.sort((a, b) => {
      const percentA = a.raised / a.goal;
      const percentB = b.raised / b.goal;

      if (sortBy === "priority") {
        // 1. Urgency
        if (a.urgent && !b.urgent) return -1;
        if (!a.urgent && b.urgent) return 1;

        // 2. Days Left (Ascending)
        if (a.daysLeft !== b.daysLeft) {
          return a.daysLeft - b.daysLeft;
        }

        // 3. Funding Momentum (Descending)
        return percentB - percentA;
      } else if (sortBy === "endingSoon") {
        return a.daysLeft - b.daysLeft;
      } else if (sortBy === "almostFunded") {
        return percentB - percentA;
      }
      // 'newest' or default retains initial array order assuming data.js is chronologically sorted
      return 0; 
    });

    return result;
  }, [searchQuery, activeCategory, urgentOnly, sortBy]);

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen pb-20 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-neutral-900 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-neutral-900 to-secondary-900/40" />
        <div className="container-max relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-white mb-6 tracking-tight"
          >
            Explore <span className="text-gradient-primary">Campaigns</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed"
          >
            Discover and support verified humanitarian projects around the world. Every donation creates a ripple of positive change.
          </motion.p>
        </div>
      </section>

      {/* Control Bar Section */}
      <section className="container-max -mt-6 relative z-20">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-card dark:shadow-none border border-border-light dark:border-neutral-800 p-4 sm:p-6 flex flex-col gap-5 transition-colors duration-300">
          
          {/* Search */}
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-neutral-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/50 dark:focus:border-primary/50 focus:bg-white dark:focus:bg-neutral-700 transition-all"
            />
          </div>

          {/* Controls Row: Urgent Toggle + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Urgent Toggle */}
            <label className="flex items-center gap-2 cursor-pointer group flex-shrink-0">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={urgentOnly}
                  onChange={(e) => setUrgentOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={`block w-12 h-7 rounded-full transition-colors ${urgentOnly ? "bg-red-500" : "bg-neutral-200 dark:bg-neutral-700"}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${urgentOnly ? "translate-x-5" : ""}`}></div>
              </div>
              <span className={`text-sm font-bold transition-colors flex items-center gap-1 whitespace-nowrap ${urgentOnly ? "text-red-500" : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"}`}>
                <span className="material-symbols-outlined text-[16px]">emergency</span>
                Urgent Only
              </span>
            </label>

            <div className="h-px w-full sm:h-8 sm:w-px bg-border-light dark:bg-neutral-700"></div>

            {/* Sort Dropdown (Custom) */}
            <div className="relative w-full sm:w-auto" ref={sortRef}>
              <button
                type="button"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center justify-between gap-2 w-full sm:w-52 bg-neutral-50 dark:bg-neutral-800 border border-border-light dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-bold rounded-xl pl-4 pr-3 py-2.5 focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
              >
                <span className="truncate">{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                <span className={`material-symbols-outlined text-[20px] text-neutral-400 transition-transform ${sortDropdownOpen ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </button>
              <AnimatePresence>
                {sortDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 sm:right-auto sm:left-auto sm:w-52 mt-2 bg-white dark:bg-neutral-800 border border-border-light dark:border-neutral-700 rounded-xl shadow-card-hover overflow-hidden z-30"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSortBy(option.value); setSortDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                          sortBy === option.value
                            ? "bg-primary-50 dark:bg-primary/20 text-primary font-bold"
                            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="h-px w-full bg-border-light dark:bg-neutral-800"></div>

          {/* Bottom Row: Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {CAMPAIGN_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Grid Section */}
      <section className="container-max mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading font-extrabold text-2xl text-neutral-900 dark:text-white">
            {activeCategory === "All" ? "All Active Campaigns" : `${activeCategory} Campaigns`}
          </h2>
          <span className="text-sm font-bold text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-3 py-1 rounded-full border border-border-light dark:border-neutral-800 shadow-sm">
            {filteredAndSortedCampaigns.length} Results
          </span>
        </div>

        {filteredAndSortedCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredAndSortedCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CampaignCard campaign={campaign} delay={index * 0.05} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-neutral-900 rounded-3xl p-12 text-center border border-border-light dark:border-neutral-800 shadow-sm transition-colors duration-300"
          >
            <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border-light dark:border-neutral-700">
              <span className="material-symbols-outlined text-[32px] text-neutral-400 dark:text-neutral-500">search_off</span>
            </div>
            <h3 className="font-heading font-extrabold text-xl text-neutral-900 dark:text-white mb-2">
              No Campaigns Found
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400">
              Try adjusting your search or filters to see more results.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setUrgentOnly(false);
                setSortBy("priority");
              }}
              className="mt-6 btn-secondary px-6 py-2 rounded-full font-bold text-sm"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default CampaignsPage;
