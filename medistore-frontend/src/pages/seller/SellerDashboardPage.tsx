import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Pill, TrendingUp, Clock } from "lucide-react";
import { ordersApi } from "../../api/orders";
import { medicinesApi } from "../../api/medicines";
import { Order, Medicine } from "../../types";
import { formatPrice, formatDate, getStatusColor } from "../../utils";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";

const SellerDashboardPage: React.FC = () => {
  const [orders, setOrders]       = useState<Order[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      ordersApi.getSellerOrders({ page: 1 }),
      medicinesApi.getMine({ limit: 5 }),
    ]).then(([ordRes, medRes]) => {
      setOrders(ordRes.data.data.orders.slice(0, 5));
      setMedicines(medRes.data.data.medicines);
    }).finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.filter((o) => o.status !== "CANCELLED")
    .reduce((acc, o) => acc + Number(o.totalAmount), 0);

  const stats = [
    { label: "Total Orders",   value: orders.length,     icon: <Package size={18} />,    color: "text-blue-400" },
    { label: "Medicines Listed", value: medicines.length, icon: <Pill size={18} />,       color: "text-brand-400" },
    { label: "Revenue",         value: formatPrice(totalRevenue), icon: <TrendingUp size={18} />, color: "text-purple-400" },
    { label: "Pending",         value: orders.filter((o) => o.status === "PLACED").length, icon: <Clock size={18} />, color: "text-yellow-400" },
  ];

  return (
    <DashboardLayout requiredRole="SELLER">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-100">Seller Dashboard</h1>
          <p className="text-gray-600 text-sm mt-1">Overview of your pharmacy</p>
        </div>

        {loading ? <Spinner size={28} className="py-20" /> : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-surface-card border border-surface-border rounded-xl p-4">
                  <div className={`${s.color} mb-3`}>{s.icon}</div>
                  <p className="font-display font-bold text-gray-100 text-xl">{s.value}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-surface-card border border-surface-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-gray-200">Recent Orders</h2>
                <Link to="/seller/orders" className="text-xs text-brand-400 hover:text-brand-300">View all</Link>
              </div>
              {orders.length === 0 ? (
                <p className="text-gray-600 text-sm py-4 text-center">No orders yet</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {orders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between py-2.5 border-b border-surface-border last:border-0">
                      <div>
                        <p className="text-sm text-gray-300 font-mono">#{o.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-600">{formatDate(o.createdAt)}</p>
                      </div>
                      <Badge className={getStatusColor(o.status)}>{o.status}</Badge>
                      <p className="text-sm font-medium text-brand-400">{formatPrice(o.totalAmount)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SellerDashboardPage;
