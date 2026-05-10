import React from "react";

interface Props { children: React.ReactNode; className?: string; }

const Badge: React.FC<Props> = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
    {children}
  </span>
);

export default Badge;
