import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Public Pages
import HomePage            from "./pages/HomePage";
import ShopPage            from "./pages/ShopPage";
import MedicineDetailPage  from "./pages/MedicineDetailPage";
import LoginPage           from "./pages/auth/LoginPage";
import RegisterPage        from "./pages/auth/RegisterPage";
import NotFoundPage        from "./pages/NotFoundPage";

// Customer Pages
import CartPage            from "./pages/customer/CartPage";
import CheckoutPage        from "./pages/customer/CheckoutPage";
import OrdersPage          from "./pages/customer/OrdersPage";
import OrderDetailPage     from "./pages/customer/OrderDetailPage";
import ProfilePage         from "./pages/customer/ProfilePage";

// Seller Pages
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import SellerMedicinesPage from "./pages/seller/SellerMedicinesPage";
import SellerOrdersPage    from "./pages/seller/SellerOrdersPage";

// Admin Pages
import AdminDashboardPage  from "./pages/admin/AdminDashboardPage";
import AdminUsersPage      from "./pages/admin/AdminUsersPage";
import AdminOrdersPage     from "./pages/admin/AdminOrdersPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#161b27",
                color: "#e2e8f0",
                border: "1px solid #1e2535",
                borderRadius: "12px",
                fontSize: "14px",
                fontFamily: "'DM Sans', sans-serif",
              },
              success: { iconTheme: { primary: "#22c55e", secondary: "#161b27" } },
              error:   { iconTheme: { primary: "#f87171", secondary: "#161b27" } },
              duration: 3500,
            }}
          />
          <Routes>
            {/* ── Public ─────────────────────────────────────────── */}
            <Route path="/"         element={<HomePage />} />
            <Route path="/shop"     element={<ShopPage />} />
            <Route path="/shop/:id" element={<MedicineDetailPage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ── Shared protected ───────────────────────────────── */}
            <Route path="/profile"  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/cart"     element={<CartPage />} />

            {/* ── Customer ───────────────────────────────────────── */}
            <Route path="/checkout"   element={<ProtectedRoute roles={["CUSTOMER"]}><CheckoutPage /></ProtectedRoute>} />
            <Route path="/orders"     element={<ProtectedRoute roles={["CUSTOMER"]}><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />

            {/* ── Seller ─────────────────────────────────────────── */}
            <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
            <Route path="/seller/medicines" element={<SellerMedicinesPage />} />
            <Route path="/seller/orders"    element={<SellerOrdersPage />} />

            {/* ── Admin ──────────────────────────────────────────── */}
            <Route path="/admin"            element={<AdminDashboardPage />} />
            <Route path="/admin/users"      element={<AdminUsersPage />} />
            <Route path="/admin/orders"     element={<AdminOrdersPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />

            {/* ── 404 ────────────────────────────────────────────── */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
