import api from "./axios";
import { Medicine, PaginationMeta } from "../types";

export interface MedicineFilters {
  search?: string; categoryId?: string; minPrice?: string;
  maxPrice?: string; manufacturer?: string; page?: number; limit?: number;
}
export interface MedicinesResponse { medicines: Medicine[]; pagination: PaginationMeta; }
export interface MedicineFormData {
  name: string; description?: string; price: number; stock: number;
  manufacturer?: string; imageUrl?: string; categoryId: string; isAvailable?: boolean;
}

export const medicinesApi = {
  getAll:    (params?: MedicineFilters) => api.get<{ data: MedicinesResponse }>("/medicines", { params }),
  getById:   (id: string)               => api.get<{ data: Medicine & { reviews: any[] } }>(`/medicines/${id}`),
  // Seller
  getMine:   (params?: { page?: number; limit?: number }) =>
                                          api.get<{ data: MedicinesResponse }>("/seller/medicines", { params }),
  create:    (data: MedicineFormData)   => api.post<{ data: Medicine }>("/seller/medicines", data),
  update:    (id: string, data: Partial<MedicineFormData>) =>
                                          api.put<{ data: Medicine }>(`/seller/medicines/${id}`, data),
  remove:    (id: string)               => api.delete(`/seller/medicines/${id}`),
};
