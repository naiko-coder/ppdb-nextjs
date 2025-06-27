"use client";
import { useEffect, useState } from "react";

export default function FormulirPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchData = async (p = 1) => {
    setLoading(true);
    const res = await fetch(`/api/ppdb_pendaftar?page=${p}&limit=10`);
    const json = await res.json();
    setData(json.data);
    setTotalPages(json.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleShowDetail = async (id: number) => {
    setLoadingDetail(true);
    setDetailId(id);
    // Ambil detail dari API (bisa pakai endpoint detail, misal /api/ppdb_pendaftar/[id])
    const res = await fetch(`/api/ppdb_pendaftar/detail?id=${id}`);
    const json = await res.json();
    setDetailData(json.data);
    setLoadingDetail(false);
  };

  const handleCloseDetail = () => {
    setDetailId(null);
    setDetailData(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Data Isi Formulir</h2>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="inline-block w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></span>
          <span className="ml-2 text-blue-600 font-semibold">Memuat data...</span>
        </div>
      ) : data.length === 0 ? (
        <div className="py-12 text-center text-gray-500 text-lg font-semibold">
          Tidak ada data
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((row, idx) => (
            <div key={row.id} className="rounded-lg border shadow p-4 bg-gray-50 relative">
              <div className="font-bold text-blue-700 text-lg mb-1">{row.nama}</div>
              <div className="text-sm text-purple-700 mb-1">Kode: {row.kode_registrasi}</div>
              <div className="text-sm text-pink-700 mb-1">Email: {row.email}</div>
              <div className="text-sm text-orange-700 mb-2">Alamat: {row.alamat}</div>
              {/* Tambahkan info singkat lain jika perlu */}
              <button
                className="mt-2 px-3 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600 transition"
                onClick={() => handleShowDetail(row.id)}
              >
                Lihat Detail
              </button>
              {/* Detail Modal/Box */}
              {detailId === row.id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
                    <button
                      className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
                      onClick={handleCloseDetail}
                      aria-label="Tutup"
                    >
                      ×
                    </button>
                    {loadingDetail ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <span className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></span>
                        <span className="ml-2 text-blue-600 font-semibold mt-2">Memuat detail...</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col items-center mb-4">
                          {/* Placeholder foto */}
                          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center mb-2 overflow-hidden border-2 border-blue-300">
                            <img
                              src={detailData?.foto_url || "/user-placeholder.svg"}
                              alt="Foto"
                              className="object-cover w-full h-full"
                              onError={e => (e.currentTarget.src = "/user-placeholder.svg")}
                            />
                          </div>
                          <div className="font-bold text-xl text-blue-700 mb-1">{detailData?.nama}</div>
                          <div className="text-sm text-gray-500 mb-2">{detailData?.kode_registrasi}</div>
                        </div>
                        <div className="space-y-2 text-base">
                          <div><span className="font-semibold text-gray-700">Email:</span> <span className="text-pink-700">{detailData?.email || "-"}</span></div>
                          <div><span className="font-semibold text-gray-700">Alamat:</span> <span className="text-orange-700">{detailData?.alamat || "-"}</span></div>
                          <div><span className="font-semibold text-gray-700">Tanggal Lahir:</span> <span className="text-green-700">{detailData?.tanggalLahir || "-"}</span></div>
                          <div><span className="font-semibold text-gray-700">No. HP Ayah:</span> <span className="text-blue-700">{detailData?.noHpAyah || "-"}</span></div>
                          <div><span className="font-semibold text-gray-700">No. HP Ibu:</span> <span className="text-blue-700">{detailData?.noHpIbu || "-"}</span></div>
                          <div><span className="font-semibold text-gray-700">No. HP Pendaftar:</span> <span className="text-blue-700">{detailData?.noHpPendaftar || "-"}</span></div>
                          {/* Tambahkan field lain jika ada */}
                        </div>
                      </>
                    )}
                  </div>
                  <style jsx>{`
                    .animate-fadeIn {
                      animation: fadeInModal 0.2s;
                    }
                    @keyframes fadeInModal {
                      from { opacity: 0; transform: translateY(30px);}
                      to { opacity: 1; transform: translateY(0);}
                    }
                  `}</style>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Pagination */}
      <div className="flex justify-end mt-8 gap-2">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1 || loading}
          className={`px-4 py-1 rounded bg-blue-500 text-white font-semibold transition-all duration-200
            ${page === 1 || loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600 scale-105 active:scale-95 shadow-md"
            }`}
          style={{ minWidth: 80 }}
        >
          Prev
        </button>
        <span className="px-3 py-1 text-gray-700 font-semibold">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages || loading}
          className={`px-4 py-1 rounded bg-blue-500 text-white font-semibold transition-all duration-200
            ${page === totalPages || loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600 scale-105 active:scale-95 shadow-md"
            }`}
          style={{ minWidth: 80 }}
        >
          Next
        </button>
      </div>
    </div>
  );
}