import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useScrolled } from "../../hooks/index";
import { useAuth } from "../../context/AuthContext";
import { LoginModal, RegisterModal } from "../auth/AuthModals";

const NAV_LINKS = [
  { label: "Campaigns", to: "/campaigns" },
  { label: "Impact", to: "/impact" },
  { label: "Volunteer", to: "/volunteer" },
  {
    label: "About",
    dropdown: [
      { label: "About Us", to: "/about" },
      { label: "Our Team", to: "/team" },
      { label: "Annual Reports", to: "/reports" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

const DropdownMenu = ({ items }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    transition={{ duration: 0.15 }}
    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white dark:bg-neutral-800 rounded-md shadow-card-hover border border-border-light dark:border-neutral-700 overflow-hidden z-50"
  >
    {items.map((item) => (
      <Link
        key={item.to}
        to={item.to}
        className="block px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-primary-50 dark:hover:bg-neutral-700 hover:text-primary font-medium transition-colors"
      >
        {item.label}
      </Link>
    ))}
  </motion.div>
);

// User Profile Dropdown
const USER_MENU_ITEMS = [
  { label: "My Dashboard", icon: "dashboard", to: "/dashboard" },
  { label: "My Donations", icon: "volunteer_activism", to: "/donations" },
  { label: "Profile Settings", icon: "settings", to: "/settings" },
];

const UserProfileDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border-light dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.fullName} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">
            {initials}
          </div>
        )}
        <span className="hidden sm:block text-sm font-semibold text-neutral-700 dark:text-neutral-200 max-w-[100px] truncate">
          {user.fullName.split(" ")[0]}
        </span>
        <span className="material-symbols-outlined text-[16px] text-neutral-400">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-neutral-800 rounded-2xl shadow-card-hover border border-border-light dark:border-neutral-700 overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-heading font-bold text-sm text-neutral-900 dark:text-white truncate">{user.fullName}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {USER_MENU_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-primary-50 dark:hover:bg-neutral-700 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] text-neutral-400">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-border-light dark:border-neutral-700 py-2">
              <button
                onClick={() => {
                  onLogout();
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = ({ darkMode, toggleDark }) => {
  const scrolled = useScrolled(60);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, isAuthenticated, logout } = useAuth();

  // Auth Modal States
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-nav border-b border-border-light dark:border-neutral-800"
            : "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm"
        }`}
      >
        <div className="container-max">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-white text-[18px]">cruelty_free</span>
              </div>
              <span className="font-heading font-extrabold text-lg text-neutral-900 dark:text-white tracking-tight">
                Crescent <span className="text-gradient-primary">Relief</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.to ? (
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                          isActive
                            ? "bg-primary-50 dark:bg-primary/20 text-primary"
                            : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ) : (
                    <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                      {link.label}
                      <span className="material-symbols-outlined text-[16px] text-neutral-400">expand_more</span>
                    </button>
                  )}
                  <AnimatePresence>
                    {link.dropdown && activeDropdown === link.label && (
                      <DropdownMenu items={link.dropdown} />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDark}
                className="w-9 h-9 rounded-full border border-border-light dark:border-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {darkMode ? "light_mode" : "dark_mode"}
                </span>
              </button>

              {/* Auth Section */}
              {isAuthenticated ? (
                <UserProfileDropdown user={user} onLogout={logout} />
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="hidden lg:block text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </button>
              )}

              <Link to="/campaigns" className="hidden sm:inline-flex btn-accent text-sm px-5 py-2.5 rounded-full font-heading font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg">
                Donate Now
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 rounded-full border border-border-light dark:border-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle menu"
              >
                <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white dark:bg-neutral-900 z-50 flex flex-col shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-border-light dark:border-neutral-800">
                <span className="font-heading font-bold text-lg text-neutral-900 dark:text-white">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 rounded-full border border-border-light dark:border-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Mobile User Info (if logged in) */}
              {isAuthenticated && user && (
                <div className="p-5 border-b border-border-light dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                      {user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm text-neutral-900 dark:text-white">{user.fullName}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-xs font-bold py-2 rounded-lg bg-primary/10 text-primary">
                      Dashboard
                    </Link>
                    <Link to="/settings" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-xs font-bold py-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200">
                      Settings
                    </Link>
                  </div>
                </div>
              )}

              <nav className="flex-1 p-5 space-y-1">
                {NAV_LINKS.map((link) => (
                  <div key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3 rounded-xl text-base font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-primary-50 dark:hover:bg-neutral-800 hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <>
                        <p className="px-4 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider mt-3">{link.label}</p>
                        {link.dropdown?.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </nav>

              <div className="p-5 border-t border-border-light dark:border-neutral-800 space-y-3">
                {isAuthenticated ? (
                  <button
                    onClick={() => { setMobileOpen(false); logout(); }}
                    className="btn-secondary w-full rounded-full justify-center text-sm text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <span className="material-symbols-outlined text-[18px] mr-1">logout</span>
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => { setMobileOpen(false); setShowLogin(true); }}
                    className="btn-secondary w-full rounded-full justify-center text-sm"
                  >
                    Sign In
                  </button>
                )}
                <Link to="/campaigns" onClick={() => setMobileOpen(false)} className="btn-accent w-full rounded-full justify-center text-sm font-bold text-center block py-3">
                  Donate Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16 md:h-18" />

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
      />
    </>
  );
};

export default Navbar;
