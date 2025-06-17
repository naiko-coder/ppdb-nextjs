"use client";
import { useRef, useState } from "react";
import StatistikCard from "./StatistikCard";
import PendaftarTable from "./PendaftarTable";
import LogoutButton from "./LogoutButton";

export default function DashboardClient() {
  const statistikRef = useRef<{ refresh: () => void }>(null);
  const tableRef = useRef<{ refresh: () => void }>(null);
  const [loading, setLoading] = useState(false);

  const handleRefreshAll = async () => {
    setLoading(true);
    await Promise.all([
      statistikRef.current?.refresh(),
      tableRef.current?.refresh(),
    ]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
        <div className="h-20 flex items-center justify-center border-b">
          <span className="text-xl font-bold text-blue-600">PPDB Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a className="flex items-center px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold" href="#">
            <span className="mr-3">🏠</span> Dashboard
          </a>
          <a className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100" href="#">
            <span className="mr-3">📋</span> Data Pendaftar
          </a>
          <a className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100" href="#">
            <span className="mr-3">📑</span> Laporan
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700">Dashboard Admin</h1>
          <div className="flex gap-2">
            <button
              onClick={handleRefreshAll}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-blue-300 rounded-full animate-spin inline-block"></span>
              ) : (
                <img
                  src="/refresh-svgrepo-com.svg"
                  alt="Refresh"
                  className="w-4 h-4"
                  style={{ filter: "invert(1)" }}
                />
              )}
              Refresh
            </button>
            <LogoutButton />
          </div>
        </header>
        <StatistikCard ref={statistikRef} />
        <section className="mx-6 mb-8">
          <PendaftarTable ref={tableRef} />
        </section>
      </div>
    </div>
  );
}