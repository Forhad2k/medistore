import api from "./axios";
import { Category } from "../types";

export const categoriesApi = {
  getAll:  ()                                         => api.get<{ data: Category[] }>("/categories"),
  getById: (id: string)                               => api.get<{ data: Category }>(`/categories/${id}`),
  create:  (data: { name: string; description?: string }) =>
                                                         api.post<{ data: Category }>("/admin/categories", data),
  update:  (id: string, data: { name?: string; description?: string }) =>
                                                         api.put<{ data: Category }>(`/admin/categories/${id}`, data),
  remove:  (id: string)                               => api.delete(`/admin/categories/${id}`),
};
