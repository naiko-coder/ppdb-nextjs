import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  const offset = (page - 1) * limit;

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  // Query total data
  const [countRows] = await db.execute("SELECT COUNT(*) as total FROM pendaftar WHERE nama LIKE ?", [`%${search}%`]);
  const total = (countRows as any)[0].total;

  // Query data dengan search & pagination
  const [rows] = await db.execute(
    "SELECT * FROM pendaftar WHERE nama LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?",
    [`%${search}%`, limit, offset]
  );

  return NextResponse.json({
    data: rows,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}