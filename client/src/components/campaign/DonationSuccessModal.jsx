import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Heart, Share2, X } from "lucide-react";

const DonationSuccessModal = ({ isOpen, onClose, donation }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
        onClose();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !donation) return null;

  const shareText = `I just donated £${donation.amount} to "${donation.campaign?.title || "a great cause"}" on Crescent Relief! Join me in making a difference. 🌙 #CrescentRelief`;
  const shareUrl = `${window.location.origin}/campaigns/${donation.campaign?.slug || ""}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "I made a donation!", text: shareText, url: shareUrl });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert("Share link copied to clipboard!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Top gradient banner */}
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-primary p-8 text-center relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {/* Animated check */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2, damping: 15 }}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <CheckCircle className="w-12 h-12 text-emerald-500" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-extrabold text-white font-heading mb-1"
              >
                JazakAllah Khayran! 🌙
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/80 text-sm"
              >
                Your donation has been processed
              </motion.p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Amount highlight */}
              <div className="text-center">
                <span className="text-4xl font-extrabold font-heading text-neutral-900 dark:text-white">
                  £{donation.amount?.toLocaleString()}
                </span>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  donated to{" "}
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    {donation.campaign?.title || "this campaign"}
                  </span>
                </p>
              </div>

              {/* Receipt details */}
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-4 space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 dark:text-neutral-400">Transaction ID</span>
                  <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200 text-xs">
                    {donation.transactionId}
                  </span>
                </div>
                {donation.certificateId && (
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 dark:text-neutral-400">Certificate ID</span>
                    <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200 text-xs">
                      {donation.certificateId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 dark:text-neutral-400">Payment Method</span>
                  <span className="font-semibold capitalize text-neutral-800 dark:text-neutral-200">
                    {donation.paymentMethod || "Card"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 dark:text-neutral-400">Status</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Completed
                  </span>
                </div>
              </div>

              {/* Gift Aid bonus note */}
              {donation.giftAidAmount > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300">
                  <span className="font-bold">🎁 Gift Aid Bonus:</span> An additional{" "}
                  <strong>£{donation.giftAidAmount?.toFixed(2)}</strong> will be claimed from HMRC,
                  making your total impact <strong>£{(donation.amount + donation.giftAidAmount).toFixed(2)}</strong>!
                </div>
              )}

              {/* Thank you message */}
              <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                A receipt has been sent to your email
              </p>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-border-light dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-sm hover:border-primary/40 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={() => { navigate("/dashboard"); onClose(); }}
                  className="flex-1 btn-accent py-3 rounded-xl font-heading font-bold text-sm shadow-button hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  View My Donations
                </button>
              </div>

              {/* Auto-redirect bar */}
              <div className="text-center">
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-2">
                  Redirecting to dashboard in 6 seconds...
                </p>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DonationSuccessModal;
