import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "nama_database", // ganti sesuai nama database kamu
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  const offset = (page - 1) * limit;

  const [rows] = await pool.execute<any[]>(
    "SELECT * FROM pendaftar WHERE nama LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?",
    [`%${search}%`, limit, offset]
  );
  const [countRows] = await pool.execute<mysql.RowDataPacket[]>(
    "SELECT COUNT(*) as total FROM pendaftar WHERE nama LIKE ?",
    [`%${search}%`]
  );
  const total = (countRows as mysql.RowDataPacket[])[0].total;
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json(
    {
      data: rows,
      totalPages,
      total,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}