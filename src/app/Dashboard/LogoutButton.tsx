"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/logout", { method: "POST" });
    setTimeout(() => {
      router.push("/Login");
    }, 1200); // biar animasi sempat tampil
  };

  return (
    <>
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
          opacity: loading ? 0.7 : 1,
        }}
        disabled={loading}
      >
        Logout
      </button>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "32px 48px",
              borderRadius: 12,
              boxShadow: "0 4px 24px #0002",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              className="spinner"
              style={{
                width: 38,
                height: 38,
                border: "4px solid #eee",
                borderTop: "4px solid #dc3545",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: 18,
              }}
            />
            <div
              style={{
                fontWeight: 600,
                fontSize: 18,
                color: "#dc3545",
              }}
            >
              Proses logout...
            </div>
          </div>
          <style jsx>{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}