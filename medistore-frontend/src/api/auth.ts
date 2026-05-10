import api from "./axios";
import { User } from "../types";

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { name: string; email: string; password: string; role?: "CUSTOMER" | "SELLER"; phone?: string; }
export interface AuthResponse { user: User; token: string; }

export const authApi = {
  login:          (data: LoginPayload)    => api.post<{ data: AuthResponse }>("/auth/login", data),
  register:       (data: RegisterPayload) => api.post<{ data: AuthResponse }>("/auth/register", data),
  getMe:          ()                      => api.get<{ data: User }>("/auth/me"),
  updateProfile:  (data: Partial<User>)   => api.patch<{ data: User }>("/auth/profile", data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
                                            api.patch("/auth/change-password", data),
};
