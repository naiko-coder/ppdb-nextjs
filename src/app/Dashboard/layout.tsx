"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
        <div className="h-20 flex items-center justify-center border-b">
          <span className="text-xl font-bold text-blue-600">PPDB Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            href="/Dashboard"
            className={`flex items-center px-4 py-2 rounded-lg font-semibold ${
              pathname === "/Dashboard"
                ? "bg-blue-100 text-blue-700"
                : "text-gray hover:bg-gray-100"
            }`}
          >
            <span className="mr-3">🏠</span> Dashboard
          </Link>
          <Link
            href="/Dashboard/Formulir"
            className={`flex items-center px-4 py-2 rounded-lg font-semibold ${
              pathname === "/Dashboard/Formulir"
                ? "bg-blue-100 text-blue-700"
                : "text-gray hover:bg-gray-100"
            }`}
          >
            <span className="mr-3">📋</span> Data isi formulir
          </Link>
          <Link
            href="/Dashboard/Laporan"
            className={`flex items-center px-4 py-2 rounded-lg font-semibold ${
              pathname === "/Dashboard/Laporan"
                ? "bg-blue-100 text-blue-700"
                : "text-gray hover:bg-gray-100"
            }`}
          >
            <span className="mr-3">📑</span> Laporan
          </Link>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}