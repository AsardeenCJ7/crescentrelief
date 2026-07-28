import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Lock, CheckCircle2 } from "lucide-react";

export default function SetupPassword() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { usersList, setPassword } = useAuth();
  
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const targetUser = usersList.find(u => u.id === parseInt(userId));

  if (!targetUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center p-8 bg-white dark:bg-neutral-950 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
          <h1 className="text-xl font-bold text-red-500 mb-2">Invalid Link</h1>
          <p className="text-neutral-500 dark:text-neutral-400">This setup link is invalid or expired.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordInput.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (passwordInput !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setPassword(targetUser.id, passwordInput);
    setSuccess(true);
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-neutral-950 p-8 rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-800"
      >
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
          <Lock className="w-6 h-6" />
        </div>
        
        <h1 className="text-2xl font-heading font-extrabold text-neutral-900 dark:text-white mb-2">Setup Your Password</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
          Welcome, {targetUser.fullName}. Please set a secure password for your new admin account.
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {success ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Password Set Successfully!</h2>
            <p className="text-neutral-500 dark:text-neutral-400">Redirecting to login...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">New Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-primary text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-primary text-neutral-900 dark:text-white"
              />
            </div>
            <button type="submit" className="w-full btn-primary py-3.5 rounded-xl font-bold mt-4 shadow-md hover:shadow-lg transition-all">
              Complete Setup
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
