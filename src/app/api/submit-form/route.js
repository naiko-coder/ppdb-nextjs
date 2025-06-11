import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",      // ganti sesuai host MySQL kamu
  user: "root",           // ganti sesuai user MySQL kamu
  password: "",           // ganti sesuai password MySQL kamu
  database: "db_registrasi", // ganti sesuai nama database kamu
};

export async function POST(request) {
  try {
    const data = await request.json();

    const conn = await mysql.createConnection(dbConfig);
    await conn.execute(
      `INSERT INTO ppdb_pendaftar 
      (nama, kode_registrasi, email, alamat, provinsi, kabupaten, kecamatan, kelurahan, nik, no_kk, file_kk, file_akta)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.nama,
        data.kode_registrasi,
        data.email,
        data.alamat,
        data.provinsi,
        data.kabupaten,
        data.kecamatan,
        data.kelurahan,
        data.nik,
        data.no_kk,
        data.file_kk,
        data.file_akta,
      ]
    );
    await conn.end();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}