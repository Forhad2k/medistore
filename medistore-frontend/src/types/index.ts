export type UserRole = "CUSTOMER" | "SELLER" | "ADMIN";
export type OrderStatus = "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface User {
  id: string; name: string; email: string; role: UserRole;
  phone?: string; address?: string; isBanned: boolean;
  createdAt: string; updatedAt: string;
}
export interface Category {
  id: string; name: string; description?: string;
  _count?: { medicines: number };
}
export interface Medicine {
  id: string; name: string; description?: string;
  price: number; stock: number; manufacturer?: string;
  imageUrl?: string; isAvailable: boolean; createdAt: string;
  category: { id: string; name: string };
  seller: { id: string; name: string };
  averageRating?: number | null; totalReviews?: number;
}
export interface OrderItem {
  id: string; quantity: number; unitPrice: number;
  medicine: { id: string; name: string; imageUrl?: string; price?: number; manufacturer?: string };
}
export interface Order {
  id: string; status: OrderStatus; totalAmount: number;
  shippingAddress: string; shippingPhone: string; note?: string;
  createdAt: string; updatedAt: string;
  customer?: { id: string; name: string; email: string; phone?: string };
  items: OrderItem[];
}
export interface Review {
  id: string; rating: number; comment?: string; createdAt: string;
  customer: { id: string; name: string };
}
export interface CartItem { medicine: Medicine; quantity: number; }
export interface PaginationMeta { total: number; page: number; limit: number; totalPages: number; }
