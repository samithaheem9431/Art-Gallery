import { NextResponse } from "next/server";

const backendUrl = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000")
  .replace(/\/$/, "")
  .replace(/\/api$/, "");

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const { id } = await params;

  if (!id || !/^[a-f0-9]{24}$/i.test(id)) {
    return NextResponse.json({ message: "Invalid image id" }, { status: 400 });
  }

  try {
    const res = await fetch(`${backendUrl}/api/images/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ message: "Image not found" }, { status: res.status });
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get("content-type") || "application/octet-stream";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[image proxy]", error.message);
    return NextResponse.json({ message: "Failed to load image" }, { status: 502 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;

  if (!id || !/^[a-f0-9]{24}$/i.test(id)) {
    return NextResponse.json({ message: "Invalid image id" }, { status: 400 });
  }

  try {
    const auth = req.headers.get("authorization") || "";
    const res = await fetch(`${backendUrl}/api/images/${id}`, {
      method: "DELETE",
      headers: auth ? { Authorization: auth } : {},
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[image delete proxy]", error.message);
    return NextResponse.json({ message: "Delete failed" }, { status: 502 });
  }
}
