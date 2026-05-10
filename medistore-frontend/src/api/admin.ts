import api from "./axios";
import { User, PaginationMeta } from "../types";

export interface UsersResponse { users: User[]; pagination: PaginationMeta; }
export interface DashboardStats {
  totalCustomers: number; totalSellers: number; totalMedicines: number;
  totalOrders: number; totalRevenue: number;
  ordersByStatus: { status: string; count: number }[];
}

export const adminApi = {
  getStats:       ()                                 => api.get<{ data: DashboardStats }>("/admin/stats"),
  getUsers:       (params?: { page?: number; role?: string; search?: string }) =>
                                                       api.get<{ data: UsersResponse }>("/admin/users", { params }),
  getUserById:    (id: string)                       => api.get<{ data: User }>(`/admin/users/${id}`),
  updateStatus:   (id: string, isBanned: boolean)   => api.patch(`/admin/users/${id}`, { isBanned }),
};
