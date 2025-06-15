"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "secret";

export default function Dashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    { label: "Total Pendaftar", value: 120, icon: "👨‍🎓", color: "#007bff" },
    { label: "Sudah Diverifikasi", value: 85, icon: "✅", color: "#28a745" },
    { label: "Belum Diverifikasi", value: 35, icon: "⏳", color: "#ffc107" },
  ];

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/Login");
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/Login");
      return;
    }
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      router.replace("/Login");
    }
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", display: "flex" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 220 : 60,
          background: "#343a40",
          color: "#fff",
          transition: "width 0.2s",
          minHeight: "100vh",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ padding: "18px 16px", fontWeight: 700, fontSize: 20, letterSpacing: 1, display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 28, marginRight: sidebarOpen ? 10 : 0 }}>🎓</span>
          {sidebarOpen && "PPDB Admin"}
        </div>
        <nav style={{ marginTop: 24 }}>
          <SidebarLink icon="🏠" label="Dashboard" active={true} sidebarOpen={sidebarOpen} />
          <SidebarLink icon="📋" label="Data Pendaftar" sidebarOpen={sidebarOpen} disabled />
          <SidebarLink icon="📑" label="Laporan" sidebarOpen={sidebarOpen} disabled />
        </nav>
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          style={{
            position: "absolute",
            top: 18,
            right: -18,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: "#007bff",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            cursor: "pointer",
            boxShadow: "0 2px 8px #0002",
            zIndex: 3,
            transition: "right 0.2s",
          }}
          title={sidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
        >
          {sidebarOpen ? "⏪" : "⏩"}
        </button>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header
          style={{
            background: "#fff",
            boxShadow: "0 2px 8px #0001",
            padding: "16px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 20, color: "#007bff", letterSpacing: 1 }}>
            Dashboard Admin
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 22px",
              borderRadius: 7,
              border: "none",
              background: "#dc3545",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Logout
          </button>
        </header>

        {/* Statistik */}
        <section
          style={{
            display: "flex",
            gap: 24,
            justifyContent: "flex-start",
            margin: "36px 0 24px 0",
            flexWrap: "wrap",
            paddingLeft: 32,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px #0001",
                padding: "24px 32px",
                minWidth: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderTop: `4px solid ${s.color}`,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ color: "#555", fontSize: 15, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </section>

        {/* Tabel Data Pendaftar (dummy) */}
        <section
          style={{
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 2px 12px #0001",
            maxWidth: 1100,
            margin: "0 32px 32px 32px",
            padding: "32px 24px",
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18, color: "#222" }}>
            Data Pendaftar Terbaru
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f3f6fa" }}>
                  <th style={thStyle}>No</th>
                  <th style={thStyle}>Nama</th>
                  <th style={thStyle}>Tanggal Daftar</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((no) => (
                  <tr key={no} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={tdStyle}>{no}</td>
                    <td style={tdStyle}>Nama Pendaftar {no}</td>
                    <td style={tdStyle}>2025-06-16</td>
                    <td style={tdStyle}>
                      {no % 2 === 0 ? (
                        <span style={{ color: "#28a745", fontWeight: 600 }}>Terverifikasi</span>
                      ) : (
                        <span style={{ color: "#ffc107", fontWeight: 600 }}>Belum</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <button
                        style={{
                          padding: "4px 14px",
                          borderRadius: 6,
                          border: "none",
                          background: "#007bff",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: 14,
                          cursor: "pointer",
                          marginRight: 8,
                        }}
                        disabled
                      >
                        Detail
                      </button>
                      <button
                        style={{
                          padding: "4px 14px",
                          borderRadius: 6,
                          border: "none",
                          background: "#dc3545",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: 14,
                          cursor: "pointer",
                        }}
                        disabled
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, active, sidebarOpen, disabled }: { icon: string; label: string; active?: boolean; sidebarOpen: boolean; disabled?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: sidebarOpen ? "12px 24px" : "12px 10px",
        color: active ? "#007bff" : "#fff",
        background: active ? "#fff" : "transparent",
        fontWeight: active ? 700 : 500,
        fontSize: 16,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        borderLeft: active ? "4px solid #007bff" : "4px solid transparent",
        marginBottom: 4,
        transition: "all 0.2s",
      }}
      title={label}
    >
      <span style={{ fontSize: 20, marginRight: sidebarOpen ? 14 : 0 }}>{icon}</span>
      {sidebarOpen && label}
    </div>
  );
}

const thStyle = {
  padding: "10px 8px",
  fontWeight: 700,
  color: "#222",
  fontSize: 15,
  borderBottom: "2px solid #e0e7ff",
  textAlign: "left" as const,
};

const tdStyle = {
  padding: "10px 8px",
  fontSize: 15,
  color: "#333",
  background: "#fff",
};