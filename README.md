# PPDB Next.js

**PPDB Next.js** adalah aplikasi berbasis [Next.js](https://nextjs.org/) yang dirancang untuk mempermudah proses Penerimaan Peserta Didik Baru (PPDB) secara online. Proyek ini dibangun menggunakan teknologi modern demi memberikan pengalaman pendaftaran yang cepat, aman, dan efisien.

## Fitur Utama

- **Pendaftaran Online:** Calon peserta didik dapat melakukan pendaftaran secara daring dengan mudah.
- **Dashboard Admin & Peserta:** Pengelolaan data pendaftar dan status pendaftaran secara real-time.
- **Upload Dokumen via Google Drive API:** Proses unggah dokumen menggunakan integrasi Google Drive API, sehingga file tidak tersimpan langsung di database MySQL, yang secara signifikan menghemat penggunaan storage pada server.
- **Validasi & Verifikasi Data:** Data dan dokumen peserta diverifikasi secara digital.
- **Notifikasi & Pengumuman:** Informasi terbaru dan pengumuman penting langsung melalui aplikasi.

> **Catatan:**  
> Proyek ini **masih dalam tahap pengembangan aktif**. Fitur-fitur utama masih dapat berubah dan penambahan fitur akan terus dilakukan.  
> **Domain resmi aplikasi akan diumumkan menyusul** setelah pengembangan lebih lanjut.

## Teknologi yang Digunakan

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) untuk styling
- [Google Drive API](https://developers.google.com/drive) untuk upload file
- [MySQL](https://www.mysql.com/) untuk manajemen data utama
- Library dan dependency pendukung lainnya (lihat `package.json`)

## Cara Menjalankan Proyek (Development)

1. **Clone repository:**
   ```bash
   git clone https://github.com/naiko-coder/ppdb-nextjs.git
   cd ppdb-nextjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

> **Status:**  
> Proyek ini masih dalam pengembangan dan belum tersedia untuk publik.  
