import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CAMPAIGNS } from "../constants/data";
import Badge from "../components/common/Badge";
import DonationWidget from "../components/campaign/DonationWidget";
import CampaignVideo from "../components/campaign/CampaignVideo";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";

const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  
  const { isAuthenticated, setShowLoginModal } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
    const found = CAMPAIGNS.find((c) => c.id === parseInt(id));
    if (found) {
      setCampaign(found);
    } else {
      navigate("/404");
    }
  }, [id, navigate]);

  if (!campaign) return null; // Or a loading skeleton

  const badgeVariantMap = {
    emergency: "emergency",
    primary: "primary",
    secondary: "secondary",
    accent: "accent",
    success: "success",
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen pb-20 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] bg-neutral-900 overflow-hidden">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />
        
        <div className="absolute inset-0 flex items-end pb-12">
          <div className="container-max w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-3">
                  <Badge variant={badgeVariantMap[campaign.badgeColor] || "primary"}>
                    {campaign.category}
                  </Badge>
                  {campaign.urgent && (
                    <Badge variant="emergency" icon="emergency">
                      Urgent Appeal
                    </Badge>
                  )}
                </div>
                <button
                  onClick={handleFavoriteClick}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-colors border border-white/20"
                >
                  <span 
                    className={`material-symbols-outlined text-[24px] transition-colors ${isFavorite ? 'text-rose-500' : 'text-white'}`}
                    style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </button>
              </div>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-white mb-5 tracking-tight text-balance leading-[1.1]">
                {campaign.title}
              </h1>
              <p className="text-lg sm:text-xl text-neutral-200 leading-relaxed max-w-2xl">
                {campaign.description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container-max mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column - Story & Video */}
          <div className="lg:col-span-8">
            <CampaignVideo videoUrl={campaign.videoUrl} title={campaign.title} />

            {/* Beautiful Structured Description */}
            <div className="mb-10">
              {(() => {
                const markdown = campaign.longDescription || campaign.description;
                const crisisMatch = markdown.match(/### The Crisis([\s\S]*?)### Our Response/);
                const responseMatch = markdown.match(/### Our Response([\s\S]*?)### How Your Donation Helps/);
                const impactMatch = markdown.match(/### How Your Donation Helps([\s\S]*)/);

                const crisis = crisisMatch ? crisisMatch[1].trim() : "";
                const response = responseMatch ? responseMatch[1].trim() : "";
                const impact = impactMatch ? impactMatch[1].trim() : "";

                if (crisis && response && impact) {
                  return (
                    <div className="space-y-6">
                      {/* The Crisis Card */}
                      <div className="bg-red-50/40 dark:bg-red-950/20 rounded-3xl p-6 sm:p-8 md:p-10 border border-red-100 dark:border-red-900/30 shadow-sm relative overflow-hidden transition-colors duration-300">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-10 pointer-events-none">
                           <span className="material-symbols-outlined text-[120px]">warning</span>
                        </div>
                        <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-red-950 dark:text-red-400 mb-4 flex items-center gap-3">
                          <span className="material-symbols-outlined text-red-500 text-[32px] bg-red-100 dark:bg-red-900/50 p-2 rounded-xl">emergency</span>
                          The Crisis
                        </h3>
                        <div className="text-red-950/80 dark:text-red-200/80 text-base sm:text-lg leading-relaxed text-justify relative z-10">
                          <ReactMarkdown>{crisis}</ReactMarkdown>
                        </div>
                      </div>
                      
                      {/* Our Response Card */}
                      <div className="bg-primary-50/40 dark:bg-primary-900/10 rounded-3xl p-6 sm:p-8 md:p-10 border border-primary/20 dark:border-primary/20 shadow-sm relative overflow-hidden transition-colors duration-300">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-10 pointer-events-none">
                           <span className="material-symbols-outlined text-[120px]">volunteer_activism</span>
                        </div>
                        <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 dark:text-white mb-4 flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary dark:text-primary-400 text-[32px] bg-primary/10 dark:bg-primary/20 p-2 rounded-xl">medical_services</span>
                          Our Response
                        </h3>
                        <div className="text-neutral-700 dark:text-neutral-300 text-base sm:text-lg leading-relaxed text-justify relative z-10">
                          <ReactMarkdown>{response}</ReactMarkdown>
                        </div>
                      </div>

                      {/* How Your Donation Helps Card */}
                      <div className="bg-green-50/40 dark:bg-green-900/10 rounded-3xl p-6 sm:p-8 md:p-10 border border-green-200 dark:border-green-800/30 shadow-sm relative overflow-hidden transition-colors duration-300">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-10 pointer-events-none">
                           <span className="material-symbols-outlined text-[120px]">favorite</span>
                        </div>
                        <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-green-950 dark:text-green-400 mb-6 flex items-center gap-3">
                          <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[32px] bg-green-100 dark:bg-green-900/50 p-2 rounded-xl">redeem</span>
                          How Your Donation Helps
                        </h3>
                        <div className="prose prose-base sm:prose-lg max-w-none text-green-950/80 dark:text-green-100/80 relative z-10
                          prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-4 prose-ul:m-0
                          prose-li:relative prose-li:pl-10 prose-li:m-0
                          [&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-2 [&_li]:before:top-[12px] [&_li]:before:w-2.5 [&_li]:before:h-2.5 [&_li]:before:bg-green-500 [&_li]:before:rounded-full [&_li]:before:shadow-[0_0_0_4px_rgba(34,197,94,0.2)] dark:[&_li]:before:shadow-[0_0_0_4px_rgba(34,197,94,0.1)]
                          prose-strong:text-green-950 dark:prose-strong:text-green-300 prose-strong:font-bold prose-strong:text-lg">
                          <ReactMarkdown>{impact}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Fallback for non-structured markdown
                return (
                  <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 md:p-12 shadow-card dark:shadow-none border border-border-light dark:border-neutral-800 relative overflow-hidden transition-colors duration-300">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-accent to-secondary"></div>
                    <div className="prose prose-base sm:prose-lg prose-neutral dark:prose-invert max-w-none 
                      prose-headings:font-heading prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-neutral-900 dark:prose-headings:text-white
                      prose-h3:text-2xl sm:prose-h3:text-3xl prose-h3:mt-10 prose-h3:mb-6 prose-h3:text-primary dark:prose-h3:text-primary-400
                      prose-p:text-neutral-600 dark:prose-p:text-neutral-300 prose-p:leading-relaxed sm:prose-p:leading-loose prose-p:mb-7 prose-p:text-justify
                      prose-strong:text-neutral-900 dark:prose-strong:text-white prose-strong:font-bold
                      prose-ul:list-none prose-ul:pl-0 prose-ul:mb-8 prose-ul:mt-6
                      prose-li:relative prose-li:pl-8 prose-li:mb-4 prose-li:text-neutral-600 dark:prose-li:text-neutral-300 sm:prose-li:text-lg prose-li:text-justify
                      [&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[12px] [&_li]:before:w-2 [&_li]:before:h-2 [&_li]:before:bg-primary [&_li]:before:rounded-full
                      prose-a:text-primary dark:prose-a:text-primary-400 prose-a:font-semibold hover:prose-a:text-primary-700 dark:hover:prose-a:text-primary-300">
                      <ReactMarkdown>{markdown}</ReactMarkdown>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Documents Section */}
            {campaign.documents && campaign.documents.length > 0 && (
              <div className="mt-8 bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 md:p-12 shadow-card dark:shadow-none border border-border-light dark:border-neutral-800 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                <h3 className="font-heading font-bold text-2xl text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary dark:text-primary-400 text-[28px]">description</span>
                  Campaign Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  {campaign.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      download
                      className="flex items-center gap-4 p-4 md:p-5 rounded-2xl border border-border-light dark:border-neutral-700 hover:border-primary/40 dark:hover:border-primary/60 hover:bg-primary-50 dark:hover:bg-primary/10 hover:shadow-sm transition-all group"
                    >
                      <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center text-primary dark:text-primary-400 group-hover:bg-primary group-hover:text-white group-hover:scale-105 transition-all">
                        <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-300 truncate transition-colors">
                          {doc.title}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5 uppercase tracking-wide">
                          {doc.size}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-neutral-300 dark:text-neutral-600 group-hover:text-primary dark:group-hover:text-primary-400 transition-colors">
                        download
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Donation Widget */}
          <div className="lg:col-span-4 relative">
             <DonationWidget campaign={campaign} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage;
