import React from "react";
import { Star } from "lucide-react";

interface Props { rating: number; max?: number; size?: number; interactive?: boolean; onChange?: (r: number) => void; }

const StarRating: React.FC<Props> = ({ rating, max = 5, size = 16, interactive, onChange }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
      <Star
        key={star}
        size={size}
        className={`${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-700"}
          ${interactive ? "cursor-pointer hover:text-yellow-300 transition-colors" : ""}`}
        onClick={() => interactive && onChange?.(star)}
      />
    ))}
  </div>
);

export default StarRating;
