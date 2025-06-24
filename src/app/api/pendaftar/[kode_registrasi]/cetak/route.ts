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

export async function PUT(request: NextRequest, { params }: { params: { kode_registrasi: string } }) {
  const { kode_registrasi } = params;
  const body = await request.json();

  await pool.execute(
    "UPDATE pendaftar SET sudah_cetak = ? WHERE kode_registrasi = ?",
    [body.sudah_cetak, kode_registrasi]
  );

  return NextResponse.json({ success: true });
}