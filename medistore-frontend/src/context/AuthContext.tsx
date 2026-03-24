import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "../types";
import { authApi, LoginPayload, RegisterPayload } from "../api/auth";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]     = useState<User | null>(null);
  const [token, setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser  = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (data: LoginPayload) => {
    const res = await authApi.login(data);
    const { user: u, token: t } = res.data.data;
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
    setToken(t);
    toast.success(`Welcome back, ${u.name}!`);
  }, []);

  const register = useCallback(async (data: RegisterPayload) => {
    const res = await authApi.register(data);
    const { user: u, token: t } = res.data.data;
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
    setToken(t);
    toast.success(`Welcome to MediStore, ${u.name}!`);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    toast.success("Logged out successfully");
    window.location.href = "/login";
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
