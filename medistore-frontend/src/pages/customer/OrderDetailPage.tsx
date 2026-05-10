import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MapPin, Phone, Package, XCircle } from "lucide-react";
import { Order } from "../../types";
import { ordersApi } from "../../api/orders";
import { formatPrice, formatDate, getStatusColor, getErrorMessage } from "../../utils";
import MainLayout from "../../components/layout/MainLayout";
import Spinner from "../../components/common/Spinner";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const steps = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    ordersApi.getById(id).then((r) => setOrder(r.data.data)).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!id) return;
    setCancelling(true);
    try {
      await ordersApi.cancel(id);
      const res = await ordersApi.getById(id);
      setOrder(res.data.data);
      toast.success("Order cancelled");
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setCancelling(false); }
  };

  if (loading) return <MainLayout><Spinner size={32} className="py-40" /></MainLayout>;
  if (!order)  return <MainLayout><div className="text-center py-40 text-gray-500">Order not found</div></MainLayout>;

  const stepIdx = steps.indexOf(order.status);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 mb-6 transition-colors">
          <ChevronLeft size={15} /> Back to orders
        </Link>

        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-100">
              Order <span className="text-gray-500 font-mono text-lg">#{order.id.slice(-8).toUpperCase()}</span>
            </h1>
            <p className="text-gray-600 text-sm mt-1">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
            {user?.role === "CUSTOMER" && order.status === "PLACED" && (
              <Button variant="danger" size="sm" loading={cancelling} onClick={handleCancel} icon={<XCircle size={13} />}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Progress Tracker */}
        {order.status !== "CANCELLED" && (
          <div className="bg-surface-card border border-surface-border rounded-xl p-5 mb-6">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                      ${i <= stepIdx ? "bg-brand-500 border-brand-500 text-white" : "border-surface-border text-gray-700"}`}>
                      {i < stepIdx ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs mt-1.5 font-medium ${i <= stepIdx ? "text-brand-400" : "text-gray-700"}`}>
                      {step.charAt(0) + step.slice(1).toLowerCase()}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 -mt-5 ${i < stepIdx ? "bg-brand-500" : "bg-surface-border"}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-surface-card border border-surface-border rounded-xl p-5 mb-4">
          <h2 className="font-display font-semibold text-gray-200 mb-4">Items</h2>
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {item.medicine.imageUrl
                    ? <img src={item.medicine.imageUrl} alt="" className="w-full h-full object-cover" />
                    : <Package size={16} className="text-gray-700" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 truncate">{item.medicine.name}</p>
                  <p className="text-xs text-gray-600">{formatPrice(item.unitPrice)} × {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-gray-300">{formatPrice(Number(item.unitPrice) * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-surface-border mt-4 pt-4 flex justify-between font-bold text-gray-200">
            <span>Total</span>
            <span className="font-display text-brand-400 text-lg">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-surface-card border border-surface-border rounded-xl p-5">
          <h2 className="font-display font-semibold text-gray-200 mb-4">Shipping Details</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-start gap-2 text-gray-500">
              <MapPin size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />
              {order.shippingAddress}
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Phone size={14} className="text-brand-500 flex-shrink-0" />
              {order.shippingPhone}
            </div>
            {order.note && <p className="text-gray-600 text-xs mt-1 italic">Note: {order.note}</p>}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetailPage;
