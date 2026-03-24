import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types";
import Spinner from "../common/Spinner";
import {
  LayoutDashboard, Users, Package, Tag, ShoppingBag,
  Pill, ClipboardList, LogOut, ChevronRight
} from "lucide-react";

interface NavItem { label: string; to: string; icon: React.ReactNode; }

const sellerNav: NavItem[] = [
  { label: "Dashboard",  to: "/seller/dashboard",  icon: <LayoutDashboard size={16} /> },
  { label: "Inventory",  to: "/seller/medicines",  icon: <Pill size={16} /> },
  { label: "Orders",     to: "/seller/orders",     icon: <ClipboardList size={16} /> },
];

const adminNav: NavItem[] = [
  { label: "Dashboard",   to: "/admin",             icon: <LayoutDashboard size={16} /> },
  { label: "Users",       to: "/admin/users",       icon: <Users size={16} /> },
  { label: "Orders",      to: "/admin/orders",      icon: <Package size={16} /> },
  { label: "Categories",  to: "/admin/categories",  icon: <Tag size={16} /> },
];

interface Props {
  children: React.ReactNode;
  requiredRole: UserRole;
}

const DashboardLayout: React.FC<Props> = ({ children, requiredRole }) => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center"><Spinner size={32} /></div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user.role !== requiredRole) return <Navigate to="/" replace />;

  const navItems = requiredRole === "ADMIN" ? adminNav : sellerNav;

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-surface-card border-r border-surface-border flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-surface-border gap-2.5">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-gray-100">MediStore</span>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${active
                    ? "bg-brand-500/15 text-brand-400 border border-brand-500/20"
                    : "text-gray-500 hover:text-gray-300 hover:bg-surface-hover"}`}
              >
                {item.icon}
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-surface-border">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-7 h-7 bg-brand-500/20 border border-brand-500/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-brand-400 text-xs font-bold">{user.name[0].toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-300 truncate">{user.name}</p>
              <p className="text-[10px] text-gray-600">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 animate-fade-in">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
