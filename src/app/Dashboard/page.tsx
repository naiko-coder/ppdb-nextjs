import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import LogoutButton from "./LogoutButton";
import PendaftarTable from "./PendaftarTable";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let isAuthorized = false;
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      isAuthorized = true;
    } catch {
      isAuthorized = false;
    }
  }

  if (!isAuthorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-5xl font-bold text-red-500 mb-2">401</h1>
          <h2 className="text-2xl font-semibold mb-2">Unauthorized</h2>
          <p className="text-gray-500">Anda tidak memiliki akses ke halaman ini.</p>
        </div>
      </main>
    );
  }

  // Dummy data pendaftar
  const dataPendaftar = [
    { id: 1, nama: "Budi Santoso", tanggal: "2025-06-16", status: "Terverifikasi" },
    { id: 2, nama: "Siti Aminah", tanggal: "2025-06-15", status: "Belum" },
    { id: 3, nama: "Andi Wijaya", tanggal: "2025-06-14", status: "Terverifikasi" },
  ];

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
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700">Dashboard Admin</h1>
          <LogoutButton />
        </header>

        {/* Statistik */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-6">
          <StatCard label="Total Pendaftar" value={120} icon="👨‍🎓" color="blue" />
          <StatCard label="Sudah Diverifikasi" value={85} icon="✅" color="green" />
          <StatCard label="Belum Diverifikasi" value={35} icon="⏳" color="yellow" />
        </section>

        {/* Data Table */}
        <section className="mx-6 mb-8">
          <PendaftarTable />
        </section>
      </div>
    </div>
  );
}

// Komponen statistik card
function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  const colorMap: any = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };
  return (
    <div className={`rounded-lg shadow flex items-center p-6 ${colorMap[color]} bg-opacity-80`}>
      <div className="text-3xl mr-4">{icon}</div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm">{label}</div>
      </div>
    </div>
  );
}