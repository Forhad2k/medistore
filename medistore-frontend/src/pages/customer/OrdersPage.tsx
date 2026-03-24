import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Eye } from "lucide-react";
import { Order, PaginationMeta } from "../../types";
import { ordersApi } from "../../api/orders";
import { formatPrice, formatDate, getStatusColor } from "../../utils";
import MainLayout from "../../components/layout/MainLayout";
import Spinner from "../../components/common/Spinner";
import Badge from "../../components/common/Badge";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import ProtectedRoute from "../../routes/ProtectedRoute";

const OrdersPage: React.FC = () => {
  const [orders, setOrders]       = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);

  useEffect(() => {
    setLoading(true);
    ordersApi.getMine({ page }).then((r) => {
      setOrders(r.data.data.orders);
      setPagination(r.data.data.pagination);
    }).finally(() => setLoading(false));
  }, [page]);

  return (
    <ProtectedRoute roles={["CUSTOMER"]}>
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="font-display text-3xl font-bold text-gray-100 mb-8">My Orders</h1>

          {loading ? <Spinner size={32} className="py-20" /> : orders.length === 0 ? (
            <EmptyState
              icon={<Package size={28} />}
              title="No orders yet"
              description="Place your first order from the shop"
              action={<Link to="/shop" className="text-sm text-brand-400 hover:text-brand-300">Browse shop</Link>}
            />
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-surface-card border border-surface-border rounded-xl p-5 hover:border-brand-500/20 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 font-mono">#{order.id.slice(-8).toUpperCase()}</span>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        <p className="text-xs text-gray-600">{order.items.length} item(s)</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-600">Total</p>
                          <p className="font-display font-bold text-brand-400">{formatPrice(order.totalAmount)}</p>
                        </div>
                        <Link to={`/orders/${order.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-surface-border rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:border-brand-500/40 transition-all">
                          <Eye size={13} /> View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {pagination && <Pagination meta={pagination} onPageChange={setPage} />}
            </>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default OrdersPage;
