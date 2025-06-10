"use client";

import styles from './css/Registrasi.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.judulPPDB}>
        PPDB Tahun 2026-2027
      </h1>
      <h1 className={styles.title} style={{ color: "black" }}>Selamat Datang di .........</h1>
      <h2 className={styles.title}></h2>
      <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
        <Link href="/Registrasi">
          <button style={{
            padding: "10px 24px",
            borderRadius: 6,
            border: "none",
            background: "red",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer"
          }}>
            Registrasi
          </button>
        </Link>
        <Link href="/IsiFormulir">
          <button style={{
            padding: "10px 24px",
            borderRadius: 6,
            border: "none",
            background: "#0070f3",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer"
          }}>
            Isi Formulir
          </button>
        </Link>
      </div>
      <br />
      <p style={{ marginTop: 24, color: "black", textAlign: "center" }}>
        *Klik tombol <b><i>
          <span style={{ color: "red" }}>Registrasi</span>
        </i></b> jika belum mendapatkan kode registrasi.
        <br />
        *Klik tombol <b><i>
          <span style={{ color: "blue" }}>Isi Formulir</span>
        </i></b> jika sudah mendapatkan kode registrasi.
      </p>
    </main>
  );
}