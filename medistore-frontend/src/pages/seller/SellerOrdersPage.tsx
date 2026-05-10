import React, { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { Order, OrderStatus, PaginationMeta } from "../../types";
import { ordersApi } from "../../api/orders";
import { formatPrice, formatDate, getStatusColor, getErrorMessage } from "../../utils";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/common/Badge";
import Select from "../../components/common/Select";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";
import toast from "react-hot-toast";

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "PLACED",     label: "Placed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED",    label: "Shipped" },
  { value: "DELIVERED",  label: "Delivered" },
  { value: "CANCELLED",  label: "Cancelled" },
];

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  PLACED:     "PROCESSING",
  PROCESSING: "SHIPPED",
  SHIPPED:    "DELIVERED",
};

const SellerOrdersPage: React.FC = () => {
  const [orders, setOrders]         = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [updating, setUpdating]     = useState<string | null>(null);

  const load = (p = 1) => {
    setLoading(true);
    ordersApi.getSellerOrders({ page: p }).then((r) => {
      setOrders(r.data.data.orders);
      setPagination(r.data.data.pagination);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    setUpdating(orderId);
    try {
      await ordersApi.updateStatus(orderId, status);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
      toast.success(`Order marked as ${status}`);
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setUpdating(null); }
  };

  return (
    <DashboardLayout requiredRole="SELLER">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-100">Orders</h1>
          {pagination && <p className="text-gray-600 text-sm mt-0.5">{pagination.total} total orders</p>}
        </div>

        {loading ? <Spinner size={28} className="py-20" /> : orders.length === 0 ? (
          <EmptyState icon={<Package size={28} />} title="No orders yet" description="Orders from customers will appear here" />
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-surface-card border border-surface-border rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-gray-400">#{order.id.slice(-8).toUpperCase()}</span>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                      {order.customer && (
                        <p className="text-xs text-gray-600">{order.customer.name} — {order.customer.phone}</p>
                      )}
                      <p className="text-xs text-gray-700">{formatDate(order.createdAt)}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="font-display font-bold text-brand-400">{formatPrice(order.totalAmount)}</p>

                      {/* Next Action Button */}
                      {nextStatus[order.status] && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, nextStatus[order.status]!)}
                          disabled={updating === order.id}
                          className="px-3 py-1.5 text-xs font-medium bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 rounded-lg transition-all disabled:opacity-50"
                        >
                          {updating === order.id ? "…" : `Mark as ${nextStatus[order.status]}`}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="mt-3 pt-3 border-t border-surface-border flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item) => (
                      <span key={item.id} className="text-xs text-gray-600 bg-surface px-2 py-1 rounded-md">
                        {item.medicine.name} × {item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && <span className="text-xs text-gray-700">+{order.items.length - 3} more</span>}
                  </div>
                </div>
              ))}
            </div>
            {pagination && <Pagination meta={pagination} onPageChange={setPage} />}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SellerOrdersPage;
