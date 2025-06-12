import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_registrasi',
};

export async function POST(request) {
  const data = await request.json();
  const { nama, kode_registrasi } = data;
  try {
    const conn = await mysql.createConnection(dbConfig);

    // Cek apakah ada data dengan nama dan kode_registrasi yang cocok
    const [rows] = await conn.execute(
      'SELECT id FROM pendaftar WHERE nama = ? AND kode_registrasi = ?',
      [nama, kode_registrasi]
    );

    await conn.end();

    if (rows.length > 0) {
      // Data ditemukan, boleh lanjut
      return NextResponse.json({ valid: true });
    } else {
      // Data tidak ditemukan, error
      return NextResponse.json({
        valid: false,
        error: "Nama dan kode registrasi tidak cocok atau tidak ditemukan di server."
      }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ valid: false, error: err.message }, { status: 500 });
  }
}