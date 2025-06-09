import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_registrasi',
};

function generateKodeRegistrasi() {
  const date = new Date();
  const ymd = date.toISOString().slice(0,10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `REG-${ymd}-${random}`;
}

export async function POST(request) {
  const data = await request.json();
  const { nama, tanggalLahir, noHpAyah, noHpIbu, noHpPendaftar } = data;
  const kode_registrasi = generateKodeRegistrasi();
  try {
    const conn = await mysql.createConnection(dbConfig);

    // Cek apakah nama & tanggal lahir sudah ada
    const [rows] = await conn.execute(
      'SELECT id FROM pendaftar WHERE nama = ? AND tanggalLahir = ?',
      [nama, tanggalLahir]
    );
    if (rows.length > 0) {
      await conn.end();
      return NextResponse.json(
        { success: false, error: "Nama dan tanggal lahir ini sudah terdaftar." },
        { status: 400 }
      );
    }

    // Jika belum ada, insert data baru
    await conn.execute(
      'INSERT INTO pendaftar (nama, tanggalLahir, noHpAyah, noHpIbu, noHpPendaftar, kode_registrasi) VALUES (?, ?, ?, ?, ?, ?)',
      [nama, tanggalLahir, noHpAyah, noHpIbu, noHpPendaftar, kode_registrasi]
    );
    await conn.end();
    return NextResponse.json({ success: true, kode_registrasi });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}