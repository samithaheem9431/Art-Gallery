import { NextResponse } from "next/server";
import { getBackendBaseUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

// Forward multipart body as-is to Express + Multer (do not re-parse FormData)
export async function POST(req) {
  try {
    const backendUrl = getBackendBaseUrl();
    const auth = req.headers.get("authorization") || "";
    const contentType = req.headers.get("content-type") || "";
    const body = await req.arrayBuffer();

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ message: "Expected multipart upload" }, { status: 400 });
    }

    const res = await fetch(`${backendUrl}/api/images`, {
      method: "POST",
      headers: {
        ...(auth ? { Authorization: auth } : {}),
        "Content-Type": contentType,
      },
      body,
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[image upload proxy]", error.message);
    return NextResponse.json({ message: `Upload failed: ${error.message}` }, { status: 502 });
  }
}
