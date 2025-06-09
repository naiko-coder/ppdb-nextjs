"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../css/Registrasi.module.css";

export default function LanjutanForm() {
  const params = useSearchParams();
  const router = useRouter();

  const [userData, setUserData] = useState<{ nama: string; kode_registrasi: string } | null>(null);
  const [form, setForm] = useState({
    email: "",
    alamat: "",
  });

  // Ambil data dari query, simpan ke sessionStorage, lalu redirect ke URL tanpa query
  useEffect(() => {
    const nama = params.get("nama");
    const kode_registrasi = params.get("kode_registrasi");
    if (nama && kode_registrasi) {
      setUserData({ nama, kode_registrasi });
      if (typeof window !== "undefined") {
        sessionStorage.setItem("userData", JSON.stringify({ nama, kode_registrasi }));
      }
      router.replace("/IsiFormulir/LanjutanForm");
    } else if (typeof window !== "undefined") {
      // Ambil dari sessionStorage jika ada
      const stored = sessionStorage.getItem("userData");
      if (stored) {
        setUserData(JSON.parse(stored));
      }
    }
  }, [params, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Formulir lengkap berhasil disubmit!");
  };

  // Jangan render form sebelum data user tersedia
  if (!userData) return null;

  return (
    <main className={styles.main}>
      <div style={{ marginBottom: 16, color: "black" }}>
        <b>Nama:</b> {userData.nama}<br />
        <b>Kode Registrasi:</b> {userData.kode_registrasi}
      </div>
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
    </main>
  );
}