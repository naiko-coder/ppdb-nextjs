"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
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
    // Validasi ke backend
    const res = await fetch("/api/cek-registrasi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: form.nama,
        kode_registrasi: form.kode_registrasi,
      }),
    });
    const result = await res.json();
    if (result.valid) {
      // Redirect ke form lanjutan, bawa nama & kode_registrasi via query
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Proses simpan data form lanjutan di sini
    alert("Formulir lengkap berhasil disubmit!");
  };

  return (
    <main className={styles.main}>
      <ToastContainer />
      <h1 className={styles.title} style={{ color: "black" }}>Isi Formulir</h1>
      <br />
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
                  color: "black", // warna teks input
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
                }}
              />
            </label>
          </div>
          {error && (
            <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
          )}
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
            Cek & Lanjutkan
          </button>
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
        </form>
      )}
    </main>
  );
}