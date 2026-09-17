import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const UPLOAD_DIR = path.resolve(process.cwd(), "public", "uploads");

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function saveUploadedFile(file: File): Promise<string> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Format file tidak didukung. Harap unggah file JPEG, PNG, atau WebP.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran file melebihi batas maksimum 5MB.");
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const ext = path.extname(file.name) || (file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg");
  const randomId = crypto.randomBytes(8).toString("hex");
  const filename = `${Date.now()}-${randomId}${ext}`;
  const targetPath = path.join(UPLOAD_DIR, filename);

  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(targetPath, Buffer.from(arrayBuffer));

  return `/uploads/${filename}`;
}

export async function deleteUploadedFile(filePath: string): Promise<void> {
  if (!filePath || !filePath.startsWith("/uploads/")) return;
  const filename = path.basename(filePath);
  const targetPath = path.join(UPLOAD_DIR, filename);
  try {
    await fs.unlink(targetPath);
  } catch {
    // Ignore error if file doesn't exist
  }
}
