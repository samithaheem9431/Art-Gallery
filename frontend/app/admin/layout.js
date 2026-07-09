"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearToken, verifyToken } from "@/lib/adminApi";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [checking, setChecking] = useState(!isLogin);

  useEffect(() => {
    if (isLogin) return;
    let active = true;
    verifyToken().then((ok) => {
      if (!active) return;
      if (!ok) router.replace("/admin/login");
      else setChecking(false);
    });
    return () => {
      active = false;
    };
  }, [isLogin, pathname, router]);

  function handleLogout() {
    clearToken();
    router.replace("/admin/login");
  }

  if (isLogin) return <div className="min-h-[70vh]">{children}</div>;

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted">Loading…</div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-6">
          <span className="font-display text-2xl font-medium">Admin</span>
          <nav className="flex gap-5 text-sm">
            <Link href="/admin" className="text-muted transition hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/admin/products/new" className="text-muted transition hover:text-foreground">
              + Product
            </Link>
            <Link href="/admin/collections/new" className="text-muted transition hover:text-foreground">
              + Collection
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" target="_blank" className="text-muted transition hover:text-foreground">
            View site ↗
          </Link>
          <button onClick={handleLogout} className="text-muted underline transition hover:text-foreground">
            Log out
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
