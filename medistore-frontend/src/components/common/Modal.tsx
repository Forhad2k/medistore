import React, { useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean; onClose: () => void;
  title?: string; children: React.ReactNode; size?: "sm" | "md" | "lg";
}

const Modal: React.FC<Props> = ({ open, onClose, title, children, size = "md" }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${widths[size]} bg-surface-card border border-surface-border rounded-2xl shadow-2xl animate-slide-up`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
            <h2 className="font-display font-semibold text-gray-100">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
