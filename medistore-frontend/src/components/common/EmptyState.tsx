import React from "react";

interface Props { icon: React.ReactNode; title: string; description?: string; action?: React.ReactNode; }

const EmptyState: React.FC<Props> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-center text-gray-600">
      {icon}
    </div>
    <div>
      <h3 className="text-gray-300 font-semibold font-display text-lg">{title}</h3>
      {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
    </div>
    {action}
  </div>
);

export default EmptyState;
