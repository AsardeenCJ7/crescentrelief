import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, Heart, Wallet, ArrowUpRight, ArrowDownRight,
  ClipboardList, CheckCircle2, CreditCard, RefreshCw, Calendar
} from "lucide-react";
import { FaPaypal } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { taskService, donationService } from "../../services/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const paymentIcon = (method) => {
  if (method === "paypal") return <FaPaypal className="w-4 h-4 text-[#003087]" />;
  if (method === "stripe") return <CreditCard className="w-4 h-4 text-violet-500" />;
  return <CreditCard className="w-4 h-4 text-neutral-500" />;
};

const paymentLabel = (method) => {
  if (method === "paypal") return "PayPal";
  if (method === "stripe") return "Stripe";
  return method?.charAt(0).toUpperCase() + method?.slice(1) || "Card";
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [activity, setActivity] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [daysPeriod, setDaysPeriod] = useState(30);
  const [activeTab, setActiveTab] = useState("overview"); // overview | activity

  useEffect(() => {
    if (user?.role === "admin" || user?.role === "superadmin") {
      fetchTasks();
    }
    fetchStats();
    fetchActivity();
  }, [user, daysPeriod]);

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const response = await taskService.getAll({ limit: 10 });
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await donationService.getStats({ period: `${daysPeriod}d` });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchActivity = async () => {
    try {
      setLoadingActivity(true);
      const res = await donationService.getActivity({ days: daysPeriod });
      setActivity(res.data);
    } catch (err) {
      console.error("Failed to fetch activity:", err);
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await taskService.update(taskId, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const overviewStats = [
    {
      title: "Total Raised",
      value: `£${(stats?.overview?.totalRaised || 0).toLocaleString()}`,
      sub: `${daysPeriod}-day period`,
      positive: true,
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      title: "Total Donations",
      value: (stats?.overview?.totalDonations || 0).toLocaleString(),
      sub: `${daysPeriod}-day period`,
      positive: true,
      icon: <Heart className="w-5 h-5" />,
    },
    {
      title: "Avg. Donation",
      value: `£${((stats?.overview?.avgDonation || 0)).toFixed(2)}`,
      sub: "per transaction",
      positive: true,
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      title: "Gift Aid Claimed",
      value: `£${((stats?.overview?.totalGiftAid || 0)).toFixed(2)}`,
      sub: "HMRC reclaim",
      positive: true,
      icon: <ArrowUpRight className="w-5 h-5" />,
    },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Live donation activity and platform stats.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <select
              value={daysPeriod}
              onChange={(e) => setDaysPeriod(Number(e.target.value))}
              className="bg-transparent text-sm text-neutral-700 dark:text-neutral-300 font-semibold focus:outline-none"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          <button
            onClick={() => { fetchStats(); fetchActivity(); }}
            className="w-9 h-9 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-center text-neutral-500 hover:text-primary transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl w-fit">
        {[
          { id: "overview", label: "Overview" },
          { id: "activity", label: "Donation Activity" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            {overviewStats.map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-11 h-11 bg-primary/10 dark:bg-primary/20 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-neutral-500 dark:text-neutral-400 text-xs font-medium mb-0.5">{stat.title}</h3>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">{stat.sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-2">
            {/* Payment Method Breakdown */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white mb-5">Payment Methods</h2>
              <div className="space-y-3">
                {loadingActivity ? (
                  <p className="text-sm text-neutral-400">Loading...</p>
                ) : activity?.paymentMethodBreakdown?.length > 0 ? (
                  activity.paymentMethodBreakdown.map((pm) => {
                    const totalAll = activity.paymentMethodBreakdown.reduce((acc, p) => acc + p.total, 0);
                    const pct = totalAll > 0 ? Math.round((pm.total / totalAll) * 100) : 0;
                    return (
                      <div key={pm._id}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {paymentIcon(pm._id)}
                            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{paymentLabel(pm._id)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-neutral-900 dark:text-white">£{pm.total.toLocaleString()}</span>
                            <span className="text-xs text-neutral-400 ml-2">({pm.count} txns)</span>
                          </div>
                        </div>
                        <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-right text-xs text-neutral-400 mt-0.5">{pct}%</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-neutral-400">No payment data for this period.</p>
                )}
              </div>
            </motion.div>

            {/* Top Donors */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm xl:col-span-2">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white mb-5">Top Donors</h2>
              <div className="space-y-3">
                {loadingActivity ? (
                  <p className="text-sm text-neutral-400">Loading...</p>
                ) : activity?.topDonors?.length > 0 ? (
                  activity.topDonors.slice(0, 6).map((donor, i) => (
                    <div key={donor._id} className="flex items-center gap-3">
                      <span className="w-6 text-sm font-bold text-neutral-400">#{i + 1}</span>
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                        {donor.user?.avatar ? (
                          <img src={donor.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          donor.user?.fullName?.[0] || "?"
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{donor.user?.fullName || "Anonymous"}</p>
                        <p className="text-xs text-neutral-400 truncate">{donor.user?.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-neutral-900 dark:text-white">£{donor.totalDonated.toLocaleString()}</p>
                        <p className="text-xs text-neutral-400">{donor.count} donations</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-400">No donor data for this period.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Tasks */}
          {(user?.role === "admin" || user?.role === "superadmin") && (
            <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" /> My Tasks
                </h2>
              </div>
              <div className="space-y-3">
                {loadingTasks ? (
                  <p className="text-sm text-neutral-500">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                  <p className="text-sm text-neutral-500">No tasks assigned.</p>
                ) : (
                  tasks.map((task) => (
                    <div key={task._id} className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{task.title}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{task.description}</p>
                      </div>
                      {task.status !== "Completed" && (
                        <button
                          onClick={() => handleUpdateTaskStatus(task._id, "Completed")}
                          className="shrink-0 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </>
      )}

      {activeTab === "activity" && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Daily Activity Table */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">Daily Donation Activity</h2>
              <span className="text-xs text-neutral-400">Last {daysPeriod} days</span>
            </div>
            {loadingActivity ? (
              <div className="p-6 text-center text-neutral-400 text-sm">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="px-5 py-3 text-left">Date</th>
                      <th className="px-5 py-3 text-right">Total Raised</th>
                      <th className="px-5 py-3 text-right">Donations</th>
                      <th className="px-5 py-3 text-right">Stripe</th>
                      <th className="px-5 py-3 text-right">PayPal</th>
                      <th className="px-5 py-3 text-right">Card</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {activity?.dailyActivity?.length > 0 ? activity.dailyActivity.map((day) => (
                      <tr key={day._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                        <td className="px-5 py-3 font-semibold text-neutral-900 dark:text-white">{day._id}</td>
                        <td className="px-5 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">£{day.total.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right text-neutral-600 dark:text-neutral-400">{day.count}</td>
                        <td className="px-5 py-3 text-right text-violet-600 dark:text-violet-400">£{(day.stripe || 0).toLocaleString()}</td>
                        <td className="px-5 py-3 text-right text-blue-600 dark:text-blue-400">£{(day.paypal || 0).toLocaleString()}</td>
                        <td className="px-5 py-3 text-right text-neutral-500 dark:text-neutral-400">£{(day.card || 0).toLocaleString()}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-neutral-400 text-sm">No activity in this period.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Recent Donations Feed */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">Recent Donations</h2>
            </div>
            {loadingActivity ? (
              <div className="p-6 text-center text-neutral-400 text-sm">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="px-5 py-3 text-left">Donor</th>
                      <th className="px-5 py-3 text-left">Campaign</th>
                      <th className="px-5 py-3 text-center">Method</th>
                      <th className="px-5 py-3 text-right">Amount</th>
                      <th className="px-5 py-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {activity?.recentDonations?.length > 0 ? activity.recentDonations.map((don) => (
                      <tr key={don._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                              {don.donor?.avatar
                                ? <img src={don.donor.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                : (don.donorName?.[0] || "?")
                              }
                            </div>
                            <div>
                              <p className="font-semibold text-neutral-900 dark:text-white">{don.isAnonymous ? "Anonymous" : don.donorName}</p>
                              {don.donor?.email && <p className="text-xs text-neutral-400">{don.donor.email}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-neutral-600 dark:text-neutral-300 max-w-[180px] truncate">{don.campaign?.title || "—"}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            {paymentIcon(don.paymentMethod)}
                            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">{paymentLabel(don.paymentMethod)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">£{don.amount.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right text-xs text-neutral-400">{new Date(don.createdAt).toLocaleDateString()}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-neutral-400 text-sm">No donations in this period.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

    </motion.div>
  );
}
