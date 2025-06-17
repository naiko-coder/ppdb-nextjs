import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import DashboardClient from "./DashboardClient";

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

  return <DashboardClient />;
}