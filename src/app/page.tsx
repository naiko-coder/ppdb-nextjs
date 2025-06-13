"use client";

import { useEffect, useState } from "react";
import styles from './css/Registrasi.module.css';
import Link from 'next/link';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgb(213, 224, 231)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "32px 48px",
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="spinner" />
          <div style={{ marginTop: 18, fontWeight: 600, color: "#0070f3", fontSize: 18, display: "flex", alignItems: "center" }}>
            Loading<span className="dot-animate"></span>
          </div>
          <style jsx>{`
            .spinner {
              width: 48px;
              height: 48px;
              border: 6px solid #e0e0e0;
              border-top: 6px solid #0070f3;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 0 auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .dot-animate::after {
              content: '';
              display: inline-block;
              width: 1.5em;
              text-align: left;
              animation: dots 1.2s steps(3, end) infinite;
            }
            @keyframes dots {
              0% { content: ''; }
              33% { content: '.'; }
              66% { content: '..'; }
              100% { content: '...'; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px #0001",
          padding: "40px 32px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          animation: "fadeIn 0.8s"
        }}
      >
        <div style={{ fontSize: 48, color: "#0070f3", marginBottom: 12 }}>🎓</div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 8,
          background: "linear-gradient(90deg, #0070f3, #7928ca)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Selamat Datang di PPDB Tahun 2026/2027
        </h1>
        <p style={{ color: "#222", marginBottom: 24 }}>
          Silakan pilih menu di bawah untuk melanjutkan proses pendaftaran.
        </p>
        <Link href="/Registrasi">
          <button className="animated-btn" style={{
            width: "100%",
            padding: "12px 32px",
            borderRadius: 8,
            border: "none",
            background: "#e53e3e",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            margin: "8px 0",
            boxShadow: "0 2px 8px #e53e3e22",
            cursor: "pointer"
          }}>
            Registrasi
          </button>
        </Link>
        <Link href="/IsiFormulir">
          <button className="animated-btn" style={{
            width: "100%",
            padding: "12px 32px",
            borderRadius: 8,
            border: "none",
            background: "#0070f3",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            margin: "8px 0",
            boxShadow: "0 2px 8px #0070f322",
            cursor: "pointer"
          }}>
            Isi Formulir
          </button>
        </Link>
        <p style={{ marginTop: 24, color: "#555", fontSize: 15 }}>
          <b style={{ color: "#e53e3e" }}>Registrasi</b> digunakan jika Anda <b>belum memiliki kode registrasi</b>.<br />
          <b style={{ color: "#0070f3" }}>Isi Formulir</b> digunakan jika Anda <b>sudah memiliki kode registrasi</b>.
        </p>
      </div>
      <footer style={{ marginTop: 32, color: "#888", fontSize: 14 }}>
        &copy; 2025 PPDB TK. All rights reserved.
      </footer>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animated-btn {
          transition: transform 0.12s cubic-bezier(.4,0,.2,1), box-shadow 0.12s;
        }
        .animated-btn:active {
          transform: scale(0.96);
          box-shadow: 0 1px 4px #0002;
        }
      `}</style>
    </main>
  );
}