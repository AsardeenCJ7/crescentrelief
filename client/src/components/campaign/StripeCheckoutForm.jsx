import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import { campaignService } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function StripeCheckoutForm({ clientSecret, amount, campaignId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`, // We'll handle redirect via our own logic if possible, but stripe requires this for some payment methods
      },
      redirect: 'if_required', // Avoid redirect if it's a simple card payment
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment succeeded! Record it in our DB
      try {
        const payload = {
          amount,
          isAnonymous: false,
          paymentMethod: "stripe",
          // giftAid: { enabled: user?.preferences?.ukGiftAid || false } // handled outside
        };
        const res = await campaignService.donate(campaignId, payload);
        if (res.success) {
          onSuccess(res.data);
        }
      } catch (err) {
        console.error("Failed to record donation:", err);
        setMessage("Payment succeeded but failed to update database. Please contact support.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="mt-4">
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit" 
        className="btn-accent w-full py-4 text-base rounded-2xl shadow-button hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
      >
        {isLoading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
        ) : (
          `Complete Donation of £${amount}`
        )}
      </button>
      
      {message && <div id="payment-message" className="mt-4 text-rose-500 text-sm font-semibold text-center">{message}</div>}
    </form>
  );
}
