import React from "react";
import { Loader2 } from "lucide-react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

const styles = {
  primary:   "bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/20",
  secondary: "bg-surface-card hover:bg-surface-hover text-gray-200 border border-surface-border",
  danger:    "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
  ghost:     "hover:bg-surface-hover text-gray-400 hover:text-gray-200",
  outline:   "border border-brand-500/50 hover:border-brand-400 text-brand-400 hover:text-brand-300 hover:bg-brand-500/5",
};
const sizes = {
  sm:  "px-3 py-1.5 text-xs gap-1.5",
  md:  "px-4 py-2 text-sm gap-2",
  lg:  "px-6 py-3 text-base gap-2.5",
};

const Button: React.FC<Props> = ({
  variant = "primary", size = "md", loading, icon, children, className = "", disabled, ...rest
}) => (
  <button
    {...rest}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200
      ${styles[variant]} ${sizes[size]}
      disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
    {children}
  </button>
);

export default Button;
