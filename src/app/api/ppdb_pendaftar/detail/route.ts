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
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const [rows] = await pool.execute<any[]>(
    "SELECT * FROM ppdb_pendaftar WHERE id = ? LIMIT 1",
    [id]
  );

  if (!rows || rows.length === 0) {
    return NextResponse.json({ error: "Data not found" }, { status: 404 });
  }

  return NextResponse.json({ data: rows[0] });
}