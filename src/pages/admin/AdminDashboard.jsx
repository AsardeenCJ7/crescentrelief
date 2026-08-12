import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, Heart, Wallet, ArrowUpRight, ArrowDownRight, ClipboardList, CheckCircle2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { taskService } from "../../services/api";

const STATS = [
  { title: "Total Raised", value: "$1,245,000", trend: "+15%", positive: true, icon: <Wallet /> },
  { title: "Active Campaigns", value: "24", trend: "+2", positive: true, icon: <Heart /> },
  { title: "Total Donors", value: "8,432", trend: "+120", positive: true, icon: <Users /> },
  { title: "Avg. Donation", value: "$145", trend: "-5%", positive: false, icon: <TrendingUp /> },
];

const RECENT_TRANSACTIONS = [
  { id: "TRX-1029", user: "Ahmed M.", amount: "$500", campaign: "Gaza Emergency Relief", date: "2 mins ago", status: "Completed" },
  { id: "TRX-1028", user: "Sarah K.", amount: "$50", campaign: "Clean Water for Yemen", date: "15 mins ago", status: "Completed" },
  { id: "TRX-1027", user: "Anonymous", amount: "$1,000", campaign: "Orphan Sponsorship", date: "1 hour ago", status: "Pending" },
  { id: "TRX-1026", user: "Omar R.", amount: "$20", campaign: "Medical Supplies", date: "2 hours ago", status: "Completed" },
  { id: "TRX-1025", user: "Fatima A.", amount: "$150", campaign: "Gaza Emergency Relief", date: "3 hours ago", status: "Completed" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      fetchTasks();
    }
  }, [user]);

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

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await taskService.update(taskId, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task status:", error);
      alert("Failed to update task.");
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Welcome back. Here is what's happening today.</p>
        </div>
        <button className="btn-primary py-2 px-4 text-sm rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {STATS.map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full ${stat.positive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-neutral-500 dark:text-neutral-400 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        {/* Main Chart Area (Mock) */}
        <motion.div variants={itemVariants} className="xl:col-span-2 bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Donation Trends</h2>
            <select className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full flex items-end justify-between gap-2 pb-4">
            {/* Mock Chart Bars */}
            {[40, 60, 45, 80, 50, 90, 75].map((height, i) => (
              <div key={i} className="w-full bg-primary/10 dark:bg-primary/20 rounded-t-lg relative group">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all duration-1000 group-hover:opacity-80" 
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </motion.div>

        {/* Right Column: Transactions & Tasks */}
        <div className="flex flex-col gap-6 h-full">
          {/* Tasks List */}
          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col flex-1 min-h-[300px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" /> My Tasks
                </h2>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {loadingTasks ? (
                  <p className="text-sm text-neutral-500">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                  <p className="text-sm text-neutral-500">No tasks assigned.</p>
                ) : (
                  tasks.map((task) => (
                    <div key={task._id} className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{task.title}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">{task.description}</p>
                      {task.status !== 'Completed' && (
                        <button 
                          onClick={() => handleUpdateTaskStatus(task._id, 'Completed')}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Mark as done
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Recent Transactions List */}
          <motion.div variants={itemVariants} className={`bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col ${(user?.role === 'admin' || user?.role === 'superadmin') ? 'flex-1 min-h-[300px]' : 'h-full'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Recent Donations</h2>
              <button className="text-primary text-sm font-semibold hover:underline">View All</button>
            </div>
            
            <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {RECENT_TRANSACTIONS.map((trx, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${trx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    <span className="material-symbols-outlined text-[20px]">{trx.status === 'Completed' ? 'check' : 'schedule'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">{trx.user}</h4>
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">{trx.amount}</span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{trx.campaign}</p>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 uppercase font-semibold tracking-wider">{trx.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

    </motion.div>
  );
}
