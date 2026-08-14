import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronLeft, ChevronRight, Search, ChevronDown } from "lucide-react";
import { campaignService } from "../services/api";
import { formatCurrency } from "../utils/formatters";
import { useAuth } from "../context/AuthContext";

const CAMPAIGN_CATEGORIES = [
  "All", "Zakat", "Sadaqah", "Lillah", "Qurbani / Udhiya", "Fidya",
  "Sadaqatul Fitr / Fitrana", "Food Pack", "Mosque Project",
  "Shelter Project", "Widows Support", "Water Project",
  "Emergency Relief", "Orphan Support", "Education Support",
  "Medical Aid", "Winter Appeal", "Palestine / Gaza Emergency Appeal",
  "General Donation"
];

const SORT_OPTIONS = [
  { value: "priority",     label: "Recommended"   },
  { value: "newest",       label: "Newest"        },
  { value: "almostFunded", label: "Almost Funded" },
  { value: "endingSoon",   label: "Ending Soon"   },
];

const CARDS_PER_PAGE = 12;

/* ─── Main Page ─────────────────────────────────────────────────────────── */
const CampaignsPage = () => {
  const [searchQuery,   setSearchQuery]   = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [urgentOnly,    setUrgentOnly]    = useState(false);
  const [sortBy,        setSortBy]        = useState("priority");
  const [currentPage,   setCurrentPage]   = useState(1);
  const [campaigns,     setCampaigns]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const { isAuthenticated, setShowLoginModal } = useAuth();
  const navigate  = useNavigate();
  const gridRef   = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        setLoading(true);
        const res = await campaignService.getAll({ status: "Active", limit: 200 });
        setCampaigns(res.data || []);
      } catch (e) { console.error(e); }
      finally    { setLoading(false); }
    })();
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeCategory, urgentOnly, sortBy]);

  const filteredAndSorted = useMemo(() => {
    let r = campaigns.filter(c => {
      const s = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const cat = activeCategory === "All" || c.category === activeCategory;
      const urg = urgentOnly ? c.urgent === true : true;
      return s && cat && urg;
    });
    r.sort((a, b) => {
      const pA = (a.raised || 0) / (a.goal || 1);
      const pB = (b.raised || 0) / (b.goal || 1);
      
      if (sortBy === "priority") { 
        // 1. Emergency / Urgent first
        if (a.urgent && !b.urgent) return -1; 
        if (!a.urgent && b.urgent) return 1; 

        // 2. Time left duration (ending soonest first)
        const getDaysLeft = (c) => c.endDate ? Math.ceil((new Date(c.endDate).getTime() - Date.now()) / 86400000) : (c.daysLeft != null ? c.daysLeft : Infinity);
        const timeA = getDaysLeft(a);
        const timeB = getDaysLeft(b);
        if (timeA !== timeB) return timeA - timeB;

        // 3. Critical situation (lowest percentage funded first)
        return pA - pB;
      }
      
      if (sortBy === "almostFunded") return pB - pA;
      if (sortBy === "endingSoon") {
        const getDaysLeft = (c) => c.endDate ? Math.ceil((new Date(c.endDate).getTime() - Date.now()) / 86400000) : (c.daysLeft != null ? c.daysLeft : Infinity);
        return getDaysLeft(a) - getDaysLeft(b);
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
    return r;
  }, [campaigns, searchQuery, activeCategory, urgentOnly, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / CARDS_PER_PAGE));
  const paginated  = filteredAndSorted.slice((currentPage - 1) * CARDS_PER_PAGE, currentPage * CARDS_PER_PAGE);

  const goToPage = (p) => {
    setCurrentPage(p);
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleDonate = (e, id) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) { setShowLoginModal(true); return; }
    navigate(`/campaigns/${id}`);
  };

  /* numbered page array with smart ellipsis */
  const pageNumbers = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "…", totalPages];
    if (currentPage >= totalPages - 3) return [1, "…", totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages];
    return [1, "…", currentPage-1, currentPage, currentPage+1, "…", totalPages];
  })();

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen pb-20 transition-colors">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-neutral-900 pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-neutral-900 to-secondary-900/40" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px,white 1px,transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="container-max relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-3 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
              {campaigns.length} Active Campaigns
            </span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white mb-4 tracking-tight">
              Explore <span className="text-gradient-primary">Campaigns</span>
            </h1>
            <p className="text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Discover and support verified humanitarian projects around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Filter Card ──────────────────────────────────────────── */}
      <section className="container-max px-4 -mt-6 relative z-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl shadow-black/5 dark:shadow-none border border-neutral-200 dark:border-neutral-800 p-4 space-y-3">

          {/* Row 1: Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input type="text" placeholder="Search campaigns…"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary/50 transition-all text-sm font-medium" />
          </div>

          {/* Row 2: Sort + Urgent (both selects on mobile) */}
          <div className="flex gap-2">
            {/* Sort dropdown */}
            <div className="relative flex-1">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            </div>

            {/* Urgent toggle */}
            <label className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm font-bold shrink-0 ${
              urgentOnly ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600"
                         : "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
            }`}>
              <div className={`w-8 h-5 rounded-full relative shrink-0 transition-colors ${urgentOnly ? "bg-red-500" : "bg-neutral-300 dark:bg-neutral-600"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${urgentOnly ? "translate-x-3.5" : "translate-x-0.5"}`} />
                <input type="checkbox" className="sr-only" checked={urgentOnly} onChange={e => setUrgentOnly(e.target.checked)} />
              </div>
              <span className="whitespace-nowrap text-xs">Urgent</span>
            </label>
          </div>

          {/* Row 3: Category — DROPDOWN on mobile, PILLS on desktop */}
          {/* Mobile dropdown */}
          <div className="relative sm:hidden">
            <select value={activeCategory} onChange={e => setActiveCategory(e.target.value)}
              className={`w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border text-sm font-bold focus:outline-none transition-all cursor-pointer ${
                activeCategory !== "All"
                  ? "border-primary bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary-300 focus:border-primary"
                  : "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:border-primary/50"
              }`}>
              {CAMPAIGN_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <ChevronDown className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 ${activeCategory !== "All" ? "text-primary" : "text-neutral-400"}`} />
          </div>

          {/* Desktop pills — hidden on mobile */}
          <div className="hidden sm:flex flex-wrap gap-2">
            {CAMPAIGN_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-md"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Results header ───────────────────────────────────────── */}
      <section ref={gridRef} className="container-max px-4 mt-8 mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-lg text-neutral-900 dark:text-white">
            {activeCategory === "All" ? "All Campaigns" : activeCategory}
          </h2>
          {!loading && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {filteredAndSorted.length} result{filteredAndSorted.length !== 1 ? "s" : ""} · Page {currentPage}/{totalPages}
            </p>
          )}
        </div>
        {!loading && totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button onClick={() => goToPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-primary hover:border-primary/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => goToPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-primary hover:border-primary/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* ── Campaign List ────────────────────────────────────────── */}
      <section className="container-max px-4">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : paginated.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${currentPage}-${sortBy}`}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              {/* Mobile: vertical list (compact) */}
              <div className="flex flex-col gap-3 sm:hidden">
                {paginated.map((c, i) => (
                  <MobileListCard key={c._id} campaign={c} delay={i * 0.03} onDonate={handleDonate} />
                ))}
              </div>

              {/* Desktop: 4-column grid for smaller cards */}
              <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-5">
                {paginated.map((c, i) => (
                  <DesktopGridCard key={c._id} campaign={c} delay={i * 0.04} onDonate={handleDonate} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl p-12 text-center border border-neutral-200 dark:border-neutral-800">
            <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-neutral-400" />
            </div>
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">No Campaigns Found</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Try adjusting your search or filters.</p>
            <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); setUrgentOnly(false); }}
              className="mt-4 text-sm font-bold text-primary hover:text-primary-600 transition-colors">
              Clear Filters
            </button>
          </motion.div>
        )}
      </section>

      {/* ── Numbered Pagination ──────────────────────────────────── */}
      {!loading && totalPages > 1 && (
        <section className="container-max px-4 mt-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5 flex-wrap justify-center">

            {/* Prev */}
            <button onClick={() => goToPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-primary hover:border-primary/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>

            {pageNumbers.map((p, i) =>
              p === "…" ? (
                <span key={`e${i}`} className="px-1 text-sm font-bold text-neutral-400 select-none">…</span>
              ) : (
                <button key={p} onClick={() => goToPage(p)}
                  className={`min-w-[36px] h-9 rounded-xl text-sm font-bold transition-all ${
                    currentPage === p
                      ? "bg-primary text-white shadow-md shadow-primary/30 scale-105"
                      : "border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-primary hover:border-primary/40 bg-white dark:bg-neutral-900"
                  }`}>
                  {p}
                </button>
              )
            )}

            {/* Next */}
            <button onClick={() => goToPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-primary hover:border-primary/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-neutral-400 font-medium">
            Showing {(currentPage - 1) * CARDS_PER_PAGE + 1}–{Math.min(currentPage * CARDS_PER_PAGE, filteredAndSorted.length)} of {filteredAndSorted.length} campaigns
          </p>
        </section>
      )}
    </div>
  );
};

/* ─── MOBILE: List card — proper image + readable text ──────────────────── */
const MobileListCard = ({ campaign, delay, onDonate }) => {
  const id      = campaign._id || campaign.id;
  const percent = Math.min(Math.round(((campaign.raised || 0) / (campaign.goal || 1)) * 100), 100);
  const daysLeft = campaign.endDate
    ? Math.ceil((new Date(campaign.endDate) - new Date()) / 86400000) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform"
    >
      <div className="flex">
        {/* ── Image: 120×full-height square ─── */}
        <Link to={`/campaigns/${id}`} className="relative shrink-0 w-[120px] self-stretch overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          {campaign.image ? (
            <img src={campaign.image} alt={campaign.title}
              className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5">
              <span className="text-4xl">🕌</span>
            </div>
          )}
          {/* Overlay gradient on image */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />

          {campaign.urgent && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
              URGENT
            </span>
          )}
          {daysLeft !== null && daysLeft >= 0 && daysLeft <= 7 && (
            <span className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              daysLeft <= 2 ? "bg-red-600 text-white" : "bg-orange-500 text-white"
            }`}>
              {daysLeft === 0 ? "Today" : `${daysLeft}d`}
            </span>
          )}
        </Link>

        {/* ── Content ─────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0 p-3.5 gap-2">

          {/* Category badge */}
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
            {campaign.category}
          </span>

          {/* Title */}
          <Link to={`/campaigns/${id}`}>
            <h3 className="font-bold text-sm leading-snug text-neutral-900 dark:text-white line-clamp-2 hover:text-primary transition-colors">
              {campaign.title}
            </h3>
          </Link>

          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                {formatCurrency(campaign.raised || 0)}
              </span>
              <span className="text-xs font-bold text-primary">{percent}%</span>
            </div>
            <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary-600 rounded-full transition-all duration-700"
                style={{ width: `${percent}%` }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-neutral-400">{(campaign.donors || 0).toLocaleString()} donors</span>
              <span className="text-xs text-neutral-400">of {formatCurrency(campaign.goal || 0)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-auto pt-0.5">
            <Link to={`/campaigns/${id}`}
              className="flex-1 text-center text-xs font-bold py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-primary hover:text-primary transition-all">
              Details
            </Link>
            <button onClick={e => onDonate(e, id)}
              className="flex-[2] text-xs font-bold py-2 rounded-xl bg-primary hover:bg-primary-600 text-white transition-all shadow-sm">
              Donate Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


/* ─── DESKTOP: Full grid card ───────────────────────────────────────────── */
const DesktopGridCard = ({ campaign, delay, onDonate }) => {
  const id      = campaign._id || campaign.id;
  const percent = Math.min(Math.round(((campaign.raised || 0) / (campaign.goal || 1)) * 100), 100);
  const daysLeft = campaign.endDate
    ? Math.ceil((new Date(campaign.endDate) - new Date()) / 86400000) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card group flex flex-col h-full relative overflow-hidden"
    >
      {/* Image */}
      <Link to={`/campaigns/${id}`} className="relative overflow-hidden aspect-[16/9] bg-neutral-100 dark:bg-neutral-800 block rounded-t-2xl">
        {campaign.image ? (
          <img src={campaign.image} alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <span className="text-5xl">🕌</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {campaign.urgent && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />URGENT
            </span>
          )}
          <span className="bg-white/90 dark:bg-neutral-900/90 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">
            {campaign.category}
          </span>
        </div>

        {daysLeft !== null && daysLeft >= 0 && (
          <span className={`absolute bottom-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            daysLeft <= 3 ? "bg-red-600 text-white" : daysLeft <= 7 ? "bg-orange-500 text-white" : "bg-white/80 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400"
          }`}>
            {daysLeft === 0 ? "Ends today" : `${daysLeft}d left`}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-heading font-bold text-neutral-900 dark:text-white text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
          {campaign.title}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2 mb-3 flex-1">
          {campaign.description}
        </p>

        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-bold text-neutral-900 dark:text-white">{formatCurrency(campaign.raised || 0)}</span>
            <span className="text-xs font-bold text-primary">{percent}%</span>
          </div>
          <div className="h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-primary to-primary-600 rounded-full"
              initial={{ width: 0 }} whileInView={{ width: `${percent}%` }} viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-neutral-400">{(campaign.donors || 0).toLocaleString()} donors</span>
            <span className="text-[10px] text-neutral-400">Goal: {formatCurrency(campaign.goal || 0)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/campaigns/${id}`} className="btn-secondary flex-1 rounded-xl py-2 text-xs justify-center">Details</Link>
          <button onClick={e => onDonate(e, id)} className="btn-accent flex-[2] rounded-xl py-2 text-xs justify-center font-bold">Donate Now</button>
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignsPage;
