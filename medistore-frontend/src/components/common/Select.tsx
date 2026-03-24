import React from "react";

interface Option { value: string; label: string; }
interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string; error?: string; options: Option[];
}

const Select: React.FC<Props> = ({ label, error, options, className = "", ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
    <select
      {...rest}
      className={`w-full bg-surface-card border ${error ? "border-red-500/50" : "border-surface-border"}
        rounded-lg px-3 py-2.5 text-sm text-gray-200
        focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30
        transition-all duration-200 ${className}`}
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

export default Select;
