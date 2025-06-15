"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      router.push("/Dashboard");
    } else {
      setError(data.error || "Login gagal");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "32px 28px",
          borderRadius: 14,
          boxShadow: "0 4px 24px #0001",
          minWidth: 320,
          width: "100%",
          maxWidth: 350,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          animation: "fadeIn 0.8s",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 38, color: "#0070f3" }}>🔒</div>
          <h2 style={{ fontWeight: 700, fontSize: 22, margin: "8px 0 0 0", color: "#222" }}>
            Login Admin
          </h2>
          <p style={{ color: "#888", fontSize: 14, marginTop: 4 }}>
            Masukkan username dan password Anda
          </p>
        </div>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
          required
          autoFocus
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 7,
            border: "1px solid #ccc",
            fontSize: 16,
            background: "#f9f9f9",
            outline: "none",
            transition: "border 0.2s",
            color: "#333",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 7,
            border: "1px solid #ccc",
            fontSize: 16,
            background: "#f9f9f9",
            outline: "none",
            transition: "border 0.2s",
            color: "#333",
          }}
        />
        {error && (
          <div
            style={{
              background: "#ffeaea",
              color: "#d32f2f",
              border: "1px solid #ffcdd2",
              borderRadius: 6,
              padding: "8px 12px",
              fontWeight: 500,
              fontSize: 14,
              marginTop: 4,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        <button
          type="submit"
          className="animated-btn"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 7,
            border: "none",
            background: "#0070f3",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            marginTop: 8,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          Login
        </button>
      </form>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animated-btn {
          transition: transform 0.12s cubic-bezier(.4,0,.2,1), box-shadow 0.12s;
        }
        .animated-btn:active {
          transform: scale(0.96);
          box-shadow: 0 1px 4px #0002;
        }
      `}</style>
    </main>
  );
}