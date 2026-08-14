import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";
import { formatCurrency, getDaysLeftLabel } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

const badgeVariantMap = {
  emergency: "emergency",
  primary: "primary",
  secondary: "secondary",
  accent: "accent",
  success: "success",
};

const CampaignCard = ({ campaign, delay = 0 }) => {
  const percentFunded = Math.round((campaign.raised / campaign.goal) * 100);
  const { isAuthenticated, setShowLoginModal } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setIsFavorite(!isFavorite);
  };

  const handleDonateClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      navigate(`/campaigns/${campaign.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="card group flex flex-col h-full relative"
    >
      {/* Image */}
      <Link to={`/campaigns/${campaign.id}`} className="relative overflow-hidden aspect-[16/9] bg-neutral-100 block rounded-t-2xl">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-2 z-10">
          <Badge
            variant={badgeVariantMap[campaign.badgeColor] || "primary"}
            icon={campaign.badgeColor === "emergency" ? "emergency" : undefined}
          >
            {campaign.badge}
          </Badge>
          {campaign.daysLeft <= 5 && (
            <div className="bg-emergency text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              {getDaysLeftLabel(campaign.daysLeft)}
            </div>
          )}
        </div>

        {/* Top Right Favorite Button */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center transition-colors z-20"
        >
          <span 
            className={`material-symbols-outlined text-[18px] transition-colors ${
              isFavorite ? 'text-rose-500' : 'text-white'
            }`}
            style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-xs font-semibold text-primary dark:text-primary-300 uppercase tracking-wider mb-2">{campaign.category}</p>
        <h3 className="font-heading font-bold text-neutral-900 dark:text-white text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary-300 transition-colors">
          {campaign.title}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2 mb-4 flex-1">
          {campaign.description}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-neutral-900 dark:text-white">{formatCurrency(campaign.raised)}</span>
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{percentFunded}%</span>
          </div>
          <ProgressBar raised={campaign.raised} goal={campaign.goal} showPercent={false} />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-neutral-400 dark:text-neutral-500">{campaign.donors.toLocaleString()} donors</span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">{getDaysLeftLabel(campaign.daysLeft)}</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Link
            to={`/campaigns/${campaign.id}`}
            className="btn-secondary flex-1 rounded-xl py-2.5 text-sm justify-center"
          >
            Details
          </Link>
          <button
            onClick={handleDonateClick}
            className="btn-accent flex-[2] rounded-xl py-2.5 text-sm justify-center font-bold"
          >
            Donate Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignCard;
