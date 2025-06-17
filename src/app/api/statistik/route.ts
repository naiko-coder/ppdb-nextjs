import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  const [totalRows] = await db.execute("SELECT COUNT(*) as total FROM pendaftar");
  const [sudahRows] = await db.execute("SELECT COUNT(*) as sudah FROM pendaftar WHERE sudah_cetak=1");
  const [belumRows] = await db.execute("SELECT COUNT(*) as belum FROM pendaftar WHERE sudah_cetak=0 OR sudah_cetak IS NULL");

  const total = (totalRows as any[])[0]?.total ?? 0;
  const sudah = (sudahRows as any[])[0]?.sudah ?? 0;
  const belum = (belumRows as any[])[0]?.belum ?? 0;

  return NextResponse.json({ total, sudah, belum }, { headers: { "Cache-Control": "no-store" } });
}