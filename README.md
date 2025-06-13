# PPDB Next.js

**PPDB Next.js** adalah aplikasi berbasis [Next.js](https://nextjs.org/) untuk mempermudah proses **Penerimaan Peserta Didik Baru (PPDB)** secara online, khususnya untuk jenjang TK. Proyek ini dibangun dengan teknologi modern agar proses pendaftaran lebih cepat, aman, efisien, dan ramah pengguna, baik untuk calon peserta didik maupun admin sekolah.

---

## Fitur Utama

- **Pendaftaran Online:**  
  Calon peserta didik dapat melakukan registrasi dan pengisian formulir secara daring tanpa harus datang ke sekolah.
- **Dashboard Admin & Peserta:**  
  Admin dapat memantau, memverifikasi, dan mengelola data pendaftar secara real-time. Peserta dapat memantau status pendaftaran mereka.
- **Upload Dokumen via Google Drive API:**  
  Dokumen penting (KK, Akta Kelahiran, dsb) diunggah langsung ke Google Drive sekolah, sehingga tidak membebani storage server.
- **Validasi & Verifikasi Data:**  
  Data dan dokumen peserta diverifikasi secara digital untuk meminimalisir kesalahan dan duplikasi.
- **Notifikasi & Pengumuman:**  
  Informasi penting dan pengumuman hasil seleksi dapat diakses langsung melalui aplikasi.
- **Formulir Bertingkat & Wilayah Otomatis:**  
  Pengisian alamat menggunakan data wilayah Indonesia (provinsi, kabupaten, kecamatan, kelurahan) yang terintegrasi API.
- **Kompresi Otomatis File Gambar:**  
  File hasil foto dari HP akan otomatis dikompresi sebelum diunggah, sehingga tetap memenuhi batas maksimal ukuran file.
- **Keamanan Data:**  
  Data peserta dan dokumen penting dienkripsi dan hanya dapat diakses oleh admin yang berwenang.

---

## Cara Menjalankan Proyek

1. **Clone repository ini**
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Buat file `.env.local`** dan sesuaikan konfigurasi database serta Google Drive API.
4. **Jalankan aplikasi**
   ```sh
   npm run dev -- --hostname 0.0.0.0
   ```
   > Agar bisa diakses dari perangkat lain di jaringan yang sama (misal HP), gunakan IP lokal PC kamu, contoh: `http://192.168.1.7:3000`

---

## Teknologi yang Digunakan

- [Next.js](https://nextjs.org/) (React Framework)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (untuk styling, bisa diganti CSS module)
- [Google Drive API](https://developers.google.com/drive) (upload file dokumen)
- [MySQL](https://www.mysql.com/) (database utama)
- [React Toastify](https://fkhadra.github.io/react-toastify/) (notifikasi)
- [API Wilayah Indonesia](https://github.com/edwardsamuel/Wilayah-Indonesia) (data alamat)
- Library pendukung lainnya (lihat `package.json`)

---

## Struktur Folder

```
PPDB-TK/
├── src/
│   └── app/
│       ├── Registrasi/           # Halaman registrasi awal
│       ├── IsiFormulir/          # Formulir data lanjutan
│       ├── api/                  # API route Next.js (backend)
│       └── css/                  # CSS module
├── public/                       # File statis (logo, gambar, dsb)
├── secrets/                      # File kredensial Google Drive API
├── .env.local                    # Konfigurasi environment
├── package.json
└── README.md
```

---

## Catatan Pengembangan

- **Batas Ukuran File:**  
  File dokumen yang diunggah maksimal 1MB. Jika file dari kamera HP terlalu besar, aplikasi akan otomatis mengompres gambar sebelum upload.
- **Keamanan:**  
  Pastikan file kredensial Google Drive (`secrets/`) dan `.env.local` tidak diunggah ke repository publik.
- **Status:**  
  Proyek masih dalam tahap pengembangan aktif. Fitur dan tampilan dapat berubah sewaktu-waktu.

---

## Kontribusi

Kontribusi, saran, dan masukan sangat terbuka!  
Silakan buat issue atau pull request jika ingin berkolaborasi.

---

> **Copyright**
>
> &copy; 2025 PPDB TK.  
> Aplikasi ini dikembangkan untuk mendukung digitalisasi administrasi sekolah dan dapat digunakan sebagai referensi pengembangan PPDB online di Indonesia.
