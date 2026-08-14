import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const { login, googleAuth, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = login, 2 = success, 3 = verify-otp
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setError("");
      setUnverifiedEmail("");
    }
  }, [isOpen]);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setError("");
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        
        const loggedInUser = await googleAuth({
          email: userInfo.data.email,
          fullName: userInfo.data.name,
          googleId: userInfo.data.sub,
          avatar: userInfo.data.picture,
        });
        setStep(2);
        setTimeout(() => {
          if (loggedInUser.role === "superadmin" || loggedInUser.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
          onClose();
        }, 1500);
      } catch (err) {
        setError(err.message || "Google login failed. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError("Google sign-in was cancelled or failed.");
      setGoogleLoading(false);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      setLoading(false);
      setStep(2);
      setTimeout(() => {
        if (loggedInUser.role === "superadmin" || loggedInUser.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
        onClose();
      }, 1500);
    } catch (err) {
      setLoading(false);
      if (err.message === "EMAIL_NOT_VERIFIED") {
        // Switch to OTP verification mode for this email
        setUnverifiedEmail(email);
        setStep(3);
        // Trigger resend OTP automatically
        try { await resendOtp(email); } catch (_) { /* ignore */ }
      } else {
        setError(err.message || "Login failed");
      }
    }
  };

  if (!isOpen) return null;

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
              <span className="font-heading font-extrabold text-lg text-neutral-900 dark:text-white">
                {step === 3 ? "Verify Email" : "Sign In"}
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
            {step === 2 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 animate-pulse">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[52px]">verified</span>
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-neutral-900 dark:text-white mb-2">
                  Login Successful! 🎉
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
                  You are being redirected to your dashboard...
                </p>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-[progress_1.5s_linear_forwards]" style={{ width: "100%", animation: "progress 1.5s linear forwards" }} />
                </div>
                <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
              </div>
            ) : step === 3 ? (
              /* ── STEP 3: Unverified email - OTP verification ── */
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[32px]">mark_email_read</span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-neutral-900 dark:text-white mb-2">One last step!</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                    Your account was registered but not yet verified. We've sent a verification code to{" "}
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">{unverifiedEmail}</span>
                  </p>
                </div>
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 text-center">Enter 6-digit Verification Code</label>
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    autoFocus
                    className="w-full text-center tracking-[0.5em] text-2xl py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold focus:outline-none focus:border-primary/50 transition-all font-mono"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setOtpInput(""); setError(""); }}
                    className="w-1/3 py-3 rounded-xl font-bold text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={otpLoading || otpInput.length < 6}
                    onClick={async () => {
                      setError("");
                      setOtpLoading(true);
                      try {
                        const user = await verifyOtp(unverifiedEmail, otpInput);
                        setStep(2);
                        setTimeout(() => {
                          navigate(user.role === "admin" || user.role === "superadmin" ? "/admin" : "/dashboard");
                          onClose();
                        }, 1500);
                      } catch (err) {
                        setError(err.message || "Invalid code. Please try again.");
                      } finally {
                        setOtpLoading(false);
                      }
                    }}
                    className="w-2/3 btn-accent py-3 rounded-xl font-heading font-bold text-base shadow-button hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {otpLoading ? (
                      <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Verifying...</>
                    ) : (
                      "Verify & Sign In"
                    )}
                  </button>
                </div>
                <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
                  Didn't receive a code?{" "}
                  <button
                    onClick={async () => { try { await resendOtp(unverifiedEmail); } catch (_) {} }}
                    className="text-primary font-semibold hover:underline"
                  >
                    Resend
                  </button>
                </p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    {error}
                  </div>
                )}

                <button
                  onClick={() => handleGoogleLogin()}
                  disabled={googleLoading || loading}
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <span className="w-5 h-5 border-2 border-neutral-300 border-t-primary rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  {googleLoading ? "Signing in..." : "Continue with Google"}
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
                    disabled={loading || googleLoading}
                    className="btn-accent w-full py-3.5 mt-2 rounded-xl font-heading font-bold text-base shadow-button hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing In...</>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
                  Don't have an account?{" "}
                  <button onClick={onSwitchToRegister} className="text-primary dark:text-primary-400 font-semibold hover:underline">
                    Create Account
                  </button>
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState(1); // 1 = form, 2 = otp, 3 = success
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [otpInput, setOtpInput] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const { register, verifyOtp, resendOtp, googleAuth } = useAuth();
  const navigate = useNavigate();

  // Reset form every time modal opens fresh
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setForm({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
      setOtpInput("");
      setDevOtp("");
      setShowPassword(false);
      setAgreedTerms(false);
      setError("");
      setResendSuccess("");
    }
  }, [isOpen]);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setError("");
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        const loggedInUser = await googleAuth({
          email: userInfo.data.email,
          fullName: userInfo.data.name,
          googleId: userInfo.data.sub,
          avatar: userInfo.data.picture,
        });
        onClose();
        if (loggedInUser?.role === "admin" || loggedInUser?.role === "superadmin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        setError(err.message || "Google sign-up failed. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError("Google sign-in was cancelled or failed.");
      setGoogleLoading(false);
    }
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegisterSubmit = async () => {
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
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
    try {
      setLoading(true);
      const res = await register(form);
      if (res.otp) setDevOtp(res.otp);
      setStep(2);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otpInput.length < 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }
    setError("");
    try {
      setLoading(true);
      const verifiedUser = await verifyOtp(form.email, otpInput);
      const role = verifiedUser?.role || "donor";
      setLoading(false);

      // Step 3: show success screen
      setStep(3);

      // After 2s navigate and close
      setTimeout(() => {
        if (role === "admin" || role === "superadmin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
        onClose();
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Invalid or expired verification code.");
    }
  };

  const handleResend = async () => {
    setError("");
    setResendSuccess("");
    try {
      setResending(true);
      const res = await resendOtp(form.email);
      if (res.otp) setDevOtp(res.otp);
      setResendSuccess("A new verification code has been sent to your email.");
      setTimeout(() => setResendSuccess(""), 5000);
    } catch (err) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial="hidden" animate="visible" exit="hidden"
          variants={overlayVariants}
          onClick={step !== 3 ? onClose : undefined}
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial="hidden" animate="visible" exit="hidden"
          variants={modalVariants}
          className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-[500px] relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto transition-colors duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border-light dark:border-neutral-800 sticky top-0 bg-white dark:bg-neutral-900 z-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[18px]">volunteer_activism</span>
              </div>
              <span className="font-heading font-extrabold text-lg text-neutral-900 dark:text-white">
                {step === 1 ? "Create Account" : step === 2 ? "Verify Email" : "Account Verified"}
              </span>
            </div>
            {step !== 3 && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5">

            {/* ── STEP 3: SUCCESS SCREEN ── */}
            {step === 3 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 animate-pulse">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[52px]">verified</span>
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-neutral-900 dark:text-white mb-2">
                  Account Verified! 🎉
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
                  Your email has been verified successfully. You are now logged in and being redirected to your dashboard...
                </p>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-[progress_2s_linear_forwards]" style={{ width: "100%", animation: "progress 2s linear forwards" }} />
                </div>
                <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
              </div>
            )}

            {/* ── STEP 1 & 2: Error / Success Banners ── */}
            {step !== 3 && (
              <>
                {error && (
                  <div className="mb-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    {error}
                  </div>
                )}
                {resendSuccess && (
                  <div className="mb-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">mark_email_read</span>
                    {resendSuccess}
                  </div>
                )}
              </>
            )}

            {/* ── STEP 1: REGISTRATION FORM ── */}
            {step === 1 && (
              <>
                {/* Google Sign Up */}
                <button
                  onClick={() => handleGoogleLogin()}
                  disabled={googleLoading}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <span className="w-5 h-5 border-2 border-neutral-300 border-t-primary rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  {googleLoading ? "Signing in..." : "Continue with Google"}
                </button>

                <div className="flex items-center gap-4 mb-3">
                  <div className="h-px bg-border-light dark:bg-neutral-700 flex-1"></div>
                  <span className="text-xs font-semibold text-neutral-400">OR</span>
                  <div className="h-px bg-border-light dark:bg-neutral-700 flex-1"></div>
                </div>

                {/* Registration Form */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Full Name *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-neutral-400">person</span>
                      <input
                        type="text" name="fullName" value={form.fullName} onChange={handleChange}
                        placeholder="e.g. Ahmed Mohamed"
                        className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/60 dark:focus:border-primary/60 focus:bg-white dark:focus:bg-neutral-700 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-neutral-400">mail</span>
                        <input
                          type="email" name="email" value={form.email} onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/60 dark:focus:border-primary/60 focus:bg-white dark:focus:bg-neutral-700 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Phone <span className="text-neutral-400 font-normal">(Optional)</span></label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-neutral-400">call</span>
                        <input
                          type="tel" name="phone" value={form.phone} onChange={handleChange}
                          placeholder="+44 7000 000000"
                          className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/60 dark:focus:border-primary/60 focus:bg-white dark:focus:bg-neutral-700 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Password *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-neutral-400">lock</span>
                        <input
                          type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                          placeholder="Min 8 chars"
                          className="w-full pl-10 pr-10 py-2 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/60 dark:focus:border-primary/60 focus:bg-white dark:focus:bg-neutral-700 transition-all"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                          <span className="material-symbols-outlined text-[18px]">{showPassword ? "visibility_off" : "visibility"}</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Confirm Password *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-neutral-400">lock</span>
                        <input
                          type={showPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                          placeholder="Re-enter"
                          className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/60 dark:focus:border-primary/60 focus:bg-white dark:focus:bg-neutral-700 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer group pt-1">
                    <input
                      type="checkbox" checked={agreedTerms} onChange={e => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 rounded border-neutral-300 text-primary focus:ring-primary/30 accent-primary shrink-0"
                    />
                    <span className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors leading-snug">
                      I agree to the{" "}
                      <a href="/terms" className="text-primary dark:text-primary-400 font-semibold hover:underline">Terms & Conditions</a>
                      {" "}and{" "}
                      <a href="/privacy" className="text-primary dark:text-primary-400 font-semibold hover:underline">Privacy Policy</a>
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleRegisterSubmit}
                    disabled={loading}
                    className="btn-accent w-full py-2.5 mt-1 rounded-xl font-heading font-bold text-sm shadow-button hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending OTP...</>
                    ) : (
                      "Continue →"
                    )}
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 2: OTP VERIFICATION ── */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-primary text-[32px]">mark_email_read</span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-neutral-900 dark:text-white mb-2">Check Your Email</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                    We've sent a 6-digit verification code to{" "}
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">{form.email}</span>
                  </p>
                  {devOtp && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-800 dark:text-amber-300 text-xs text-center font-mono">
                      <span className="font-semibold font-sans block mb-1">🔧 Development Mode Code:</span>
                      <span className="text-xl font-bold tracking-[0.2em]">{devOtp}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 text-center">Enter Verification Code</label>
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    autoFocus
                    className="w-full text-center tracking-[0.5em] text-2xl py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold focus:outline-none focus:border-primary/50 transition-all font-mono"
                  />
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    disabled={resending}
                    onClick={handleResend}
                    className="text-xs sm:text-sm text-primary hover:text-primary-600 font-semibold transition-colors disabled:opacity-50"
                  >
                    {resending ? "Resending..." : "Didn't receive a code? Resend"}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(""); setOtpInput(""); }}
                    className="w-1/3 py-3.5 rounded-xl font-bold text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleOtpSubmit}
                    disabled={loading || otpInput.length < 6}
                    className="w-2/3 btn-accent py-3.5 rounded-xl font-heading font-bold text-base shadow-button hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Verifying...</>
                    ) : (
                      "Verify & Create Account"
                    )}
                  </button>
                </div>
              </div>
            )}

            {step !== 3 && (
              <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-4">
                Already have an account?{" "}
                <button onClick={onSwitchToLogin} className="text-primary dark:text-primary-400 font-semibold hover:underline">
                  Sign In
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

