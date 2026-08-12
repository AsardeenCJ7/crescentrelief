import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, getDaysLeftLabel } from "../../utils/formatters";
import ProgressBar from "../common/ProgressBar";
import { useAuth } from "../../context/AuthContext";
import { campaignService } from "../../services/api";
import { Loader2 } from "lucide-react";

const DonationWidget = ({ campaign }) => {
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [type, setType] = useState("one-time");
  const [loading, setLoading] = useState(false);
  
  const { isAuthenticated, setShowLoginModal, user } = useAuth();
  const navigate = useNavigate();

  const percentFunded = Math.round((campaign.raised / campaign.goal) * 100);
  const predefinedAmounts = [10, 25, 50, 100];

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(val);
    if (val) setAmount(Number(val));
  };
  
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    if (amount < 1) {
      alert("Minimum donation amount is £1.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        amount,
        isAnonymous: false,
        paymentMethod: "card",
        giftAid: { enabled: user?.preferences?.ukGiftAid || false }
      };

      const res = await campaignService.donate(campaign._id || campaign.id, payload);
      if (res.success) {
        // Redirect to dashboard to see their updated stats and donation history
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Donation failed:", error);
      alert(error.response?.data?.message || "Donation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-border-light dark:border-neutral-800 shadow-card dark:shadow-none p-6 md:p-8 sticky top-24 transition-colors duration-300">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="font-heading font-extrabold text-2xl text-neutral-900 dark:text-white">£{campaign.raised.toLocaleString()}</span>
          <span className="text-sm font-semibold text-primary dark:text-primary-300">{percentFunded}%</span>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">raised of £{campaign.goal.toLocaleString()} goal</p>
        <ProgressBar raised={campaign.raised} goal={campaign.goal} showPercent={false} />
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border-light dark:border-neutral-800">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-neutral-400 dark:text-neutral-500">group</span>
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{campaign.donors.toLocaleString()}</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">donors</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-neutral-400 dark:text-neutral-500">schedule</span>
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{getDaysLeftLabel(campaign.daysLeft)}</span>
          </div>
        </div>
      </div>

      {/* Donation Form */}
      <div className="space-y-6">
        {/* Type toggle */}
        <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
          <button
            onClick={() => setType("one-time")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${type === "one-time" ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"}`}
          >
            One-time
          </button>
          <button
            onClick={() => setType("monthly")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${type === "monthly" ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"}`}
          >
            Monthly
          </button>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-3">
          {predefinedAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => { setAmount(amt); setCustomAmount(""); }}
              className={`py-3 rounded-xl font-heading font-bold transition-all border-2 ${
                amount === amt && !customAmount
                  ? "border-primary bg-primary-50 dark:bg-primary/20 text-primary dark:text-primary-300"
                  : "border-border-light dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-primary/40 dark:hover:border-primary/60"
              }`}
            >
              £{amt}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading font-bold text-neutral-900 dark:text-white">£</span>
          <input
            type="text"
            placeholder="Custom Amount"
            value={customAmount}
            onChange={handleCustomChange}
            className={`w-full pl-8 pr-4 py-3.5 rounded-xl border-2 transition-all font-heading font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-0 ${
              customAmount ? "border-primary bg-primary-50 dark:bg-primary/20" : "border-border-light dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:border-primary/50"
            }`}
          />
        </div>

        {/* Checkout Button */}
        <button 
          onClick={handleCheckout} 
          disabled={loading}
          className="btn-accent w-full py-4 text-base rounded-2xl shadow-button hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
          ) : (
            `Donate ${amount > 0 ? `£${amount}` : ""}`
          )}
        </button>

        <p className="text-center text-xs text-neutral-400 dark:text-neutral-500 mt-4 flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          Secure 256-bit SSL encrypted payment
        </p>
      </div>
    </div>
  );
};

export default DonationWidget;
