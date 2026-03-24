# 💊 MediStore Frontend

> React + TypeScript + Tailwind CSS frontend for MediStore — an OTC online medicine shop.

---

## Tech Stack

| Layer         | Technology                  |
|---------------|-----------------------------|
| Framework     | React 18 + TypeScript       |
| Build Tool    | Vite                        |
| Styling       | Tailwind CSS v3             |
| Routing       | React Router v6             |
| HTTP Client   | Axios (with interceptors)   |
| State         | Context API                 |
| Notifications | react-hot-toast             |
| Icons         | lucide-react                |

---

## Project Structure

```
src/
├── api/           Axios instance + service modules per resource
├── context/       AuthContext, CartContext
├── hooks/         useFetch, useDebounce, useLocalStorage
├── types/         Shared TypeScript interfaces
├── utils/         formatPrice, formatDate, getStatusColor, getErrorMessage
├── routes/        ProtectedRoute (role-based guard)
├── components/
│   ├── common/    Button, Input, Select, Modal, Badge, Spinner,
│   │              Pagination, EmptyState, StarRating
│   ├── layout/    Navbar, MainLayout, DashboardLayout
│   └── medicine/  MedicineCard
└── pages/
    ├── auth/      LoginPage, RegisterPage
    ├── (public)   HomePage, ShopPage, MedicineDetailPage, NotFoundPage
    ├── customer/  CartPage, CheckoutPage, OrdersPage, OrderDetailPage, ProfilePage
    ├── seller/    SellerDashboardPage, SellerMedicinesPage, SellerOrdersPage
    └── admin/     AdminDashboardPage, AdminUsersPage, AdminOrdersPage, AdminCategoriesPage
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Make sure backend is running on port 5000

# 3. Start dev server (proxies /api → localhost:5000)
npm run dev
# → http://localhost:5173

# 4. Build for production
npm run build
```

---

## Pages & Routes

| Route                | Page                  | Access        |
|---------------------|-----------------------|---------------|
| `/`                 | Home                  | Public        |
| `/shop`             | Shop + Filters        | Public        |
| `/shop/:id`         | Medicine Detail       | Public        |
| `/login`            | Login                 | Public        |
| `/register`         | Register              | Public        |
| `/cart`             | Shopping Cart         | Public        |
| `/checkout`         | Checkout              | CUSTOMER      |
| `/orders`           | My Orders             | CUSTOMER      |
| `/orders/:id`       | Order Detail          | Authenticated |
| `/profile`          | Edit Profile          | Authenticated |
| `/seller/dashboard` | Seller Dashboard      | SELLER        |
| `/seller/medicines` | Inventory Management  | SELLER        |
| `/seller/orders`    | Incoming Orders       | SELLER        |
| `/admin`            | Admin Dashboard       | ADMIN         |
| `/admin/users`      | User Management       | ADMIN         |
| `/admin/orders`     | All Orders            | ADMIN         |
| `/admin/categories` | Category Management   | ADMIN         |

---

## Auth Flow

- JWT stored in `localStorage` on login/register
- `AuthContext` exposes `user`, `login`, `register`, `logout`, `updateUser`
- Axios interceptor auto-attaches `Authorization: Bearer <token>`
- 401 responses → auto logout + redirect to `/login`
- `ProtectedRoute` guards private routes by role

## Cart

- `CartContext` persists to `localStorage`
- Stock validation on add/update
- Auto-clears after successful order

---

## Demo Credentials

| Role     | Email                       | Password    |
|----------|-----------------------------|-------------|
| Admin    | admin@medistore.com         | admin123    |
| Seller   | seller@medistore.com        | seller123   |
| Customer | customer@medistore.com      | customer123 |
