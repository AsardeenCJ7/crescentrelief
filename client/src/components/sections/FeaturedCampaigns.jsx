import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronRight } from "lucide-react";
import { campaignService } from "../../services/api";
import { CampaignCardSkeleton } from "../common/Skeleton";
import { formatCurrency, getDaysLeftLabel } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "All", "Emergency Relief", "Water Project", "Food Pack", "Orphan Support",
  "Education Support", "Mosque Project", "Widows Support", "Medical Aid", "Zakat", "Sadaqah"
];

const FeaturedCampaigns = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, setShowLoginModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const res = await campaignService.getAll({ status: "Active", limit: 12 });
        setCampaigns(res.data || []);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const filtered = activeCategory === "All"
    ? campaigns.slice(0, 8)
    : campaigns.filter(c => c.category === activeCategory).slice(0, 8);

  const handleDonate = (e, campaignId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { setShowLoginModal(true); return; }
    navigate(`/campaigns/${campaignId}`);
  };

  return (
    <section className="section-padding bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="container-max">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10"
        >
          <div>
            <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-3">Featured Campaigns</span>
            <h2 className="section-title">Make a Difference Today</h2>
            <p className="section-subtitle mt-3">Every campaign is verified, transparent, and directly impacts the lives of those in need.</p>
          </div>
          <Link to="/campaigns" className="btn-outline-primary text-sm whitespace-nowrap self-start md:self-auto flex items-center gap-1.5">
            View All Campaigns <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
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
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => <CampaignCardSkeleton key={i} />)}
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-16">
              <p className="text-neutral-400 text-sm">No campaigns in this category yet.</p>
              <Link to="/campaigns" className="text-primary text-sm font-semibold mt-2 inline-block hover:underline">Browse all campaigns →</Link>
            </motion.div>
          ) : (
            <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((campaign, i) => (
                <FeaturedCampaignCard key={campaign._id || campaign.id} campaign={campaign} delay={i * 0.05} onDonate={handleDonate} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explore Link CTA */}
        {!loading && campaigns.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex justify-center mt-10">
            <Link to="/campaigns"
              className="group flex items-center gap-3 px-8 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
              <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300 group-hover:text-primary transition-colors">
                Explore All {campaigns.length}+ Campaigns
              </span>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const FeaturedCampaignCard = ({ campaign, delay, onDonate }) => {
  const percent = Math.min(Math.round(((campaign.raised || 0) / (campaign.goal || 1)) * 100), 100);
  const daysLeft = campaign.endDate ? Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
  const campaignId = campaign._id || campaign.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay }}
      className="card group flex flex-col h-full relative"
    >
      {/* Image */}
      <Link to={`/campaigns/${campaignId}`} className="relative overflow-hidden aspect-[16/9] bg-neutral-100 block rounded-t-2xl">
        {campaign.image ? (
          <img src={campaign.image} alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-4xl">🕌</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-10">
          {campaign.urgent && (
            <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Urgent
            </span>
          )}
          <span className="bg-white/90 dark:bg-neutral-900/90 text-primary text-xs font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm">
            {campaign.category}
          </span>
        </div>

        {daysLeft !== null && daysLeft >= 0 && daysLeft <= 7 && (
          <span className="absolute bottom-2 right-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {daysLeft === 0 ? "Ends today" : `${daysLeft}d left`}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-heading font-bold text-neutral-900 dark:text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary-300 transition-colors">
          {campaign.title}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2 mb-4 flex-1">
          {campaign.description}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm font-bold text-neutral-900 dark:text-white">{formatCurrency(campaign.raised || 0)}</span>
            <span className="text-xs font-semibold text-primary">{percent}%</span>
          </div>
          <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-primary to-primary-600 rounded-full"
              initial={{ width: 0 }} whileInView={{ width: `${percent}%` }} viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} />
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[10px] text-neutral-400">{(campaign.donors || 0).toLocaleString()} donors</span>
            <span className="text-[10px] text-neutral-400">Goal: {formatCurrency(campaign.goal || 0)}</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Link to={`/campaigns/${campaignId}`}
            className="btn-secondary flex-1 rounded-xl py-2.5 text-xs justify-center">
            Details
          </Link>
          <button onClick={e => onDonate(e, campaignId)}
            className="btn-accent flex-[2] rounded-xl py-2.5 text-xs justify-center font-bold">
            Donate Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedCampaigns;
