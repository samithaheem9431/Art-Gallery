import { NextResponse } from "next/server";
import { getBackendBaseUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

async function proxyJson(req, method = "GET") {
  const backendUrl = getBackendBaseUrl();
  const auth = req.headers.get("authorization") || "";
  const contentType = req.headers.get("content-type") || "";
  const body =
    method === "GET" || method === "DELETE" ? undefined : await req.text();

  const res = await fetch(`${backendUrl}/api/site-settings`, {
    method,
    headers: {
      ...(auth ? { Authorization: auth } : {}),
      ...(body ? { "Content-Type": contentType || "application/json" } : {}),
    },
    body,
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function GET(req) {
  try {
    return await proxyJson(req, "GET");
  } catch (error) {
    console.error("[site-settings proxy]", error.message);
    return NextResponse.json({ message: "Failed to load settings" }, { status: 502 });
  }
}

export async function PUT(req) {
  try {
    return await proxyJson(req, "PUT");
  } catch (error) {
    console.error("[site-settings proxy]", error.message);
    return NextResponse.json({ message: "Failed to save settings" }, { status: 502 });
  }
}
