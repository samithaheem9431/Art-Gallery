"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    addItem(product, qty);
    router.push("/cart");
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-4">
        <span className="eyebrow text-muted">Quantity</span>
        <div className="flex items-center border border-border">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-lg transition hover:bg-foreground/5"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-2 text-lg transition hover:bg-foreground/5"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        className="w-full border border-foreground py-3.5 text-sm tracking-wide transition hover:bg-foreground hover:text-background"
      >
        {added ? "Added to cart ✓" : "Add to cart"}
      </button>
      <button
        onClick={handleBuyNow}
        className="w-full bg-foreground py-3.5 text-sm tracking-wide text-background transition hover:opacity-85"
      >
        Buy it now
      </button>
    </div>
  );
}
