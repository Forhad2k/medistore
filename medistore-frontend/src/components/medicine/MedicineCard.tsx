import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Package } from "lucide-react";
import { Medicine } from "../../types";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils";
import Button from "../common/Button";

interface Props { medicine: Medicine; }

const MedicineCard: React.FC<Props> = ({ medicine }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const canBuy = !user || user.role === "CUSTOMER";

  return (
    <div className="group bg-surface-card border border-surface-border rounded-2xl overflow-hidden hover:border-brand-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 flex flex-col">
      {/* Image */}
      <Link to={`/shop/${medicine.id}`} className="block overflow-hidden bg-surface h-44 relative">
        {medicine.imageUrl ? (
          <img
            src={medicine.imageUrl}
            alt={medicine.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={36} className="text-gray-700" />
          </div>
        )}
        {medicine.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-red-400 text-sm font-semibold bg-surface-card px-3 py-1 rounded-full border border-red-400/30">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="text-xs bg-surface-card/90 backdrop-blur text-gray-400 border border-surface-border px-2 py-0.5 rounded-full">
            {medicine.category.name}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link to={`/shop/${medicine.id}`}>
          <h3 className="font-semibold text-gray-200 text-sm leading-snug hover:text-brand-400 transition-colors line-clamp-2">
            {medicine.name}
          </h3>
        </Link>
        {medicine.manufacturer && (
          <p className="text-xs text-gray-600">{medicine.manufacturer}</p>
        )}

        {/* Rating */}
        {medicine.averageRating && (
          <div className="flex items-center gap-1.5">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-400">
              {medicine.averageRating} ({medicine.totalReviews})
            </span>
          </div>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-surface-border">
          <span className="font-display font-bold text-brand-400 text-lg">
            {formatPrice(medicine.price)}
          </span>
          {canBuy && (
            <Button
              size="sm"
              onClick={() => addToCart(medicine)}
              disabled={medicine.stock === 0}
              icon={<ShoppingCart size={13} />}
            >
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
