import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect("/Login");
  response.cookies.set("token", "", { maxAge: 0, path: "/" });
  return response;
}