"use client";

import Link from "next/link";

export default function Complete() {
  return (
    <main style={{
      minHeight: "70vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8f9fa"
    }}>
      <div style={{
        background: "#fff",
        padding: "32px 24px",
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        textAlign: "center",
        maxWidth: 400
      }}>
        <h1 style={{ color: "#0070f3", marginBottom: 16 }}>Pendaftaran Berhasil!</h1>
        <p style={{ color: "#222", marginBottom: 24 }}>
          Data formulir kamu sudah berhasil disimpan.<br />
          Silakan cek email atau hubungi panitia untuk info selanjutnya.
        </p>
        <Link href="/">
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
            Kembali ke Beranda
          </button>
        </Link>
      </div>
    </main>
  );
}