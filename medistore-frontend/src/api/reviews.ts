import api from "./axios";
import { Review } from "../types";

export interface ReviewsResponse { reviews: Review[]; averageRating: number | null; totalReviews: number; }

export const reviewsApi = {
  getByMedicine: (medicineId: string) =>
                   api.get<{ data: ReviewsResponse }>(`/medicines/${medicineId}/reviews`),
  create:        (medicineId: string, data: { rating: number; comment?: string }) =>
                   api.post<{ data: Review }>(`/medicines/${medicineId}/reviews`, data),
  remove:        (id: string) => api.delete(`/reviews/${id}`),
};
