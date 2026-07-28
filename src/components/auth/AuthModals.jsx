import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
};

export const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, googleAuth } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    googleAuth();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    try {
      const loggedInUser = login(email, password);
      setEmail("");
      setPassword("");
      onClose();
      if (loggedInUser.role === "superadmin" || loggedInUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={modalVariants}
          className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden transition-colors duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[18px]">cruelty_free</span>
              </div>
              <span className="font-heading font-extrabold text-lg text-neutral-900 dark:text-white">Sign In</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-border-light dark:bg-neutral-700 flex-1"></div>
              <span className="text-xs font-semibold text-neutral-400">OR</span>
              <div className="h-px bg-border-light dark:bg-neutral-700 flex-1"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-neutral-400">mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/50 dark:focus:border-primary/50 focus:bg-white dark:focus:bg-neutral-700 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Password</label>
                  <button type="button" className="text-xs text-primary dark:text-primary-400 font-semibold hover:underline">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-neutral-400">lock</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
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
              </div>

              <button
                type="submit"
                className="btn-accent w-full py-3.5 mt-2 rounded-xl font-heading font-bold text-base shadow-button hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </form>

            <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
              Don't have an account?{" "}
              <button onClick={onSwitchToRegister} className="text-primary dark:text-primary-400 font-semibold hover:underline">
                Create Account
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState("");
  const { register, googleAuth } = useAuth();

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    googleAuth();
    onClose();
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
        setError("Please fill in all required fields.");
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!agreedTerms) {
        setError("You must agree to the Terms & Conditions.");
        return;
      }
      setError("");
      setStep(2);
    } else {
      if (otp.length < 6) {
        setError("Please enter the 6-digit verification code.");
        return;
      }
      setError("");
      register(form);
      setForm({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
      setAgreedTerms(false);
      setStep(1);
      setOtp("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={modalVariants}
          className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-[500px] relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto transition-colors duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-neutral-800 sticky top-0 bg-white dark:bg-neutral-900 z-20 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[18px]">volunteer_activism</span>
              </div>
              <span className="font-heading font-extrabold text-lg text-neutral-900 dark:text-white">
                {step === 1 ? "Create Account" : "Verify Email"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            {step === 1 ? (
              <>
                <button
                  onClick={handleGoogleLogin}
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all mb-6"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-border-light dark:bg-neutral-700 flex-1"></div>
                  <span className="text-xs font-semibold text-neutral-400">OR</span>
                  <div className="h-px bg-border-light dark:bg-neutral-700 flex-1"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-neutral-400">person</span>
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/50 dark:focus:border-primary/50 focus:bg-white dark:focus:bg-neutral-700 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Email *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-neutral-400">mail</span>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="you@example.com"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/50 dark:focus:border-primary/50 focus:bg-white dark:focus:bg-neutral-700 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Phone</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-neutral-400">call</span>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+44 7000 000000"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/50 dark:focus:border-primary/50 focus:bg-white dark:focus:bg-neutral-700 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Password *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-neutral-400">lock</span>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          required
                          minLength={6}
                          placeholder="Min 6 chars"
                          className="w-full pl-11 pr-10 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/50 dark:focus:border-primary/50 focus:bg-white dark:focus:bg-neutral-700 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Confirm *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-neutral-400">lock</span>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          required
                          placeholder="Re-enter"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/50 dark:focus:border-primary/50 focus:bg-white dark:focus:bg-neutral-700 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer group pt-2">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary/30 accent-primary"
                    />
                    <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                      I agree to the <a href="/terms" className="text-primary dark:text-primary-400 font-semibold hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-primary dark:text-primary-400 font-semibold hover:underline">Privacy Policy</a>
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="btn-accent w-full py-3.5 mt-2 rounded-xl font-heading font-bold text-base shadow-button hover:shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    Continue
                  </button>
                </form>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-primary text-[32px]">mark_email_read</span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-neutral-900 dark:text-white mb-2">Check Your Email</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                    We've sent a 6-digit verification code to <span className="font-semibold text-neutral-700 dark:text-neutral-300">{form.email}</span>
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 text-center">Enter Verification Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.5em] text-2xl py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3.5 rounded-xl font-bold text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 btn-accent py-3.5 rounded-xl font-heading font-bold text-base shadow-button hover:shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    Verify & Create Account
                  </button>
                </div>
              </form>
            )}

            <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
              Already have an account?{" "}
              <button onClick={onSwitchToLogin} className="text-primary dark:text-primary-400 font-semibold hover:underline">
                Sign In
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
