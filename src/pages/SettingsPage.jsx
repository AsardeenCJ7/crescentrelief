import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/api";
import { User, Lock, Bell, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user } = useAuth();
  
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      country: user?.address?.country || "",
      postcode: user?.address?.postcode || ""
    }
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [preferences, setPreferences] = useState({
    newsletterSubscribed: user?.newsletterSubscribed || false,
    giftAidEnabled: user?.giftAidEnabled || false
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [prefLoading, setPrefLoading] = useState(false);

  const [profileStatus, setProfileStatus] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [prefStatus, setPrefStatus] = useState(null);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await userService.updateProfile(profileForm);
      setProfileStatus({ type: "success", message: "Profile updated successfully!" });
    } catch (err) {
      setProfileStatus({ type: "error", message: err.message || "Failed to update profile." });
    }
    setProfileLoading(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: "error", message: "New passwords do not match." });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordStatus({ type: "error", message: "Password must be at least 8 characters." });
      return;
    }
    
    setPasswordLoading(true);
    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordStatus({ type: "success", message: "Password updated successfully!" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordStatus({ type: "error", message: err.message || "Failed to update password." });
    }
    setPasswordLoading(false);
  };

  const handlePreferencesUpdate = async (key, value) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    setPrefLoading(true);
    try {
      await userService.updateProfile({ [key]: value });
      setPrefStatus({ type: "success", message: "Preferences saved!" });
      setTimeout(() => setPrefStatus(null), 3000);
    } catch (err) {
      setPrefStatus({ type: "error", message: err.message || "Failed to save." });
    }
    setPrefLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-24 pb-16">
      <div className="container-max max-w-4xl">
        <h1 className="text-3xl font-heading font-bold text-neutral-900 dark:text-white mb-8">Account Settings</h1>
        
        <div className="space-y-8">
          {/* Profile Section */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm border border-border-light dark:border-neutral-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="text-primary w-5 h-5" />
              </div>
              <h2 className="text-xl font-heading font-bold text-neutral-900 dark:text-white">Profile Details</h2>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:border-primary/50 dark:focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:border-primary/50 dark:focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border-light dark:border-neutral-700">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">Address (Required for Gift Aid)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Street Address</label>
                    <input
                      type="text"
                      value={profileForm.address.street}
                      onChange={(e) => setProfileForm({...profileForm, address: {...profileForm.address, street: e.target.value}})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:border-primary/50 dark:focus:border-primary/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">City</label>
                    <input
                      type="text"
                      value={profileForm.address.city}
                      onChange={(e) => setProfileForm({...profileForm, address: {...profileForm.address, city: e.target.value}})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:border-primary/50 dark:focus:border-primary/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Postcode / Zip</label>
                    <input
                      type="text"
                      value={profileForm.address.postcode}
                      onChange={(e) => setProfileForm({...profileForm, address: {...profileForm.address, postcode: e.target.value}})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:border-primary/50 dark:focus:border-primary/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Country</label>
                    <input
                      type="text"
                      value={profileForm.address.country}
                      onChange={(e) => setProfileForm({...profileForm, address: {...profileForm.address, country: e.target.value}})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:border-primary/50 dark:focus:border-primary/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {profileStatus && (
                <div className={`p-4 rounded-xl flex items-center gap-2 ${profileStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                  {profileStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="font-medium text-sm">{profileStatus.message}</span>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button type="submit" disabled={profileLoading} className="btn-primary px-8 py-3 rounded-xl shadow-button hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Profile
                </button>
              </div>
            </form>
          </motion.section>

          {/* Security Section */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm border border-border-light dark:border-neutral-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Lock className="text-amber-500 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-neutral-900 dark:text-white">Security & Password</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage your login credentials.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {user?.authProvider === 'local' ? (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:border-amber-500/50 dark:focus:border-amber-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                ) : (
                  <div className="md:col-span-2 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex gap-3 text-amber-800 dark:text-amber-200">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">You signed up using Google. You can set a password here so you can also log in using your email and password.</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:border-amber-500/50 dark:focus:border-amber-500/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:border-amber-500/50 dark:focus:border-amber-500/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {passwordStatus && (
                <div className={`p-4 rounded-xl flex items-center gap-2 ${passwordStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                  {passwordStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="font-medium text-sm">{passwordStatus.message}</span>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button type="submit" disabled={passwordLoading} className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold shadow-button hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {user?.authProvider === 'local' ? 'Update Password' : 'Set Password'}
                </button>
              </div>
            </form>
          </motion.section>

          {/* Preferences Section */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white dark:bg-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm border border-border-light dark:border-neutral-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Bell className="text-purple-500 w-5 h-5" />
              </div>
              <h2 className="text-xl font-heading font-bold text-neutral-900 dark:text-white">Preferences</h2>
              
              {prefStatus && (
                <span className="ml-auto text-sm font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> {prefStatus.message}
                </span>
              )}
            </div>

            <div className="space-y-6">
              <label className="flex items-center justify-between cursor-pointer p-4 rounded-2xl border border-border-light dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white">Newsletter Updates</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Receive stories of impact and campaign updates.</p>
                </div>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={preferences.newsletterSubscribed}
                    onChange={(e) => handlePreferencesUpdate('newsletterSubscribed', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer p-4 rounded-2xl border border-border-light dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white">Gift Aid Declarations (UK)</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-md">Boost your donations by 25% at no extra cost if you are a UK taxpayer. Address must be filled out above.</p>
                </div>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={preferences.giftAidEnabled}
                    onChange={(e) => handlePreferencesUpdate('giftAidEnabled', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
                </div>
              </label>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
