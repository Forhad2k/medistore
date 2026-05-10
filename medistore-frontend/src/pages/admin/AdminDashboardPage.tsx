import React, { useEffect, useState } from "react";
import { Users, Package, TrendingUp, ShoppingBag, Pill, Store } from "lucide-react";
import { DashboardStats, adminApi } from "../../api/admin";
import { formatPrice, getStatusColor } from "../../utils";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats().then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout requiredRole="ADMIN"><Spinner size={28} className="py-20" /></DashboardLayout>;
  if (!stats) return null;

  const statCards = [
    { label: "Customers",   value: stats.totalCustomers, icon: <Users size={20} />,       color: "text-blue-400",   bg: "bg-blue-400/10"   },
    { label: "Sellers",     value: stats.totalSellers,   icon: <Store size={20} />,        color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Medicines",   value: stats.totalMedicines, icon: <Pill size={20} />,         color: "text-brand-400",  bg: "bg-brand-400/10"  },
    { label: "Total Orders",value: stats.totalOrders,    icon: <ShoppingBag size={20} />,  color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Revenue",     value: formatPrice(stats.totalRevenue), icon: <TrendingUp size={20} />, color: "text-brand-400", bg: "bg-brand-400/10" },
  ];

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-100">Admin Dashboard</h1>
          <p className="text-gray-600 text-sm mt-1">Platform overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="bg-surface-card border border-surface-border rounded-xl p-4">
              <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center ${s.color} mb-3`}>
                {s.icon}
              </div>
              <p className="font-display font-bold text-gray-100 text-xl">{s.value}</p>
              <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Orders by Status */}
        <div className="bg-surface-card border border-surface-border rounded-xl p-5">
          <h2 className="font-display font-semibold text-gray-200 mb-4">Orders by Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {stats.ordersByStatus.map((item) => (
              <div key={item.status} className="flex flex-col items-center p-3 bg-surface rounded-lg border border-surface-border">
                <p className="font-display font-bold text-gray-100 text-2xl">{item.count}</p>
                <Badge className={`mt-1.5 ${getStatusColor(item.status)}`}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
