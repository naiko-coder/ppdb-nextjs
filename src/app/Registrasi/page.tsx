"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function Registrasi() {
  const [form, setForm] = useState({
    nama: "",
    tanggalLahir: "",
    noHpAyah: "",
    noHpIbu: "",
    noHpPendaftar: "",
  });
  const [loading, setLoading] = useState(false); // Tambah state loading

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "nama" ? value.toUpperCase() : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Mulai loading
    const res = await fetch("/api/Registrasi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await res.json();
    setLoading(false); // Selesai loading
    if (result.success) {
      toast.success(
        "Registrasi berhasil!, Harap hubungi Panitia Pendaftaran untuk mendapatkan Kode Registrasi",
        {
          position: "top-center",
          autoClose: false,
          closeOnClick: true,
          draggable: true,
        }
      );
      setForm({
        nama: "",
        tanggalLahir: "",
        noHpAyah: "",
        noHpIbu: "",
        noHpPendaftar: "",
      });
    } else {
      toast.error("Registrasi gagal: " + result.error, {
        position: "top-center",
        autoClose: false,
        closeOnClick: true,
        draggable: true,
      });
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa",
        position: "relative",
      }}
    >
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
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2rem 2.5rem",
          borderRadius: 12,
          boxShadow: "0 4px 24px #0002",
          maxWidth: 400,
          width: "100%",
          animation: "fadeIn 0.8s",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 24, color: "black" }}>
          Halaman Registrasi
        </h1>
        {/* Pemberitahuan penting */}
        <div
          style={{
            background: "#fffbe6",
            color: "#ad850e",
            border: "1.5px solid #ffe58f",
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 20,
            fontSize: 15,
            fontWeight: 500,
            textAlign: "left",
          }}
        >
          <b>Perhatian:</b> Pastikan <b>Nama</b> dan <b>Tanggal Lahir</b> yang diisi{" "}
          <u>benar-benar sesuai dokumen resmi</u> (akta kelahiran/KK), termasuk
          tanda baca, spasi, dan huruf kapital. Data ini akan digunakan untuk
          pendaftaran dan seluruh data administrasi ke depannya.
        </div>
        {/* Input Nama */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              color: "black",
              fontWeight: 500,
            }}
          >
            Nama :
          </label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            required
            placeholder="Nama Lengkap"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "black",
              backgroundColor: "#f9f9f9",
              textTransform: "uppercase", // <-- agar tampilan selalu huruf besar
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              color: "black",
              fontWeight: 500,
            }}
          >
            Tanggal Lahir :
          </label>
          <input
            type="date"
            name="tanggalLahir"
            value={form.tanggalLahir}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "black",
              backgroundColor: "#f9f9f9",
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              color: "black",
              fontWeight: 500,
            }}
          >
            Nomor Whatsapp Ayah:
          </label>
          <input
            type="text"
            name="noHpAyah"
            value={form.noHpAyah}
            onChange={(e) => {
              // Hanya izinkan angka
              const value = e.target.value.replace(/\D/g, "");
              setForm({ ...form, noHpAyah: value });
            }}
            required
            placeholder="08xxxxxxxxx"
            inputMode="numeric"
            pattern="[0-9]*"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "black",
              backgroundColor: "#f9f9f9",
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              color: "black",
              fontWeight: 500,
            }}
          >
            Nomor Whatsapp Ibu :
          </label>
          <input
            type="text"
            name="noHpIbu"
            value={form.noHpIbu}
            onChange={(e) => {
              // Hanya izinkan angka
              const value = e.target.value.replace(/\D/g, "");
              setForm({ ...form, noHpIbu: value });
            }}
            required
            placeholder="08xxxxxxxxx"
            inputMode="numeric"
            pattern="[0-9]*"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "black",
              backgroundColor: "#f9f9f9",
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              color: "black",
              fontWeight: 500,
            }}
          >
            Nomor Whatsapp Pendaftar :
          </label>
          <input
            type="text"
            name="noHpPendaftar"
            value={form.noHpPendaftar}
            onChange={(e) => {
              // Hanya izinkan angka
              const value = e.target.value.replace(/\D/g, "");
              setForm({ ...form, noHpPendaftar: value });
            }}
            required
            placeholder="08xxxxxxxxx"
            inputMode="numeric"
            pattern="[0-9]*"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "black",
              backgroundColor: "#f9f9f9",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
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
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: 16,
          }}
        >
          {loading ? "Memproses..." : "Registrasi"}
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
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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