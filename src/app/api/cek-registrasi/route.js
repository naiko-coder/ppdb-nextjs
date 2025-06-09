import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_registrasi',
};

export async function POST(request) {
  const { nama, kode_registrasi } = await request.json();
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute(
      'SELECT id FROM pendaftar WHERE nama = ? AND kode_registrasi = ?',
      [nama, kode_registrasi]
    );
    await conn.end();
    if (rows.length > 0) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false, error: "Nama atau kode registrasi tidak ditemukan." }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ valid: false, error: err.message }, { status: 500 });
  }
}