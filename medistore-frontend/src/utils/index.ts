export const formatPrice = (price: number | string): string =>
  `৳ ${Number(price).toFixed(2)}`;

export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    PLACED:     "text-blue-400 bg-blue-400/10 border-blue-400/20",
    PROCESSING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    SHIPPED:    "text-purple-400 bg-purple-400/10 border-purple-400/20",
    DELIVERED:  "text-brand-400 bg-brand-400/10 border-brand-400/20",
    CANCELLED:  "text-red-400 bg-red-400/10 border-red-400/20",
  };
  return map[status] ?? "text-gray-400 bg-gray-400/10 border-gray-400/20";
};

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosErr = error as { response?: { data?: { message?: string } } };
    return axiosErr.response?.data?.message ?? "Something went wrong";
  }
  return "Something went wrong";
};

export const truncate = (str: string, len = 80): string =>
  str.length > len ? str.slice(0, len) + "…" : str;
