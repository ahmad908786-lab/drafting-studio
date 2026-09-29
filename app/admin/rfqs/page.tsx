import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { QUOTE_STATUSES } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import { QuotePipelineTable, type PipelineQuote } from "@/components/admin/quote-pipeline-table";

export const metadata = { title: "Quote Pipeline" };

type SP = Record<string, string | string[] | undefined>;

const VALID_STATUSES: string[] = QUOTE_STATUSES.map((s) => s.value);
const RANGE_DAYS: Record<string, number | null> = { all: null, "7d": 7, "30d": 30 };

export default async function AdminRfqsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const rawStatus = typeof sp.status === "string" ? sp.status : "";
  const status = VALID_STATUSES.includes(rawStatus) ? rawStatus : "NEW";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const rawRange = typeof sp.range === "string" ? sp.range : "";
  const range = rawRange in RANGE_DAYS ? rawRange : "all";
  const days = RANGE_DAYS[range];

  const filters = {
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { companyName: { contains: q } },
            { refNumber: { contains: q } },
          ],
        }
      : {}),
    ...(days ? { createdAt: { gte: new Date(Date.now() - days * 86_400_000) } } : {}),
  };

  const [quotes, counts] = await Promise.all([
    prisma.quote.findMany({
      where: { ...filters, status },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { files: true } } },
    }),
    prisma.quote.groupBy({ by: ["status"], where: filters, _count: { _all: true } }),
  ]);

  const countFor = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;
  const total = counts.reduce((sum, c) => sum + c._count._all, 0);
  const statusLabel = QUOTE_STATUSES.find((s) => s.value === status)?.label ?? status;

  const tabHref = (s: string) =>
    `/admin/rfqs?status=${s}${range !== "all" ? `&range=${range}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  const rows: PipelineQuote[] = quotes.map((qt) => ({
    id: qt.id,
    refNumber: qt.refNumber,
    status: qt.status,
    name: qt.name,
    email: qt.email,
    companyName: qt.companyName,
    serviceIds: (qt.serviceIds as { slug: string; name: string }[] | null) ?? [],
    quotedAmount: qt.quotedAmount,
    filesCount: qt._count.files,
    createdAt: qt.createdAt.toISOString(),
    convertedProjectId: qt.convertedProjectId,
  }));

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Quotes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quote request pipeline — {total} total across all stages.
          </p>
        </div>
        <Button asChild className="bg-emerald-500 font-semibold text-white hover:bg-emerald-600">
          <Link href="/admin/rfqs/new">
            <Plus className="mr-1 size-4" /> New quote
          </Link>
        </Button>
      </div>

      {/* Status tabs */}
      <div className="mb-5 flex gap-6 overflow-x-auto border-b">
        {QUOTE_STATUSES.map((s) => {
          const active = status === s.value;
          return (
            <Link
              key={s.value}
              href={tabHref(s.value)}
              className={cn(
                "relative whitespace-nowrap pb-3 text-[13px] font-semibold uppercase tracking-wide transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s.label}
              <span
                className={cn(
                  "ml-1.5 inline-grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 font-mono text-[11px] tabular-nums",
                  active ? "bg-emerald-500 text-white" : "bg-secondary text-muted-foreground",
                )}
              >
                {countFor(s.value)}
              </span>
              {active && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-emerald-500" />}
            </Link>
          );
        })}
      </div>

      <QuotePipelineTable status={status} statusLabel={statusLabel} q={q} range={range} quotes={rows} />
    </div>
  );
}
