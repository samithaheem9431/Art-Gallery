"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "nk_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  function addItem(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product === product._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          slug: product.slug,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || "",
          quantity,
        },
      ];
    });
  }

  function updateQuantity(productId, quantity) {
    setItems((prev) =>
      prev
        .map((i) => (i.product === productId ? { ...i, quantity: Math.max(0, quantity) } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.product !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const count = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);

  const value = { items, addItem, updateQuantity, removeItem, clearCart, count, total };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
