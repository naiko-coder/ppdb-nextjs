import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function DELETE(request: Request, { params }: { params: { kode_registrasi: string } }) {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  const [result] = await db.execute(
    "DELETE FROM pendaftar WHERE kode_registrasi = ?",
    [params.kode_registrasi]
  );

  return NextResponse.json({ success: true });
}