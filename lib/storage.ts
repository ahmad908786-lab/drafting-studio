import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { MAX_UPLOAD_MB, ALLOWED_EXT } from "@/lib/upload-config";

/**
 * Storage abstraction. The default writes to /public/uploads so the dev app has
 * no external dependency. Swap this implementation for S3 / UploadThing / Vercel
 * Blob in production by implementing the same `put` contract.
 */
export interface StorageAdapter {
  put(file: File, folder?: string): Promise<{ url: string; name: string; size: number; type: string }>;
}

const ALLOWED = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/acad",
  "image/vnd.dwg",
  "application/dxf",
  "image/vnd.dxf",
  "application/octet-stream", // many browsers send this for .dwg
  "application/zip",
]);

const MAX_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
}

function extAllowed(name: string): boolean {
  const lower = name.toLowerCase();
  return ALLOWED_EXT.some((e) => lower.endsWith(e));
}

class LocalStorageAdapter implements StorageAdapter {
  async put(file: File, folder = "rfq") {
    if (file.size > MAX_BYTES) throw new Error(`File exceeds ${MAX_UPLOAD_MB}MB limit`);
    if (!ALLOWED.has(file.type) && !extAllowed(file.name)) {
      throw new Error("Unsupported file type");
    }
    const dir = join(process.cwd(), "public", "uploads", folder);
    await mkdir(dir, { recursive: true });
    const id = randomUUID().slice(0, 8);
    const filename = `${id}-${safeName(file.name)}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(join(dir, filename), bytes);
    return {
      url: `/uploads/${folder}/${filename}`,
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
    };
  }
}

export const storage: StorageAdapter = new LocalStorageAdapter();
