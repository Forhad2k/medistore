import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta } from "../../types";

interface Props { meta: PaginationMeta; onPageChange: (page: number) => void; }

const Pagination: React.FC<Props> = ({ meta, onPageChange }) => {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(meta.page - 1)}
        disabled={meta.page <= 1}
        className="p-2 rounded-lg border border-surface-border text-gray-400 hover:text-gray-200 hover:border-brand-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
        .filter((p) => Math.abs(p - meta.page) <= 2 || p === 1 || p === meta.totalPages)
        .map((p, idx, arr) => (
          <React.Fragment key={p}>
            {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-gray-700 px-1">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all
                ${meta.page === p
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                  : "border border-surface-border text-gray-400 hover:text-gray-200 hover:border-brand-500/50"}`}
            >
              {p}
            </button>
          </React.Fragment>
        ))}
      <button
        onClick={() => onPageChange(meta.page + 1)}
        disabled={meta.page >= meta.totalPages}
        className="p-2 rounded-lg border border-surface-border text-gray-400 hover:text-gray-200 hover:border-brand-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
