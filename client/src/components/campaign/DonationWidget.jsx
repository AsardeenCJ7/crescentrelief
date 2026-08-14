import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, getDaysLeftLabel } from "../../utils/formatters";
import ProgressBar from "../common/ProgressBar";
import { useAuth } from "../../context/AuthContext";
import { campaignService, donationService } from "../../services/api";
import { Loader2, CreditCard } from "lucide-react";
import { FaPaypal } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import StripeCheckoutForm from "./StripeCheckoutForm";
import DonationSuccessModal from "./DonationSuccessModal";

// Stripe public key loaded from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const DonationWidget = ({ campaign }) => {
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [type, setType] = useState("one-time");
  const [paymentMethod, setPaymentMethod] = useState("stripe"); // 'stripe' or 'paypal'
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [successDonation, setSuccessDonation] = useState(null);
  
  const { isAuthenticated, setShowLoginModal, user } = useAuth();
  const navigate = useNavigate();

  const percentFunded = Math.round((campaign.raised / campaign.goal) * 100);
  const predefinedAmounts = [10, 25, 50, 100];

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(val);
    if (val) setAmount(Number(val));
    setClientSecret(null); // Reset client secret if amount changes
  };
  
  const handleAmountSelect = (amt) => {
    setAmount(amt);
    setCustomAmount("");
    setClientSecret(null); // Reset client secret if amount changes
  };

  const handleProceedToPayment = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    if (amount < 1) {
      alert("Minimum donation amount is £1.");
      return;
    }

    if (paymentMethod === "stripe") {
      try {
        setLoading(true);
        const res = await donationService.createPaymentIntent({ amount });
        if (res.success && res.clientSecret) {
          setClientSecret(res.clientSecret);
        }
      } catch (error) {
        console.error("Failed to initialize payment:", error);
        alert(error.message || "Failed to initialize payment.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDonationSuccess = (donationData) => {
    setSuccessDonation(donationData);
    setClientSecret(null);
    setAmount(50);
    setCustomAmount("");
  };

  return (
    <>
    <DonationSuccessModal
      isOpen={!!successDonation}
      onClose={() => setSuccessDonation(null)}
      donation={successDonation}
    />
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
            onClick={() => { setType("one-time"); setClientSecret(null); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${type === "one-time" ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"}`}
          >
            One-time
          </button>
          <button
            onClick={() => { setType("monthly"); setClientSecret(null); }}
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
              onClick={() => handleAmountSelect(amt)}
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

        {/* Payment Method Toggle */}
        <div className="pt-2">
          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Payment Method</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setPaymentMethod("stripe"); setClientSecret(null); }}
              className={`py-3 flex items-center justify-center gap-2 rounded-xl font-semibold transition-all border-2 ${
                paymentMethod === "stripe"
                  ? "border-primary bg-primary-50 dark:bg-primary/20 text-primary dark:text-primary-300"
                  : "border-border-light dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-primary/40 dark:hover:border-primary/60"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Card / GPay
            </button>
            <button
              onClick={() => { setPaymentMethod("paypal"); setClientSecret(null); }}
              className={`py-3 flex items-center justify-center gap-2 rounded-xl font-semibold transition-all border-2 ${
                paymentMethod === "paypal"
                  ? "border-[#003087] bg-[#003087]/5 dark:bg-[#003087]/20 text-[#003087] dark:text-[#0079C1]"
                  : "border-border-light dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-[#003087]/40 dark:hover:border-[#003087]/60"
              }`}
            >
              <FaPaypal className="w-5 h-5" />
              PayPal
            </button>
          </div>
        </div>

        {/* Dynamic Checkout Area */}
        <div className="pt-2">
          {paymentMethod === "stripe" ? (
            clientSecret ? (
              <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                <StripeCheckoutForm 
                  clientSecret={clientSecret} 
                  amount={amount} 
                  campaignId={campaign._id || campaign.id}
                  onSuccess={handleDonationSuccess}
                />
              </Elements>
            ) : (
              <button 
                onClick={handleProceedToPayment} 
                disabled={loading}
                className="btn-accent w-full py-4 text-base rounded-2xl shadow-button hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  `Proceed to Donate £${amount}`
                )}
              </button>
            )
          ) : (
            <div className="mt-4">
              {!isAuthenticated ? (
                <button 
                  onClick={() => setShowLoginModal(true)} 
                  className="btn-accent w-full py-4 text-base rounded-2xl shadow-button hover:shadow-lg"
                >
                  Log in to donate
                </button>
              ) : (
                <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test", currency: "GBP" }}>
                  <PayPalButtons 
                    style={{ layout: "vertical", shape: "rect", color: "blue" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: amount.toString(),
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const details = await actions.order.capture();
                      try {
                        const payload = {
                          amount,
                          isAnonymous: false,
                          paymentMethod: "paypal",
                        };
                        const res = await campaignService.donate(campaign._id || campaign.id, payload);
                        if (res.success) {
                          handleDonationSuccess(res.data);
                        }
                      } catch (err) {
                        console.error("Failed to record PayPal donation:", err);
                        alert("Donation successful via PayPal, but failed to record in our system. Please contact support.");
                      }
                    }}
                  />
                </PayPalScriptProvider>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-neutral-400 dark:text-neutral-500 mt-4 flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          Secure 256-bit SSL encrypted payment
        </p>
      </div>
    </div>
    </>
  );
};

export default DonationWidget;
