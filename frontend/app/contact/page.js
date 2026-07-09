"use client";

import { useState } from "react";
import { getApiUrl } from "@/lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      const res = await fetch(`${getApiUrl()}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setForm({ name: "", email: "", phone: "", message: "" });
      setStatus({ state: "success", message: data.message });
    } catch {
      setStatus({
        state: "error",
        message: "Could not send message. Make sure the backend is running and try again.",
      });
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:px-8">
      <div className="mb-10 text-center">
        <p className="eyebrow mb-3 text-muted">Get in touch</p>
        <h1 className="text-4xl font-medium md:text-5xl">Contact</h1>
        <p className="mt-4 text-foreground/70">
          For commissions, enquiries or gallery visits, send a message below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required name="name" placeholder="Name" value={form.name} onChange={handleChange}
          className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-foreground"
        />
        <input
          required type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}
          className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-foreground"
        />
        <input
          required name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}
          className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-foreground"
        />
        <textarea
          required name="message" rows={6} placeholder="Message" value={form.message} onChange={handleChange}
          className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-foreground"
        />
        <button
          type="submit"
          disabled={status.state === "loading"}
          className="w-full bg-foreground py-3.5 text-sm tracking-wide text-background transition hover:opacity-85 disabled:opacity-50"
        >
          {status.state === "loading" ? "Sending..." : "Send message"}
        </button>

        {status.state === "success" && <p className="text-sm text-green-700">{status.message}</p>}
        {status.state === "error" && <p className="text-sm text-red-600">{status.message}</p>}
      </form>
    </div>
  );
}
