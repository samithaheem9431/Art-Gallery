"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminLogin } from "@/lib/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(password);
      router.replace("/admin");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5">
      <h1 className="mb-2 text-center font-display text-4xl font-medium">Admin Login</h1>
      <p className="mb-8 text-center text-sm text-muted">
        Enter the admin password to manage the gallery.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-foreground"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-foreground py-3.5 text-sm tracking-wide text-background transition hover:opacity-85 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
