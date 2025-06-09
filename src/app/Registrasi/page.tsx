"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    setForm({ ...form, [e.target.name]: e.target.value });
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
      }}
    >
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2rem 2.5rem",
          borderRadius: 12,
          boxShadow: "0 4px 24px #0002",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 24, color: "black" }}>
          Halaman Registrasi
        </h1>
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
            placeholder="NAMA LENGKAP"
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
        {loading && (
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <span className="spinner" />
          </div>
        )}
      </form>
      {/* Spinner CSS */}
      <style>{`
        .spinner {
          display: inline-block;
          width: 28px;
          height: 28px;
          border: 3px solid #ccc;
          border-top: 3px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </main>
  );
}