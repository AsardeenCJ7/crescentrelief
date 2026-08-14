import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { 
  LayoutDashboard, Users, Heart, Settings, Menu, X, Bell, LogOut
} from "lucide-react";

const ADMIN_LINKS = [
  { path: "/admin", icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview" },
  { path: "/admin/campaigns", icon: <Heart className="w-5 h-5" />, label: "Campaigns" },
  { path: "/admin/users", icon: <Users className="w-5 h-5" />, label: "Donors" },
  { path: "/admin/settings", icon: <Settings className="w-5 h-5" />, label: "Settings" },
];

const AdminLayout = ({ darkMode, toggleDark }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: sidebarOpen ? 0 : window.innerWidth >= 1024 ? 0 : "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col shadow-xl lg:shadow-none lg:static lg:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <Link to="/admin" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[18px]">admin_panel_settings</span>
            </div>
            <span className="font-heading font-extrabold text-lg text-neutral-900 dark:text-white tracking-tight">
              Admin <span className="text-gradient-primary">Panel</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {ADMIN_LINKS.map(link => {
            const isActive = location.pathname === link.path || (link.path !== "/admin" && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all w-full text-left">
            <span className="material-symbols-outlined text-[20px]">public</span>
            Back to Site
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all w-full text-left">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="hidden sm:block font-heading font-bold text-lg text-neutral-900 dark:text-white">
              Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                {darkMode ? "light_mode" : "dark_mode"}
              </span>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-neutral-950"></span>
            </button>
            
            <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800 mx-2 hidden sm:block"></div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">
                {user?.fullName?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                {user?.fullName?.split(" ")[0] || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-neutral-50 dark:bg-neutral-900">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
