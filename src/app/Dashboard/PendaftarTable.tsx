"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";

// Mapping nama kolom database ke judul kolom yang diinginkan
const COLUMN_LABELS: Record<string, string> = {
  nama: "Nama Lengkap",
  tanggalLahir: "Tanggal Lahir",
  noHpAyah: "No. HP Ayah",
  noHpIbu: "No. HP Ibu",
  noHpPendaftar: "No. HP Pendaftar",
  kode_registrasi: "Kode Registrasi",
  created_at: "Terdaftar ",
  // tambahkan mapping lain jika ada kolom tambahan
};

const COLUMNS_ORDER = [
  "nama",
  "kode_registrasi",
  "tanggalLahir",
  "noHpAyah",
  "noHpIbu",
  "noHpPendaftar",
  "created_at",
];

export default function PendaftarTable() {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async (q = search, p = page) => {
    setLoading(true);
    const res = await fetch(`/api/pendaftar?search=${encodeURIComponent(q)}&page=${p}&limit=10`);
    const json = await res.json();
    setData(json.data);
    setTotalPages(json.totalPages);
    // Ambil kolom dari data pertama, urutkan sesuai COLUMNS_ORDER dan filter hanya yang ada di mapping
    if (json.data && json.data.length > 0) {
      setColumns(
        COLUMNS_ORDER.filter((col) => Object.keys(json.data[0]).includes(col))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchData(search, 1);
    }, 400); // debounce 400ms
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData(search, 1);
  };

  // Helper untuk format tanggal (YYYY-MM-DD → DD/MM/YYYY)
  function formatTanggal(tgl: string) {
    if (!tgl) return "-";
    const d = new Date(tgl);
    if (isNaN(d.getTime())) return tgl;
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  }

  function formatTanggalJam(tgl: string) {
    if (!tgl) return "-";
    const d = new Date(tgl);
    if (isNaN(d.getTime())) return tgl;
    const tanggal = d.getDate().toString().padStart(2, "0");
    const bulan = (d.getMonth() + 1).toString().padStart(2, "0");
    const tahun = d.getFullYear();
    const jam = d.getHours().toString().padStart(2, "0");
    const menit = d.getMinutes().toString().padStart(2, "0");
    return `${tanggal}/${bulan}/${tahun} ${jam}:${menit}`;
  }

  const handleCetakPDF = (row: any) => {
    const doc = new jsPDF();

    // Data statis
    doc.setFontSize(18);
    doc.text("Bukti Pendaftaran PPDB", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text("Tahun Ajaran 2025/2026", 105, 30, { align: "center" });

    // Data dinamis dari row
    let y = 50;
    doc.setFontSize(12);
    doc.text(`Nama Lengkap: ${row.nama || "-"}`, 20, y);
    y += 10;
    doc.text(`Tanggal Lahir: ${row.tanggalLahir || "-"}`, 20, y);
    y += 10;
    doc.text(`No. HP Ayah: ${row.noHpAyah || "-"}`, 20, y);
    y += 10;
    doc.text(`No. HP Ibu: ${row.noHpIbu || "-"}`, 20, y);
    y += 10;
    doc.text(`No. HP Pendaftar: ${row.noHpPendaftar || "-"}`, 20, y);
    y += 10;
    doc.text(`Kode Registrasi: ${row.kode_registrasi || "-"}`, 20, y);
    y += 10;
    doc.text(`Terdaftar Tgl: ${formatTanggalJam(row.created_at)}`, 20, y);

    // Data tambahan statis
    y += 20;
    doc.setFontSize(11);
    doc.text("Harap simpan bukti ini sebagai tanda pendaftaran.", 20, y);

    // Tampilkan PDF
    doc.save(`bukti-ppdb-${row.kode_registrasi || "pendaftar"}.pdf`);
  };

  const handleHapus = async (row: any) => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: `Yakin ingin menghapus data ${row.nama}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      // Panggil API hapus
      const res = await fetch(`/api/pendaftar/${row.kode_registrasi}`, {
        method: "DELETE",
      });
      if (res.ok) {
        Swal.fire("Terhapus!", `Data ${row.nama} berhasil dihapus.`, "success");
        // Refresh data tabel (panggil fetchData atau reload page)
        fetchData(search, page);
      } else {
        Swal.fire("Gagal!", "Data gagal dihapus.", "error");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">Data Pendaftar</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Cari nama..."
            className="border rounded px-2 py-1 text-sm w-36 text-gray-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Cari</button>
        </form>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-left font-semibold text-gray-600">No</th>
              {columns.map((col) => (
                <th key={col} className="py-2 px-4 text-left font-semibold text-gray-600">
                  {COLUMN_LABELS[col] || col}
                </th>
              ))}
              <th className="py-2 px-4 text-left font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-8 text-center">
                  <span className="inline-block w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></span>
                  <span className="ml-2 text-blue-600 font-semibold">Memuat data...</span>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center text-gray-500 py-8">Tidak ada data</td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row.kode_registrasi || idx} className="border-t">
                  <td className="py-2 px-4 text-gray-700">{(page - 1) * 10 + idx + 1}</td>
                  {columns.map((col) => (
                    <td
                      key={col}
                      className={
                        col === "tanggalLahir" || col === "created_at"
                          ? "py-2 px-4 text-black"
                          : "py-2 px-4 text-black"
                      }
                    >
                      {col === "tanggalLahir" || col === "created_at"
                        ? formatTanggal(row[col])
                        : row[col] || "-"}
                    </td>
                  ))}
                  <td className="py-2 px-4 flex gap-2 items-center">
  {/* Tombol Print */}
  <button
    className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center rounded"
    style={{ width: 32, height: 32, minWidth: 32, minHeight: 32, padding: 0 }}
    onClick={() => handleCetakPDF(row)}
    title="Cetak PDF"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="24"
      height="24"
      style={{ display: "block" }}
    >
      <rect x="9" y="11" fill="#424242" width="30" height="3"/>
      <path fill="#616161" d="M4,25h40v-7c0-2.2-1.8-4-4-4H8c-2.2,0-4,1.8-4,4V25z"/>
      <path fill="#424242" d="M8,36h32c2.2,0,4-1.8,4-4v-8H4v8C4,34.2,5.8,36,8,36z"/>
      <circle fill="#00E676" cx="40" cy="18" r="1"/>
      <rect x="11" y="4" fill="#90CAF9" width="26" height="10"/>
      <path fill="#242424" d="M37.5,31h-27C9.7,31,9,30.3,9,29.5v0c0-0.8,0.7-1.5,1.5-1.5h27c0.8,0,1.5,0.7,1.5,1.5v0 C39,30.3,38.3,31,37.5,31z"/>
      <rect x="11" y="31" fill="#90CAF9" width="26" height="11"/>
      <rect x="11" y="29" fill="#42A5F5" width="26" height="2"/>
      <g fill="#1976D2">
        <rect x="16" y="33" width="17" height="2"/>
        <rect x="16" y="37" width="13" height="2"/>
      </g>
    </svg>
  </button>
  {/* Tombol Hapus */}
  <button
    className="bg-gray-200 hover:bg-red-100 text-red-600 flex items-center justify-center rounded"
    style={{ width: 32, height: 32, minWidth: 32, minHeight: 32, padding: 0 }}
    onClick={() => handleHapus(row)}
    title="Hapus"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block" }}
    >
      <path d="M6 7h12" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7" />
    </svg>
  </button>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 rounded bg-gray-200 text-gray-700"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="px-3 py-1 rounded bg-gray-200 text-gray-700">
          Halaman <b>{page}</b> dari <b>{totalPages}</b>
        </span>
        <button
          className="px-3 py-1 rounded bg-gray-200 text-gray-700"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}