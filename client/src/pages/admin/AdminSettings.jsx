import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Shield, CreditCard, Mail, Globe, Bell, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, updateProfile } = useAuth();
  
  const [profileName, setProfileName] = useState(user?.fullName || "");

  const handleSaveProfile = () => {
    if (user) {
      updateProfile(user.id, { fullName: profileName });
      alert("Profile updated successfully!");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-neutral-900 dark:text-white">Settings</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Configure global application settings and personal preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mt-8">
        
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-1">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'profile' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'}`}
          >
            <User className="w-4 h-4" /> My Profile
          </button>
          <button 
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'general' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'}`}
          >
            <Globe className="w-4 h-4" /> General
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors">
            <CreditCard className="w-4 h-4" /> Payments
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors">
            <Mail className="w-4 h-4" /> Email Templates
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors">
            <Shield className="w-4 h-4" /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {activeTab === "profile" && (
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">My Profile</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-primary text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-neutral-400 mt-1">Email address cannot be changed.</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={handleSaveProfile} className="btn-primary py-2.5 px-6 rounded-xl flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {activeTab === "general" && (
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">General Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Organization Name</label>
                  <input 
                    type="text" 
                    defaultValue="Crescent Relief"
                    className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-primary text-neutral-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Contact Email</label>
                  <input 
                    type="email" 
                    defaultValue="support@crescentrelief.org"
                    className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-primary text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Support Phone</label>
                  <input 
                    type="text" 
                    defaultValue="+44 20 1234 5678"
                    className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-primary text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Currency</label>
                  <select className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-primary text-neutral-900 dark:text-white">
                    <option>USD ($)</option>
                    <option>GBP (£)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="btn-primary py-2.5 px-6 rounded-xl flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
