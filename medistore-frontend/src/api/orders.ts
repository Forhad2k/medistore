import api from "./axios";
import { Order, OrderStatus, PaginationMeta } from "../types";

export interface CreateOrderPayload {
  shippingAddress: string; shippingPhone: string; note?: string;
  items: { medicineId: string; quantity: number }[];
}
export interface OrdersResponse { orders: Order[]; pagination: PaginationMeta; }

export const ordersApi = {
  create:         (data: CreateOrderPayload) => api.post<{ data: Order }>("/orders", data),
  getMine:        (params?: { page?: number }) =>
                                               api.get<{ data: OrdersResponse }>("/orders", { params }),
  getById:        (id: string)               => api.get<{ data: Order }>(`/orders/${id}`),
  cancel:         (id: string)               => api.patch(`/orders/${id}/cancel`),
  // Seller
  getSellerOrders:(params?: { page?: number }) =>
                                               api.get<{ data: OrdersResponse }>("/seller/orders", { params }),
  updateStatus:   (id: string, status: OrderStatus) =>
                                               api.patch(`/seller/orders/${id}`, { status }),
  // Admin
  getAll:         (params?: { page?: number }) =>
                                               api.get<{ data: OrdersResponse }>("/admin/orders", { params }),
};
