import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serves uploads stored in the database by lib/storage.ts.
 * URL shape: /files/<id>/<filename> — the filename is cosmetic (nice downloads);
 * the cuid is what identifies the file. Content never changes for an id, so it
 * is cached immutably.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; name: string }> },
) {
  const { id } = await params;

  const file = await prisma.storedFile.findUnique({
    where: { id },
    include: { chunks: { orderBy: { index: "asc" }, select: { data: true } } },
  });
  if (!file) return new Response("Not found", { status: 404 });

  const body = Buffer.concat(file.chunks.map((c) => Buffer.from(c.data)));
  const inline = file.mimeType.startsWith("image/") || file.mimeType === "application/pdf";

  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(body.length),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
