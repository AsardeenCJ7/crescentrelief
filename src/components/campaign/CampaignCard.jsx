import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";
import { formatCurrency, getDaysLeftLabel } from "../../utils/formatters";

const badgeVariantMap = {
  emergency: "emergency",
  primary: "primary",
  secondary: "secondary",
  accent: "accent",
  success: "success",
};

const CampaignCard = ({ campaign, delay = 0 }) => {
  const percentFunded = Math.round((campaign.raised / campaign.goal) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="card group flex flex-col h-full"
    >
      {/* Image */}
      <Link to={`/campaigns/${campaign.id}`} className="relative overflow-hidden aspect-[16/9] bg-neutral-100 block">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={badgeVariantMap[campaign.badgeColor] || "primary"}
            icon={campaign.badgeColor === "emergency" ? "emergency" : undefined}
          >
            {campaign.badge}
          </Badge>
        </div>
        {/* Days left urgent */}
        {campaign.daysLeft <= 5 && (
          <div className="absolute top-3 right-3 bg-emergency text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {getDaysLeftLabel(campaign.daysLeft)}
          </div>
        )}
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
        <Link
          to={`/campaigns/${campaign.id}`}
          className="btn-primary w-full rounded-2xl py-2.5 text-sm justify-center"
        >
          View Campaign
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default CampaignCard;
