import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { donationService, userService } from "../services/api";
import { 
  Wallet, Heart, Calendar, ChevronRight, Activity, Award, TrendingUp,
  LayoutDashboard, History, Medal, Download, Copy, CheckCircle2, Bookmark, Clock, Share2, ShieldCheck, Star, Loader2
} from "lucide-react";
import CertificateModal from "../components/common/CertificateModal";

const TABS = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'donations', label: 'Donations & Certificates', icon: <History className="w-4 h-4" /> },
  { id: 'badges', label: 'Badges & Referrals', icon: <Medal className="w-4 h-4" /> },
  { id: 'favourites', label: 'Favourites', icon: <Bookmark className="w-4 h-4" /> },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function DashboardPage() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [donations, setDonations] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const handleOpenCert = (donation) => {
    setSelectedDonation(donation);
    setIsCertOpen(true);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchDashboardData = async () => {
      try {
        await refreshUser(); // Refresh user stats (totalDonated, badges)
        const [donationsRes, favouritesRes] = await Promise.all([
          donationService.getMyDonations().catch(() => ({ data: [] })),
          userService.getFavourites().catch(() => ({ data: [] }))
        ]);
        
        setDonations(donationsRes.data || []);
        setFavourites(favouritesRes.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const initials = user?.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-24 pb-16">
      <div className="container-max">
        
        {/* Header Profile Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="bg-white dark:bg-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm border border-border-light dark:border-neutral-700 relative overflow-hidden mb-8"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-secondary p-1 shrink-0">
              <div className="w-full h-full rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">
                {initials}
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900 dark:text-white mb-2">
                Hello, {user.fullName}!
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl text-sm md:text-base">
                Manage your donations, track your impact, and invite friends to multiply the blessings.
              </p>
              
              {/* Tabs Navigation */}
              <div className="mt-8 flex overflow-x-auto hide-scrollbar gap-2 pb-2">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                      activeTab === tab.id 
                        ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                        : 'bg-neutral-100 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && <OverviewTab user={user} donations={donations} />}
              {activeTab === 'donations' && <DonationsTab donations={donations} onOpenCert={handleOpenCert} />}
              {activeTab === 'badges' && <BadgesTab user={user} />}
              {activeTab === 'favourites' && <FavouritesTab favourites={favourites} />}
            </motion.div>
          </AnimatePresence>
        )}

        <CertificateModal 
          isOpen={isCertOpen} 
          onClose={() => setIsCertOpen(false)} 
          donation={selectedDonation}
          user={user}
        />

      </div>
    </div>
  );
}

// --- TAB COMPONENTS ---

function OverviewTab({ user, donations }) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Wallet className="text-primary" />} title="Total Donated" value={`$${user.totalDonated?.toLocaleString() || "0"}`} trend="+0% this month" color="primary" />
        <StatCard icon={<Heart className="text-rose-500" />} title="Campaigns Supported" value={user.campaignsSupported?.toString() || "0"} trend="Active donor" color="rose" />
        <StatCard icon={<Award className="text-amber-500" />} title="Current Badge" value={user.badge?.tier || "Bronze"} trend="Keep going!" color="amber" />
        <StatCard icon={<Activity className="text-emerald-500" />} title="Lives Impacted" value={`~${Math.floor((user.totalDonated || 0) / 10)}`} trend="Estimated based on gifts" color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Recent Donations */}
        <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-sm border border-border-light dark:border-neutral-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-bold text-neutral-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="space-y-0">
            {donations.length > 0 ? (
              donations.slice(0, 3).map((donation, idx) => (
                <div key={donation._id} className={`flex items-center justify-between py-4 ${idx !== 2 ? 'border-b border-border-light dark:border-neutral-700/50' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${donation.status === 'Completed' ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-500'}`}>
                      {donation.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-neutral-900 dark:text-white line-clamp-1">{donation.campaign?.title || "Unknown Campaign"}</h4>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{new Date(donation.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="font-bold text-sm text-neutral-900 dark:text-white">${donation.amount}</div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">No donations yet. Start making an impact today!</p>
                <Link to="/campaigns" className="text-primary font-semibold text-sm hover:underline mt-2 inline-block">Browse Campaigns</Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Referral Card */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 shadow-lg text-white relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-heading font-bold mb-2">Multiply Your Impact</h2>
            <p className="text-white/80 text-sm mb-6 max-w-sm">
              Share your unique referral link. When friends donate through your link, your badge progress increases!
            </p>
            <div className="bg-black/20 p-1 rounded-full flex items-center justify-between backdrop-blur-sm border border-white/10">
              <span className="text-xs font-mono ml-4 truncate">crescentrelief.org/ref/{user.referralCode || user.id}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(`https://crescentrelief.org/ref/${user.referralCode || user.id}`)}
                className="bg-white text-primary text-xs font-bold px-4 py-2 rounded-full hover:bg-neutral-100 transition-colors flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DonationsTab({ donations, onOpenCert }) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="bg-white dark:bg-neutral-800 rounded-3xl shadow-sm border border-border-light dark:border-neutral-700 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
        <h2 className="text-xl font-heading font-bold text-neutral-900 dark:text-white">Donation History & Certificates</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">View your past donations, check pending status, and download tax-deductible certificates.</p>
      </div>
      
      <div className="divide-y divide-border-light dark:divide-neutral-700">
        {donations.length > 0 ? (
          donations.map((donation) => (
            <motion.div variants={itemVariants} key={donation._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${donation.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                  {donation.status === 'Completed' ? <ShieldCheck className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white text-lg">{donation.campaign?.title || "Unknown Campaign"}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(donation.createdAt).toLocaleDateString()}</span>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${donation.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                      {donation.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:gap-1 mt-2 md:mt-0 ml-16 md:ml-0">
                <div className="text-xl font-bold text-neutral-900 dark:text-white">${donation.amount}</div>
                {donation.status === 'Completed' && (
                  <button 
                    onClick={() => onOpenCert(donation)}
                    className="text-sm font-semibold text-primary hover:text-primary-600 flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Certificate
                  </button>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center">
            <Heart className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-heading font-bold text-neutral-900 dark:text-white">No Donations Yet</h3>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2 max-w-sm mx-auto">Your donation history will appear here once you make your first contribution.</p>
            <Link to="/campaigns" className="inline-block mt-6 px-6 py-2.5 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary-600 transition-colors shadow-lg shadow-primary/25">
              Make a Donation
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function BadgesTab({ user }) {
  const [copied, setCopied] = useState(false);
  const refLink = `https://crescentrelief.org/ref/${user.referralCode || user.id}`;
  const tier = user.badge?.tier || "Bronze";

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      
      {/* Badge Progress Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm border border-border-light dark:border-neutral-700 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-full flex items-center justify-center shadow-inner mb-6 relative">
            <Medal className="w-12 h-12 text-amber-500 drop-shadow-md" />
            <div className="absolute -bottom-2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase">
              {tier}
            </div>
          </div>
          <h2 className="text-2xl font-heading font-bold text-neutral-900 dark:text-white mb-2">You are a {tier} Donor!</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            You're doing amazing! Get 5 more friends to donate via your link to unlock the next badge.
          </p>
          
          <div className="mb-2 flex justify-between text-sm font-bold">
            <span className="text-neutral-500 dark:text-neutral-400">{tier}</span>
            <span className="text-amber-500">20%</span>
            <span className="text-amber-400">Next Tier</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-700 rounded-full h-3 overflow-hidden shadow-inner relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "20%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" 
            />
          </div>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm border border-border-light dark:border-neutral-700">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Share2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-neutral-900 dark:text-white">Your Personal Referral Link</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Share this link anywhere. Referrals are tracked in real-time and boost your badge progress automatically.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm font-mono text-neutral-600 dark:text-neutral-300 flex items-center overflow-x-auto">
            {refLink}
          </div>
          <button 
            onClick={handleCopy}
            className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${copied ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-primary text-white hover:bg-primary-600 shadow-lg shadow-primary/25'}`}
          >
            {copied ? <><CheckCircle2 className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
          </button>
        </div>
      </div>

    </motion.div>
  );
}

function FavouritesTab({ favourites }) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold text-neutral-900 dark:text-white">Your Favourite Campaigns</h2>
      </div>
      
      {favourites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map(campaign => (
            <motion.div variants={itemVariants} key={campaign._id} className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm border border-border-light dark:border-neutral-700 hover:shadow-card-hover transition-all duration-300 group">
              <div className="h-40 overflow-hidden relative">
                <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-white/40 transition-colors">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
                <div className="absolute bottom-3 left-3 text-white text-xs font-bold px-2 py-1 bg-primary/90 rounded-full backdrop-blur-sm">
                  {campaign.category}
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-3 line-clamp-1 group-hover:text-primary transition-colors">{campaign.title}</h4>
                <div className="w-full bg-neutral-100 dark:bg-neutral-700 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }} />
                </div>
                <div className="flex justify-between text-xs font-medium mb-4">
                  <span className="text-primary">${campaign.raised?.toLocaleString()} raised</span>
                  <span className="text-neutral-500 dark:text-neutral-400">${campaign.goal?.toLocaleString()} goal</span>
                </div>
                <Link to={`/campaigns/${campaign._id}`} className="block text-center w-full py-2.5 rounded-xl border border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-colors">
                  Donate Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-3xl p-12 shadow-sm border border-border-light dark:border-neutral-700 text-center">
          <Heart className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-bold text-neutral-900 dark:text-white">No Favourites Yet</h3>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 max-w-sm mx-auto">Explore campaigns and click the heart icon to save them here for later.</p>
          <Link to="/campaigns" className="inline-block mt-6 px-6 py-2.5 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary-600 transition-colors shadow-lg shadow-primary/25">
            Explore Campaigns
          </Link>
        </div>
      )}
    </motion.div>
  );
}

// --- REUSABLE COMPONENTS ---

function StatCard({ icon, title, value, trend, color }) {
  const colorMap = {
    primary: "bg-primary/10",
    rose: "bg-rose-500/10",
    amber: "bg-amber-500/10",
    emerald: "bg-emerald-500/10",
  };

  return (
    <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-sm border border-border-light dark:border-neutral-700 hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorMap[color]} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <TrendingUp className="w-5 h-5 text-neutral-400 opacity-50" />
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</h3>
      </div>
      <div className="mt-4 text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-700/50 inline-block px-2.5 py-1 rounded-full">
        {trend}
      </div>
    </motion.div>
  );
}
