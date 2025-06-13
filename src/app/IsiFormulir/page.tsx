"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../css/Registrasi.module.css";

export default function IsiFormulir() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nama: "",
    kode_registrasi: "",
    email: "",
    alamat: "",
    // tambahkan field lain sesuai kebutuhan
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Tambahkan state loading

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.nama.trim() === "" || form.kode_registrasi.trim() === "") {
      setError("Nama dan Kode Registrasi wajib diisi.");
      toast.error("Nama dan Kode Registrasi wajib diisi.", {
        position: "top-center",
        autoClose: false,
        closeOnClick: true,
        draggable: true,
      });
      return;
    }
    setLoading(true); // Mulai loading
    const res = await fetch("/api/cek-registrasi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: form.nama,
        kode_registrasi: form.kode_registrasi,
      }),
    });
    const result = await res.json();
    setLoading(false); // Selesai loading
    if (result.valid) {
      router.push(
        `/IsiFormulir/LanjutanForm?nama=${encodeURIComponent(form.nama)}&kode_registrasi=${encodeURIComponent(form.kode_registrasi)}`
      );
    } else {
      toast.error(result.error || "Nama atau kode registrasi tidak ditemukan.", {
        position: "top-center",
        autoClose: false,
        closeOnClick: true,
        draggable: true,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Proses simpan data form lanjutan di sini
    alert("Formulir lengkap berhasil disubmit!");
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <ToastContainer />
      {/* Loading Overlay */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "24px 36px",
              borderRadius: 10,
              boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
              fontSize: 20,
              fontWeight: 600,
              color: "#0070f3",
            }}
          >
            Loading...
          </div>
        </div>
      )}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px #0001",
          padding: "40px 32px",
          maxWidth: 420,
          width: "100%",
          margin: "0 auto",
          animation: "fadeIn 0.8s"
        }}
      >
        <h1 style={{
          fontSize: 26,
          fontWeight: 700,
          marginBottom: 8,
          background: "linear-gradient(90deg, #0070f3, #7928ca)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Isi Formulir Pendaftaran
        </h1>
        <p style={{ color: "#555", marginBottom: 24 }}>
          Masukkan data sesuai petunjuk di bawah.
        </p>
        {step === 1 && (
          <form onSubmit={handleCheck}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "black" }}>
                Nama Lengkap
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    fontSize: 16,
                    marginTop: 4,
                    color: "black",
                    textTransform: "uppercase", // <-- tambahkan ini
                  }}
                />
              </label>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "black" }}>
                Kode Registrasi
                <input
                  type="text"
                  name="kode_registrasi"
                  value={form.kode_registrasi}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    fontSize: 16,
                    marginTop: 4,
                    color: "black",
                    textTransform: "uppercase", // <-- tambahkan ini
                  }}
                />
              </label>
            </div>
            {error && (
              <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
            )}
            <button
              type="submit"
              className="animated-btn"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 6,
                border: "none",
                background: "#0070f3",
                color: "#fff",
                fontWeight: 600,
                fontSize: 16,
                marginTop: 16,
                cursor: "pointer",
              }}
            >
              Cek & Lanjutkan
            </button>
            <Link href="/" style={{ width: "100%", display: "block" }}>
              <button
                type="button"
                className="animated-btn"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 6,
                  border: "none",
                  background: "#aaa",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 16,
                  marginTop: 12,
                  cursor: "pointer",
                }}
              >
                Kembali
              </button>
            </Link>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "black" }}>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    fontSize: 16,
                    marginTop: 4,
                    color: "black",
                  }}
                />
              </label>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "black" }}>
                Alamat
                <input
                  type="text"
                  name="alamat"
                  value={form.alamat}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    fontSize: 16,
                    marginTop: 4,
                    color: "black",
                  }}
                />
              </label>
            </div>
            {/* Tambahkan field lain sesuai kebutuhan */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 6,
                border: "none",
                background: "#0070f3",
                color: "#fff",
                fontWeight: 600,
                fontSize: 16,
                marginTop: 16,
                cursor: "pointer",
              }}
            >
              Submit Formulir
            </button>
            <Link href="/" style={{ width: "100%", display: "block" }}>
              <button
                type="button"
                className="animated-btn"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 6,
                  border: "none",
                  background: "#aaa",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 16,
                  marginTop: 12,
                  cursor: "pointer",
                }}
              >
                Kembali
              </button>
            </Link>
          </form>
        )}
      </div>
      <footer style={{ marginTop: 32, color: "#888", fontSize: 14, textAlign: "center" }}>
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