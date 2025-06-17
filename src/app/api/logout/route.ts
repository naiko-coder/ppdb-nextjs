// Contoh Next.js API route
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Hapus cookie token
  response.cookies.set("token", "", { maxAge: 0, path: "/" });
  return response;
}