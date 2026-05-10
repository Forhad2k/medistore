import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, CheckCircle2, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { ordersApi } from "../../api/orders";
import { formatPrice, getErrorMessage } from "../../utils";
import MainLayout from "../../components/layout/MainLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";

const CheckoutPage: React.FC = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shippingAddress: user?.address ?? "",
    shippingPhone: user?.phone ?? "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.shippingAddress.trim()) e.shippingAddress = "Address is required";
    if (!form.shippingPhone.trim()) e.shippingPhone = "Phone is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await ordersApi.create({
        ...form,
        items: items.map((i) => ({ medicineId: i.medicine.id, quantity: i.quantity })),
      });
      clearCart();
      toast.success("Order placed successfully! 🎉");
      navigate(`/orders/${res.data.data.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-3xl font-bold text-gray-100 mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Shipping Info */}
          <div className="flex flex-col gap-5">
            <div className="bg-surface-card border border-surface-border rounded-xl p-5">
              <h2 className="font-display font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-brand-500" /> Shipping Details
              </h2>
              <div className="flex flex-col gap-4">
                <Input
                  label="Delivery address"
                  placeholder="House/Road/Area, City"
                  icon={<MapPin size={14} />}
                  value={form.shippingAddress}
                  onChange={set("shippingAddress")}
                  error={errors.shippingAddress}
                />
                <Input
                  label="Phone number"
                  placeholder="01XXXXXXXXX"
                  icon={<Phone size={14} />}
                  value={form.shippingPhone}
                  onChange={set("shippingPhone")}
                  error={errors.shippingPhone}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-300">Order note (optional)</label>
                  <textarea
                    placeholder="Any special instructions..."
                    value={form.note}
                    onChange={set("note")}
                    rows={3}
                    className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-500/50 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-surface-card border border-surface-border rounded-xl p-5">
              <h2 className="font-display font-semibold text-gray-200 mb-3">Payment Method</h2>
              <div className="flex items-center gap-3 p-3 border border-brand-500/30 bg-brand-500/5 rounded-lg">
                <div className="w-4 h-4 rounded-full border-2 border-brand-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-brand-500 rounded-full" />
                </div>
                <span className="text-sm text-gray-300 font-medium">Cash on Delivery</span>
                <span className="ml-auto text-xs text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">Only available</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-surface-card border border-surface-border rounded-xl p-5 sticky top-20">
              <h2 className="font-display font-semibold text-gray-200 mb-4">Order Summary</h2>

              <div className="flex flex-col gap-2.5 mb-4 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.medicine.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface rounded-lg overflow-hidden flex-shrink-0">
                      {item.medicine.imageUrl
                        ? <img src={item.medicine.imageUrl} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={14} className="text-gray-700" /></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 truncate">{item.medicine.name}</p>
                      <p className="text-xs text-gray-600">x{item.quantity}</p>
                    </div>
                    <p className="text-xs font-medium text-gray-300 flex-shrink-0">
                      {formatPrice(Number(item.medicine.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-surface-border py-3 flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(totalAmount)}</span></div>
                <div className="flex justify-between text-gray-500"><span>Delivery</span><span className="text-brand-400">Free</span></div>
                <div className="flex justify-between font-bold text-gray-200 text-base pt-1 border-t border-surface-border mt-1">
                  <span>Total</span>
                  <span className="font-display text-brand-400 text-xl">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <Button onClick={handleOrder} loading={loading} size="lg" className="w-full mt-2" icon={<CheckCircle2 size={16} />}>
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
