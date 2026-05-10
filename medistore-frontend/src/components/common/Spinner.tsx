import React from "react";
import { Loader2 } from "lucide-react";

const Spinner: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Loader2 size={size} className="animate-spin text-brand-500" />
  </div>
);

export default Spinner;
