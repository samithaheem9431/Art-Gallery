"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice, getApiUrl } from "@/lib/api";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "Pakistan",
  });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleCheckout(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      const res = await fetch(`${getApiUrl()}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        }),
      });
      if (!res.ok) throw new Error("Order failed");
      clearCart();
      setStatus({
        state: "success",
        message: "Thank you! Your order has been placed. We'll email you shortly.",
      });
    } catch {
      setStatus({
        state: "error",
        message:
          "Could not reach the server. Make sure the backend is running, then try again.",
      });
    }
  }

  if (status.state === "success") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center md:px-8">
        <h1 className="text-4xl font-medium">Order Confirmed</h1>
        <p className="mt-4 text-foreground/70">{status.message}</p>
        <Link
          href="/collections"
          className="mt-8 inline-block border border-foreground px-8 py-3 text-sm tracking-wide transition hover:bg-foreground hover:text-background"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center md:px-8">
        <h1 className="text-4xl font-medium">Your cart is empty</h1>
        <p className="mt-4 text-foreground/70">Discover original paintings across our collections.</p>
        <Link
          href="/collections"
          className="mt-8 inline-block border border-foreground px-8 py-3 text-sm tracking-wide transition hover:bg-foreground hover:text-background"
        >
          Shop all
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-12 md:px-8">
      <h1 className="mb-10 text-4xl font-medium md:text-5xl">Cart</h1>

      <div className="grid gap-12 md:grid-cols-[1.6fr_1fr]">
        {/* Items */}
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div key={item.product} className="flex gap-4 py-6">
              <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden bg-[#f4f2ee]">
                {item.image && (
                  <Image src={item.image} alt={item.title} fill sizes="96px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link href={`/products/${item.slug}`} className="font-display text-xl">
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm text-muted">{formatPrice(item.price)}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product)}
                    className="text-sm text-muted underline transition hover:text-foreground"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center border border-border self-start">
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    className="px-3 py-1.5 transition hover:bg-foreground/5"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    className="px-3 py-1.5 transition hover:bg-foreground/5"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary / checkout */}
        <div className="h-fit border border-border p-6">
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="mt-2 text-sm text-muted">Shipping calculated at checkout.</p>

          {!checkingOut ? (
            <button
              onClick={() => setCheckingOut(true)}
              className="mt-6 w-full bg-foreground py-3.5 text-sm tracking-wide text-background transition hover:opacity-85"
            >
              Check out
            </button>
          ) : (
            <form onSubmit={handleCheckout} className="mt-6 space-y-3">
              <input
                required name="name" placeholder="Full name" value={form.name} onChange={handleChange}
                className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-foreground"
              />
              <input
                required type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}
                className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-foreground"
              />
              <input
                name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}
                className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-foreground"
              />
              <textarea
                required name="address" placeholder="Shipping address" rows={3} value={form.address} onChange={handleChange}
                className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-foreground"
              />
              <input
                name="country" placeholder="Country" value={form.country} onChange={handleChange}
                className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-foreground"
              />
              <button
                type="submit"
                disabled={status.state === "loading"}
                className="w-full bg-foreground py-3.5 text-sm tracking-wide text-background transition hover:opacity-85 disabled:opacity-50"
              >
                {status.state === "loading" ? "Placing order..." : `Place order — ${formatPrice(total)}`}
              </button>
              {status.state === "error" && (
                <p className="text-sm text-red-600">{status.message}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
