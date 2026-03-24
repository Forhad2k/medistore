import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils";
import MainLayout from "../../components/layout/MainLayout";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";

const CartPage: React.FC = () => {
  const { items, totalAmount, totalItems, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) { navigate("/login", { state: { from: { pathname: "/checkout" } } }); return; }
    navigate("/checkout");
  };

  if (items.length === 0) return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-20">
        <EmptyState
          icon={<ShoppingBag size={28} />}
          title="Your cart is empty"
          description="Add some medicines to get started"
          action={<Link to="/shop" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">Browse shop <ArrowRight size={14} /></Link>}
        />
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-3xl font-bold text-gray-100 mb-8">
          Shopping Cart <span className="text-gray-600 font-sans font-normal text-xl">({totalItems} items)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.medicine.id}
                className="bg-surface-card border border-surface-border rounded-xl p-4 flex items-center gap-4 animate-fade-in">
                {/* Image */}
                <div className="w-16 h-16 bg-surface rounded-lg flex-shrink-0 overflow-hidden">
                  {item.medicine.imageUrl
                    ? <img src={item.medicine.imageUrl} alt={item.medicine.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-700"><ShoppingBag size={20} /></div>
                  }
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/shop/${item.medicine.id}`} className="font-medium text-gray-200 hover:text-brand-400 transition-colors text-sm line-clamp-1">
                    {item.medicine.name}
                  </Link>
                  <p className="text-xs text-gray-600 mt-0.5">{formatPrice(item.medicine.price)} each</p>
                </div>

                {/* Qty Controls */}
                <div className="flex items-center border border-surface-border rounded-lg overflow-hidden flex-shrink-0">
                  <button onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}
                    className="px-2.5 py-2 hover:bg-surface-hover text-gray-500 hover:text-gray-300 transition-colors">
                    <Minus size={13} />
                  </button>
                  <span className="px-3 text-sm font-medium text-gray-200">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.medicine.id, Math.min(item.medicine.stock, item.quantity + 1))}
                    className="px-2.5 py-2 hover:bg-surface-hover text-gray-500 hover:text-gray-300 transition-colors">
                    <Plus size={13} />
                  </button>
                </div>

                {/* Line Total */}
                <p className="font-display font-bold text-brand-400 text-sm w-20 text-right flex-shrink-0">
                  {formatPrice(Number(item.medicine.price) * item.quantity)}
                </p>

                {/* Remove */}
                <button onClick={() => removeFromCart(item.medicine.id)}
                  className="text-gray-700 hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-surface-card border border-surface-border rounded-xl p-5 sticky top-20">
              <h2 className="font-display font-semibold text-gray-200 mb-4">Order Summary</h2>
              <div className="flex flex-col gap-2 text-sm mb-4">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-gray-300">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span className="text-brand-400 font-medium">Free</span>
                </div>
                <div className="border-t border-surface-border my-2 pt-2 flex justify-between font-semibold text-gray-200">
                  <span>Total</span>
                  <span className="font-display text-brand-400 text-lg">{formatPrice(totalAmount)}</span>
                </div>
              </div>
              <Button onClick={handleCheckout} className="w-full" size="lg" icon={<ArrowRight size={15} />}>
                Proceed to Checkout
              </Button>
              <Link to="/shop" className="block text-center text-xs text-gray-600 hover:text-gray-400 mt-3 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
