import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<Props> = ({ label, error, icon, className = "", ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>
      )}
      <input
        {...rest}
        className={`w-full bg-surface-card border ${error ? "border-red-500/50" : "border-surface-border"}
          rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600
          focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30
          transition-all duration-200 ${icon ? "pl-10" : ""} ${className}`}
      />
    </div>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

export default Input;
