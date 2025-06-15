import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import type { RowDataPacket } from "mysql2";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM admin WHERE username = ?", [username]);
  if ((rows as RowDataPacket[]).length === 0) {
    return NextResponse.json({ success: false, error: "Username atau password salah" }, { status: 401 });
  }

  const admin = (rows as RowDataPacket[])[0];
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    return NextResponse.json({ success: false, error: "Username atau password salah" }, { status: 401 });
  }

  // Buat JWT token
  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: "2h" });

  const response = NextResponse.json({ success: true });
  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 2, // 2 jam
  });
  return response;
}