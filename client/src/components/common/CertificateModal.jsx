import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, X, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import QRCode from "react-qr-code";

export default function CertificateModal({ isOpen, onClose, donation, user }) {
  const certificateRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !donation) return null;

  // Format the date nicely
  const donationDate = new Date(donation.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Decide what the QR code points to.
  // The user requested it to point to the campaign page or referral link.
  // We'll point it to the specific campaign to verify the donation cause.
  const qrValue = `https://crescentrelief.org/campaigns/${donation.campaign?._id || ""}`;

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    try {
      setDownloading(true);
      
      // We temporarily adjust styles if needed for a perfect render, html2canvas is pretty good though
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, // High quality
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Crescent_Relief_Certificate_${donation.transactionId || Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error("Error generating certificate:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!certificateRef.current) return;
    
    if (navigator.share) {
      try {
        setDownloading(true);
        const canvas = await html2canvas(certificateRef.current, { scale: 2, useCORS: true });
        
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], "certificate.png", { type: "image/png" });
          
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: "My Donation Certificate",
              text: `I just donated to ${donation.campaign?.title} via Crescent Relief!`,
              files: [file],
            });
          } else {
            // Fallback if file sharing is not supported but text sharing is
            await navigator.share({
              title: "My Donation",
              text: `I just donated to ${donation.campaign?.title} via Crescent Relief! You can too: ${qrValue}`,
              url: qrValue
            });
          }
          setDownloading(false);
        }, "image/png");
      } catch (error) {
        console.error("Error sharing:", error);
        setDownloading(false);
      }
    } else {
      // Fallback if Web Share API is not supported (desktop browsers mostly)
      handleDownload();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-4xl z-10 flex flex-col my-auto"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-neutral-800">
            <h3 className="font-heading font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">workspace_premium</span>
              Certificate of Appreciation
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                disabled={downloading}
                className="btn-outline px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="btn-primary px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
              >
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Certificate Content - This is what gets rendered to Canvas */}
          <div className="p-4 sm:p-8 bg-neutral-50 dark:bg-neutral-950 overflow-x-auto">
            
            {/* 
              The actual certificate wrapper with fixed aspect ratio/dimensions 
              to ensure it looks exactly the same when downloaded as an image.
            */}
            <div 
              ref={certificateRef}
              className="bg-white mx-auto relative overflow-hidden flex flex-col justify-between shadow-sm"
              style={{ 
                width: '800px', 
                height: '600px',
                border: '8px solid #0d9488', // Primary color border
                backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(13, 148, 136, 0.05) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(14, 165, 233, 0.05) 0%, transparent 50%)'
              }}
            >
              {/* Corner Ornaments */}
              <div className="absolute top-0 left-0 w-32 h-32 border-t-[12px] border-l-[12px] border-primary/20 rounded-tl-lg m-4" />
              <div className="absolute top-0 right-0 w-32 h-32 border-t-[12px] border-r-[12px] border-primary/20 rounded-tr-lg m-4" />
              <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[12px] border-l-[12px] border-primary/20 rounded-bl-lg m-4" />
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[12px] border-r-[12px] border-primary/20 rounded-br-lg m-4" />
              
              {/* Watermark Logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                <span className="material-symbols-outlined text-[400px]">cruelty_free</span>
              </div>

              {/* Certificate Top section */}
              <div className="pt-12 text-center relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white text-[28px]">cruelty_free</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-widest uppercase text-neutral-800" style={{ fontFamily: 'Times New Roman, serif' }}>
                    Crescent Relief
                  </h1>
                </div>
                
                <h2 className="text-4xl sm:text-5xl font-bold text-primary tracking-wide uppercase mt-4 mb-2" style={{ fontFamily: 'Times New Roman, serif' }}>
                  Certificate of Appreciation
                </h2>
                <div className="w-64 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto mt-4 mb-8" />
              </div>

              {/* Certificate Middle section */}
              <div className="flex-1 text-center px-16 relative z-10 flex flex-col justify-center">
                <p className="text-lg text-neutral-600 italic mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  This is proudly presented to
                </p>
                
                <h3 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  {user.fullName || "Generous Donor"}
                </h3>
                
                <p className="text-lg text-neutral-700 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
                  In deepest gratitude for your generous donation of <strong className="text-primary text-xl">£{donation.amount}</strong> towards the <strong className="text-neutral-900">{donation.campaign?.title || "Noble Cause"}</strong> campaign.
                </p>
                <p className="text-md text-neutral-500 mt-4 max-w-xl mx-auto italic" style={{ fontFamily: 'Georgia, serif' }}>
                  "Whoever saves one life, it is as if he had saved mankind entirely."
                </p>
              </div>

              {/* Certificate Bottom section */}
              <div className="pb-12 px-16 relative z-10 flex items-end justify-between">
                
                {/* Date and Signature */}
                <div className="text-center">
                  <div className="text-lg font-bold text-neutral-800 mb-1 border-b border-neutral-400 pb-2 px-8 inline-block" style={{ fontFamily: 'Georgia, serif' }}>
                    {donationDate}
                  </div>
                  <p className="text-sm text-neutral-500 uppercase tracking-widest mt-1">Date of Donation</p>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <div className="bg-white p-2 border border-neutral-200 rounded-lg shadow-sm mb-2">
                    <QRCode 
                      value={qrValue}
                      size={80}
                      level="H"
                      fgColor="#0f172a"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider text-center max-w-[120px]">
                    Scan to view campaign
                  </p>
                </div>

                {/* Director Signature */}
                <div className="text-center">
                  <div className="text-2xl text-secondary mb-1 border-b border-neutral-400 pb-2 px-8 inline-block" style={{ fontFamily: "'Brush Script MT', cursive, Georgia" }}>
                    Crescent Relief Board
                  </div>
                  <p className="text-sm text-neutral-500 uppercase tracking-widest mt-1">Authorized Signature</p>
                </div>

              </div>
              
              {/* Transaction ID */}
              <div className="absolute bottom-2 left-4 text-[10px] text-neutral-400 font-mono">
                ID: {donation.transactionId || donation._id}
              </div>
            </div>
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
