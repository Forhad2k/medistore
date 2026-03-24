import React, { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { Order, PaginationMeta } from "../../types";
import { ordersApi } from "../../api/orders";
import { formatPrice, formatDate, getStatusColor } from "../../utils";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders]         = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);

  useEffect(() => {
    setLoading(true);
    ordersApi.getAll({ page }).then((r) => {
      setOrders(r.data.data.orders);
      setPagination(r.data.data.pagination);
    }).finally(() => setLoading(false));
  }, [page]);

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-100">All Orders</h1>
          {pagination && <p className="text-gray-600 text-sm mt-0.5">{pagination.total} total orders</p>}
        </div>

        {loading ? <Spinner size={28} className="py-20" /> : orders.length === 0 ? (
          <EmptyState icon={<Package size={28} />} title="No orders yet" />
        ) : (
          <>
            <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border">
                    {["Order ID", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-surface-border last:border-0 hover:bg-surface-hover transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">#{o.id.slice(-8).toUpperCase()}</td>
                      <td className="px-4 py-3">
                        {o.customer ? (
                          <div>
                            <p className="text-gray-300 font-medium">{o.customer.name}</p>
                            <p className="text-xs text-gray-600">{o.customer.email}</p>
                          </div>
                        ) : <span className="text-gray-700">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{o.items.length} item(s)</td>
                      <td className="px-4 py-3 font-medium text-brand-400">{formatPrice(o.totalAmount)}</td>
                      <td className="px-4 py-3"><Badge className={getStatusColor(o.status)}>{o.status}</Badge></td>
                      <td className="px-4 py-3 text-xs text-gray-600">{formatDate(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination && <Pagination meta={pagination} onPageChange={setPage} />}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminOrdersPage;
