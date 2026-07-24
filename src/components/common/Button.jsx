import { motion } from "framer-motion";

const variants = {
  primary: "btn-primary text-sm md:text-base",
  secondary: "btn-secondary text-sm md:text-base",
  accent: "btn-accent text-sm md:text-base",
  outline: "btn-outline-primary text-sm md:text-base",
  ghost: "inline-flex items-center justify-center gap-2 text-neutral-600 font-semibold px-4 py-2.5 rounded-full transition-colors hover:bg-neutral-100 hover:text-neutral-900",
  danger: "inline-flex items-center justify-center gap-2 bg-emergency text-white font-semibold px-6 py-3 rounded-full transition-all hover:bg-red-700 hover:-translate-y-0.5",
};

const sizes = {
  sm: "text-xs px-4 py-2",
  md: "",
  lg: "text-base px-8 py-4",
  xl: "text-lg px-10 py-5",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  iconEnd,
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  ...props
}) => {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.97 }}
      className={`${variants[variant]} ${sizes[size]} ${className} ${disabled || loading ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      ) : null}
      {children}
      {iconEnd && !loading && (
        <span className="material-symbols-outlined text-[18px]">{iconEnd}</span>
      )}
    </motion.button>
  );
};

export default Button;
