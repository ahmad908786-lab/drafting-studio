import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lead watch (21 Nov 2026): a tiny polling endpoint for the new-lead
 * WhatsApp notifier. Returns ONLY a hash of the latest lead/RFQ state —
 * no names, emails, messages, or counts ever leave the server. A watcher
 * polls this cheaply; when the hash changes, a new lead or RFQ arrived
 * and the notifier fetches the details from the admin panel.
 *
 * Deliberately unauthenticated: the response contains no PII and no
 * business data, only an opaque change hash. Do NOT add lead/RFQ
 * details to this response.
 */
export async function GET() {
  try {
    const [latestLead, latestQuote, leadCount, quoteCount] = await Promise.all([
      prisma.lead.findFirst({ orderBy: { createdAt: "desc" }, select: { id: true, createdAt: true } }),
      prisma.quote.findFirst({ orderBy: { createdAt: "desc" }, select: { id: true, createdAt: true } }),
      prisma.lead.count(),
      prisma.quote.count(),
    ]);

    const hash = createHash("sha256")
      .update(
        JSON.stringify({
          l: latestLead ? `${latestLead.id}@${latestLead.createdAt.toISOString()}` : null,
          q: latestQuote ? `${latestQuote.id}@${latestQuote.createdAt.toISOString()}` : null,
          lc: leadCount,
          qc: quoteCount,
        }),
      )
      .digest("hex");

    return NextResponse.json(
      { hash },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (err) {
    console.error("[lead-watch] failed:", err);
    return NextResponse.json({ hash: null }, { status: 503 });
  }
}
