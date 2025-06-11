import { google } from "googleapis";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Readable } from "stream";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  // Cek ukuran file maksimal 1MB (1MB = 1048576 bytes)
  if (file.size > 1048576) {
    return NextResponse.json({ error: "Ukuran file maksimal 1MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Path ke file JSON
  const keyFile = path.join(process.cwd(), "secrets/vocal-mapper-462614-f0-d62333dabb61.json");
  const credentials = JSON.parse(await fs.readFile(keyFile, "utf8"));

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });
  const drive = google.drive({ version: "v3", auth });

  // Ubah buffer ke stream
  const bufferStream = new Readable();
  bufferStream.push(buffer);
  bufferStream.push(null);

  const { data } = await drive.files.create({
    requestBody: {
      name: file.name,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    },
    media: {
      mimeType: file.type,
      body: bufferStream,
    },
    fields: "id,webViewLink,webContentLink",
  });

  return NextResponse.json({ id: data.id, link: data.webViewLink });
}