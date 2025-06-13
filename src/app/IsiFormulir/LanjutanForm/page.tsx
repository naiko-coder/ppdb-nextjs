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
  const [loading, setLoading] = useState(false);

  // Error khusus file
  const [fileErrorKK, setFileErrorKK] = useState("");
  const [fileErrorAkta, setFileErrorAkta] = useState("");

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

  // Handler untuk file upload (dengan error terpisah)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      let file = files[0];
      // Kompres jika gambar
      if (file.type.startsWith("image/")) {
        file = await compressImage(file);
      }
      if (file.size > 1048576) {
        if (name === "file_kk") setFileErrorKK("Ukuran file setelah kompres tetap lebih dari 1MB. Silakan pilih file lain.");
        if (name === "file_akta") setFileErrorAkta("Ukuran file setelah kompres tetap lebih dari 1MB. Silakan pilih file lain.");
        e.target.value = "";
        setForm((prev) => ({
          ...prev,
          [name]: null,
        }));
        return;
      }
      if (name === "file_kk") setFileErrorKK("");
      if (name === "file_akta") setFileErrorAkta("");
      setForm((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
  };

  // Kompres gambar sebelum upload (maxWidth 1200px, kualitas 0.7)
  function compressImage(file: File, maxWidth = 1200, quality = 0.7): Promise<File> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) return resolve(file);
      const img = new window.Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject();
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          },
          "image/jpeg",
          quality
        );
      };
      reader.readAsDataURL(file);
    });
  }

  // Handler submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.file_kk || !form.file_akta) {
      alert("File KK dan Akta wajib diupload!");
      return;
    }
    setLoading(true);
    try {
      // 1. Upload file KK ke Google Drive
      const formDataKK = new FormData();
      formDataKK.append("file", form.file_kk);
      const resKK = await fetch("/api/upload-drive", { method: "POST", body: formDataKK });
      const dataKK = await resKK.json();
      if (!dataKK.link) throw new Error("Gagal upload file KK");

      // 2. Upload file Akta ke Google Drive
      const formDataAkta = new FormData();
      formDataAkta.append("file", form.file_akta);
      const resAkta = await fetch("/api/upload-drive", { method: "POST", body: formDataAkta });
      const dataAkta = await resAkta.json();
      if (!dataAkta.link) throw new Error("Gagal upload file Akta");

      // 3. Submit data form + link file ke backend
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          nama: userData?.nama,
          kode_registrasi: userData?.kode_registrasi,
          file_kk: dataKK.link,
          file_akta: dataAkta.link,
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert("Formulir berhasil disimpan!");
        router.push("/Complete");
        // Reset form jika perlu
      } else {
        alert("Gagal simpan: " + result.error);
      }
    } catch (err: any) {
      alert("Terjadi error: " + err.message);
    }
    setLoading(false);
  };

  // Jangan render form sebelum data user tersedia
  if (!userData) return null;

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
          maxWidth: 480,
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
          Formulir Data Lanjutan
        </h1>
        <p style={{ color: "#555", marginBottom: 24 }}>
          Lengkapi data berikut sesuai dokumen resmi.
        </p>
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
              {form.file_kk ? (
                <button
                  type="button"
                  className="animated-btn"
                  style={{
                    display: "inline-block",
                    padding: "8px 16px",
                    background: "#e53e3e",
                    color: "#fff",
                    borderRadius: 6,
                    cursor: "pointer",
                    marginLeft: 16,
                    fontWeight: 600,
                    fontSize: 15,
                    border: "none",
                    transition: "background 0.2s"
                  }}
                  onClick={() => setForm(prev => ({ ...prev, file_kk: null }))}
                >
                  Hapus File
                </button>
              ) : (
                <label
                  htmlFor="file_kk"
                  className="animated-btn"
                  style={{
                    display: "inline-block",
                    padding: "8px 16px",
                    background: "#0070f3",
                    color: "#fff",
                    borderRadius: 6,
                    cursor: "pointer",
                    marginLeft: 16,
                    fontWeight: 600,
                    fontSize: 15,
                    transition: "background 0.2s"
                  }}
                >
                  Pilih File
                  <input
                    id="file_kk"
                    type="file"
                    name="file_kk"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    required
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
            {form.file_kk && (
              <span style={{ marginLeft: 0, color: "#333", fontSize: 14, display: "flex", alignItems: "center", gap: 8, maxWidth: 260 }}>
                <span
                  style={{
                    maxWidth: 160,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "inline-block",
                    verticalAlign: "middle"
                  }}
                  title={typeof form.file_kk === "object" && "name" in form.file_kk ? form.file_kk.name : ""}
                >
                  {typeof form.file_kk === "object" && "name" in form.file_kk ? form.file_kk.name : ""}
                </span>
              </span>
            )}
            {fileErrorKK && (
              <div style={{
                background: "#ffeaea",
                color: "#d32f2f",
                border: "1px solid #ffcdd2",
                borderRadius: 6,
                padding: "8px 12px",
                marginTop: 8,
                fontWeight: 500,
                fontSize: 14,
              }}>
                {fileErrorKK}
              </div>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: "black", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Upload Foto/Scan Akta Kelahiran</span>
              {form.file_akta ? (
                <button
                  type="button"
                  className="animated-btn"
                  style={{
                    display: "inline-block",
                    padding: "8px 16px",
                    background: "#e53e3e",
                    color: "#fff",
                    borderRadius: 6,
                    cursor: "pointer",
                    marginLeft: 16,
                    fontWeight: 600,
                    fontSize: 15,
                    border: "none",
                    transition: "background 0.2s"
                  }}
                  onClick={() => setForm(prev => ({ ...prev, file_akta: null }))}
                >
                  Hapus File
                </button>
              ) : (
                <label
                  htmlFor="file_akta"
                  className="animated-btn"
                  style={{
                    display: "inline-block",
                    padding: "8px 16px",
                    background: "#0070f3",
                    color: "#fff",
                    borderRadius: 6,
                    cursor: "pointer",
                    marginLeft: 16,
                    fontWeight: 600,
                    fontSize: 15,
                    transition: "background 0.2s"
                  }}
                >
                  Pilih File
                  <input
                    id="file_akta"
                    type="file"
                    name="file_akta"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    required
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
            {form.file_akta && (
              <span style={{ marginLeft: 0, color: "#333", fontSize: 14, display: "flex", alignItems: "center", gap: 8, maxWidth: 260 }}>
                <span
                  style={{
                    maxWidth: 160,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "inline-block",
                    verticalAlign: "middle"
                  }}
                  title={typeof form.file_akta === "object" && "name" in form.file_akta ? form.file_akta.name : ""}
                >
                  {typeof form.file_akta === "object" && "name" in form.file_akta ? form.file_akta.name : ""}
                </span>
              </span>
            )}
            {fileErrorAkta && (
              <div style={{
                background: "#ffeaea",
                color: "#d32f2f",
                border: "1px solid #ffcdd2",
                borderRadius: 6,
                padding: "8px 12px",
                marginTop: 8,
                fontWeight: 500,
                fontSize: 14,
              }}>
                {fileErrorAkta}
              </div>
            )}
          </div>
          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={loading}
            className="animated-btn"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 6,
              border: "none",
              background: loading ? "#aaa" : "#0070f3",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              marginTop: 16,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Menyimpan..." : "Submit Formulir"}
          </button>
        </form>
        <p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
          Jika file terlalu besar, gunakan fitur kamera dengan resolusi rendah atau kompres gambar sebelum upload.
        </p>
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