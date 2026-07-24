const badgeVariants = {
  primary: "bg-primary-50 text-primary border border-primary/20",
  secondary: "bg-green-50 text-secondary border border-secondary/20",
  accent: "bg-amber-50 text-amber-700 border border-amber-200",
  emergency: "bg-red-50 text-emergency border border-red-200",
  success: "bg-green-50 text-green-700 border border-green-200",
  neutral: "bg-neutral-100 text-neutral-600 border border-neutral-200",
};

const Badge = ({ children, variant = "primary", icon, className = "" }) => {
  return (
    <span className={`badge ${badgeVariants[variant]} ${className}`}>
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
