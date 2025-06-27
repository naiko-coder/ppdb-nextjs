import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "db_registrasi",
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
    "SELECT * FROM ppdb_pendaftar WHERE nama LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?",
    [`%${search}%`, limit, offset]
  );
const [countRows] = await pool.execute(
  "SELECT COUNT(*) as total FROM ppdb_pendaftar WHERE nama LIKE ?",
  [`%${search}%`]
);
const total =
  Array.isArray(countRows) && countRows[0]
    ? (countRows[0] as { total: number }).total
    : 0;
  const totalPages = Math.ceil(total / limit);
// No additional code needed here, you can remove $PLACEHOLDER$
  return NextResponse.json(
    {
      data: rows,
      totalPages,
      total,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}