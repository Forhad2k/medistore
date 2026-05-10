import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Menu, X, Package, LayoutDashboard, Pill } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const dashboardLink =
    user?.role === "ADMIN"   ? "/admin" :
    user?.role === "SELLER"  ? "/seller/dashboard" : "/orders";

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Pill size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-gray-100 text-lg hidden sm:block">MediStore</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/shop" className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-hover rounded-lg transition-all">Shop</Link>
          {user?.role === "CUSTOMER" && (
            <Link to="/orders" className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-hover rounded-lg transition-all">My Orders</Link>
          )}
          {user?.role === "SELLER" && (
            <>
              <Link to="/seller/dashboard" className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-hover rounded-lg transition-all">Dashboard</Link>
              <Link to="/seller/medicines" className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-hover rounded-lg transition-all">Inventory</Link>
              <Link to="/seller/orders" className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-hover rounded-lg transition-all">Orders</Link>
            </>
          )}
          {user?.role === "ADMIN" && (
            <>
              <Link to="/admin" className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-hover rounded-lg transition-all">Dashboard</Link>
              <Link to="/admin/users" className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-hover rounded-lg transition-all">Users</Link>
              <Link to="/admin/orders" className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-hover rounded-lg transition-all">Orders</Link>
              <Link to="/admin/categories" className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-hover rounded-lg transition-all">Categories</Link>
            </>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Cart — only for customers or guests */}
          {user?.role !== "ADMIN" && user?.role !== "SELLER" && (
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-surface-hover text-gray-400 hover:text-gray-200 transition-all">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropOpen((p) => !p)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-hover transition-all"
              >
                <div className="w-7 h-7 bg-brand-500/20 border border-brand-500/30 rounded-full flex items-center justify-center">
                  <span className="text-brand-400 text-xs font-semibold">{user.name[0].toUpperCase()}</span>
                </div>
                <span className="text-sm text-gray-300 hidden sm:block max-w-[100px] truncate">{user.name}</span>
              </button>
              {dropOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-surface-card border border-surface-border rounded-xl shadow-2xl z-20 overflow-hidden animate-slide-down">
                    <Link to={dashboardLink} onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-surface-hover hover:text-gray-100 transition-colors">
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-surface-hover hover:text-gray-100 transition-colors">
                      <User size={15} /> Profile
                    </Link>
                    {user.role === "CUSTOMER" && (
                      <Link to="/orders" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-surface-hover hover:text-gray-100 transition-colors">
                        <Package size={15} /> My Orders
                      </Link>
                    )}
                    <div className="border-t border-surface-border" />
                    <button onClick={() => { setDropOpen(false); logout(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors">Login</Link>
              <Link to="/register" className="px-3 py-1.5 text-sm bg-brand-500 hover:bg-brand-400 text-white rounded-lg transition-all shadow-lg shadow-brand-500/20">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen((p) => !p)} className="md:hidden p-2 text-gray-400 hover:text-gray-200 transition-colors">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-surface-border bg-surface-card px-4 py-3 flex flex-col gap-1 animate-slide-down">
          <Link to="/shop" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-gray-300 hover:text-gray-100 hover:bg-surface-hover rounded-lg transition-all">Shop</Link>
          {user && (
            <Link to={dashboardLink} onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-gray-300 hover:text-gray-100 hover:bg-surface-hover rounded-lg transition-all">Dashboard</Link>
          )}
          {!user && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-gray-300 hover:text-gray-100 hover:bg-surface-hover rounded-lg transition-all">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-brand-400 hover:text-brand-300 hover:bg-surface-hover rounded-lg transition-all">Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
