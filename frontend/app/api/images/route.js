import { NextResponse } from "next/server";

const backendUrl = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000")
  .replace(/\/$/, "")
  .replace(/\/api$/, "");

export const dynamic = "force-dynamic";

// Proxy multipart uploads to Express + Multer (avoids rewrite issues)
export async function POST(req) {
  try {
    const form = await req.formData();
    const auth = req.headers.get("authorization") || "";

    const res = await fetch(`${backendUrl}/api/images`, {
      method: "POST",
      headers: auth ? { Authorization: auth } : {},
      body: form,
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[image upload proxy]", error.message);
    return NextResponse.json({ message: "Upload failed" }, { status: 502 });
  }
}
