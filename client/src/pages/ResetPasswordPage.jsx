import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { authService } from "../services/api";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];
  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authService.resetPassword(token, { password });
      setSuccess(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-primary to-secondary px-8 py-6 text-center">
          <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-white text-[28px]">lock_reset</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white">
            {success ? "Password Reset!" : "Set New Password"}
          </h1>
          <p className="text-white/80 text-sm mt-1">
            {success ? "You're all set. Redirecting to sign in..." : "Create a strong, unique password for your account."}
          </p>
        </div>

        <div className="p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[44px]">verified</span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden mt-4">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  style={{ width: "100%", animation: "progress 3s linear forwards" }}
                />
              </div>
              <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
              <Link
                to="/"
                className="inline-block btn-accent px-8 py-3 rounded-xl font-heading font-bold text-sm shadow-button hover:shadow-lg transition-all mt-2"
              >
                Go to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {error}
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-neutral-400">lock</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    placeholder="Min. 8 characters"
                    className="w-full pl-11 pr-11 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/50 dark:focus:border-primary/50 focus:bg-white dark:focus:bg-neutral-700 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>

                {/* Strength meter */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength ? strengthColor[strength] : "bg-neutral-200 dark:bg-neutral-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-semibold ${
                      strength <= 1 ? "text-red-500" :
                      strength === 2 ? "text-amber-500" :
                      strength === 3 ? "text-blue-500" : "text-emerald-500"
                    }`}>
                      {strengthLabel[strength]} password
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-neutral-400">lock_open</span>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat your password"
                    className={`w-full pl-11 pr-11 py-3 rounded-xl border-2 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 focus:outline-none focus:bg-white dark:focus:bg-neutral-700 transition-all ${
                      confirmPassword && confirmPassword !== password
                        ? "border-red-400 dark:border-red-600"
                        : confirmPassword && confirmPassword === password
                        ? "border-emerald-400 dark:border-emerald-600"
                        : "border-border-light dark:border-neutral-700 focus:border-primary/50 dark:focus:border-primary/50"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirm ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                  {confirmPassword && (
                    <span className={`absolute right-11 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] ${
                      confirmPassword === password ? "text-emerald-500" : "text-red-400"
                    }`}>
                      {confirmPassword === password ? "check_circle" : "cancel"}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-accent w-full py-3.5 rounded-xl font-heading font-bold text-base shadow-button hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Resetting...</>
                ) : (
                  "Reset Password"
                )}
              </button>

              <p className="text-center text-xs text-neutral-400 dark:text-neutral-500">
                Remembered your password?{" "}
                <Link to="/" className="text-primary dark:text-primary-400 font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
