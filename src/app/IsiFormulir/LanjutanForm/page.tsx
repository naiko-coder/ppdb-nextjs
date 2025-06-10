"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../css/Registrasi.module.css";

export default function LanjutanForm() {
  const params = useSearchParams();
  const router = useRouter();

  const [userData, setUserData] = useState<{ nama: string; kode_registrasi: string } | null>(null);
  const [form, setForm] = useState<{
    email: string;
    alamat: string;
    provinsi: string;
    kabupaten: string;
    kecamatan: string;
    kelurahan: string;
    nik: string;
    no_kk: string;
    file_kk: File | null;
    file_akta: File | null;
  }>({
    email: "",
    alamat: "",
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    kelurahan: "",
    nik: "",
    no_kk: "",
    file_kk: null,
    file_akta: null,
  });
  const [provinsiList, setProvinsiList] = useState<any[]>([]);
  const [kabupatenList, setKabupatenList] = useState<any[]>([]);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [kelurahanList, setKelurahanList] = useState<any[]>([]);

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

  // Fetch provinsi (pakai proxy)
  useEffect(() => {
    fetch("/api/proxy-wilayah?url=" + encodeURIComponent("https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json"))
      .then(res => res.json())
      .then(data => setProvinsiList(data));
  }, []);

  // Fetch kabupaten jika provinsi berubah (pakai proxy)
  useEffect(() => {
    if (form.provinsi) {
      const prov = provinsiList.find((p) => p.name === form.provinsi);
      if (prov) {
        fetch("/api/proxy-wilayah?url=" + encodeURIComponent(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${prov.id}.json`))
          .then(res => res.json())
          .then(data => setKabupatenList(data));
      }
    } else {
      setKabupatenList([]);
      setKecamatanList([]);
      setKelurahanList([]);
    }
    setForm(f => ({ ...f, kabupaten: "", kecamatan: "", kelurahan: "" }));
    // eslint-disable-next-line
  }, [form.provinsi]);

  // Fetch kecamatan jika kabupaten berubah (pakai proxy)
  useEffect(() => {
    if (form.kabupaten) {
      const kab = kabupatenList.find((k) => k.name === form.kabupaten);
      if (kab) {
        fetch("/api/proxy-wilayah?url=" + encodeURIComponent(`https://emsifa.github.io/api-wilayah-indonesia/api/districts/${kab.id}.json`))
          .then(res => res.json())
          .then(data => setKecamatanList(data));
      }
    } else {
      setKecamatanList([]);
      setKelurahanList([]);
    }
    setForm(f => ({ ...f, kecamatan: "", kelurahan: "" }));
    // eslint-disable-next-line
  }, [form.kabupaten]);

  // Fetch kelurahan jika kecamatan berubah (pakai proxy)
  useEffect(() => {
    if (form.kecamatan) {
      const kec = kecamatanList.find((k) => k.name === form.kecamatan);
      if (kec) {
        fetch("/api/proxy-wilayah?url=" + encodeURIComponent(`https://emsifa.github.io/api-wilayah-indonesia/api/villages/${kec.id}.json`))
          .then(res => res.json())
          .then(data => setKelurahanList(data));
      }
    } else {
      setKelurahanList([]);
    }
    setForm(f => ({ ...f, kelurahan: "" }));
    // eslint-disable-next-line
  }, [form.kecamatan]);

  // Ubah handleChange agar support <select>
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Tambahkan handler untuk file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0] : null,
    }));
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
        {/* Alamat Bertingkat */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "black" }}>
            Provinsi
            <select
              name="provinsi"
              value={form.provinsi || ""}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 16, marginTop: 4, color: "black" }}
            >
              <option value="">Pilih Provinsi</option>
              {provinsiList.map((prov) => (
                <option key={prov.id} value={prov.name}>{prov.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "black" }}>
            Kabupaten
            <select
              name="kabupaten"
              value={form.kabupaten || ""}
              onChange={handleChange}
              required
              disabled={!form.provinsi}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 16, marginTop: 4, color: "black" }}
            >
              <option value="">Pilih Kabupaten</option>
              {kabupatenList.map((kab) => (
                <option key={kab.id} value={kab.name}>{kab.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "black" }}>
            Kecamatan
            <select
              name="kecamatan"
              value={form.kecamatan || ""}
              onChange={handleChange}
              required
              disabled={!form.kabupaten}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 16, marginTop: 4, color: "black" }}
            >
              <option value="">Pilih Kecamatan</option>
              {kecamatanList.map((kec) => (
                <option key={kec.id} value={kec.name}>{kec.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "black" }}>
            Kelurahan
            <select
              name="kelurahan"
              value={form.kelurahan || ""}
              onChange={handleChange}
              required
              disabled={!form.kecamatan}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 16, marginTop: 4, color: "black" }}
            >
              <option value="">Pilih Kelurahan</option>
              {kelurahanList.map((kel) => (
                <option key={kel.id} value={kel.name}>{kel.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "black" }}>
            Alamat Lengkap
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
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "black" }}>
            Nomor NIK
            <input
              type="text"
              name="nik"
              value={form.nik}
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
            Nomor KK
            <input
              type="text"
              name="no_kk"
              value={form.no_kk}
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
          <div style={{ color: "black", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Upload Foto/Scan KK</span>
            <label
              htmlFor="file_kk"
              style={{
                display: "inline-block",
                padding: "8px 16px",
                background: "#0070f3",
                color: "#fff",
                borderRadius: 6,
                cursor: "pointer",
                marginLeft: 16,
                marginBottom: 0,
                marginTop: 0,
              }}
            >
              Pilih File
            </label>
            <input
              id="file_kk"
              type="file"
              name="file_kk"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              required
              style={{ display: "none" }}
            />
          </div>
          {form.file_kk && (
            <span style={{ marginLeft: 0, color: "#333", fontSize: 14, display: "block" }}>
              {typeof form.file_kk === "object" && "name" in form.file_kk ? form.file_kk.name : ""}
            </span>
          )}
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "black", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Upload Foto/Scan Akta Kelahiran</span>
            <label
              htmlFor="file_akta"
              style={{
                display: "inline-block",
                padding: "8px 16px",
                background: "#0070f3",
                color: "#fff",
                borderRadius: 6,
                cursor: "pointer",
                marginLeft: 16,
                marginBottom: 0,
                marginTop: 0,
              }}
            >
              Pilih File
            </label>
            <input
              id="file_akta"
              type="file"
              name="file_akta"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              required
              style={{ display: "none" }}
            />
          </div>
          {form.file_akta && (
            <span style={{ marginLeft: 0, color: "#333", fontSize: 14, display: "block" }}>
              {typeof form.file_akta === "object" && "name" in form.file_akta ? form.file_akta.name : ""}
            </span>
          )}
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