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