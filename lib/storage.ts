import { prisma } from "@/lib/db";
import { MAX_UPLOAD_MB, ALLOWED_EXT } from "@/lib/upload-config";

/**
 * Storage abstraction. Uploads are stored in the database (StoredFile +
 * StoredFileChunk) and served by app/files/[id]/[name]/route.ts.
 *
 * Why not disk: Hostinger rebuilds the app into a fresh directory on every
 * deploy, so anything written under /public is wiped — and Next.js only serves
 * /public files that existed at build time anyway. The database survives every
 * build. To move to S3 / R2 later, implement the same `put` contract.
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

/** Rows stay well under MySQL's max_allowed_packet. */
const CHUNK_BYTES = 2 * 1024 * 1024;

class DatabaseStorageAdapter implements StorageAdapter {
  async put(file: File, folder = "rfq") {
    if (file.size > MAX_BYTES) throw new Error(`File exceeds ${MAX_UPLOAD_MB}MB limit`);
    if (!ALLOWED.has(file.type) && !extAllowed(file.name)) {
      throw new Error("Unsupported file type");
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "application/octet-stream";

    const stored = await prisma.storedFile.create({
      data: { name: file.name.slice(0, 190), mimeType, sizeBytes: bytes.length, folder },
    });
    try {
      for (let i = 0, index = 0; i < bytes.length; i += CHUNK_BYTES, index++) {
        await prisma.storedFileChunk.create({
          data: { fileId: stored.id, index, data: bytes.subarray(i, i + CHUNK_BYTES) },
        });
      }
    } catch (e) {
      await prisma.storedFile.delete({ where: { id: stored.id } }).catch(() => {});
      throw e;
    }

    return {
      url: `/files/${stored.id}/${safeName(file.name)}`,
      name: file.name,
      size: file.size,
      type: mimeType,
    };
  }
}

export const storage: StorageAdapter = new DatabaseStorageAdapter();
