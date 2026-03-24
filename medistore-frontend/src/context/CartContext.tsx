import React, { createContext, useContext, useState, useCallback } from "react";
import { CartItem, Medicine } from "../types";
import toast from "react-hot-toast";

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addToCart: (medicine: Medicine, quantity?: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const save = (updated: CartItem[]) => {
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const addToCart = useCallback((medicine: Medicine, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.medicine.id === medicine.id);
      let updated: CartItem[];
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > medicine.stock) {
          toast.error(`Only ${medicine.stock} units available`);
          return prev;
        }
        updated = prev.map((i) =>
          i.medicine.id === medicine.id ? { ...i, quantity: newQty } : i
        );
        toast.success("Cart updated");
      } else {
        if (quantity > medicine.stock) {
          toast.error(`Only ${medicine.stock} units available`);
          return prev;
        }
        updated = [...prev, { medicine, quantity }];
        toast.success(`${medicine.name} added to cart`);
      }
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((medicineId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.medicine.id !== medicineId);
      localStorage.setItem("cart", JSON.stringify(updated));
      toast.success("Item removed from cart");
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((medicineId: string, quantity: number) => {
    setItems((prev) => {
      const updated = prev.map((i) =>
        i.medicine.id === medicineId ? { ...i, quantity } : i
      ).filter((i) => i.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem("cart");
  }, []);

  const totalItems  = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalAmount = items.reduce((acc, i) => acc + Number(i.medicine.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalItems, totalAmount, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
