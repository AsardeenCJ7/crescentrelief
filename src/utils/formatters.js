export const formatCurrency = (amount, currency = "£") => {
  if (amount >= 1000000) return `${currency}${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${currency}${(amount / 1000).toFixed(0)}K`;
  return `${currency}${amount.toLocaleString()}`;
};

export const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toLocaleString();
};

export const getProgressPercent = (raised, goal) => {
  return Math.min(Math.round((raised / goal) * 100), 100);
};

export const getDaysLeftLabel = (days) => {
  if (days <= 0) return "Ended";
  if (days === 1) return "1 day left";
  return `${days} days left`;
};

export const cn = (...classes) => classes.filter(Boolean).join(" ");
