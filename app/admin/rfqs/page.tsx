import Link from "next/link";
import { Search, Paperclip, ArrowUpRight } from "lucide-react";
import { DashHeader, StatusBadge, DashEmpty } from "@/components/dashboard/ui";
import { QuoteStatusSelect } from "@/components/admin/quote-status-select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { formatDate, formatCurrency } from "@/lib/utils";
import { QUOTE_STATUSES } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

type SP = Record<string, string | string[] | undefined>;

export default async function AdminRfqsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "";
  const q = typeof sp.q === "string" ? sp.q : "";

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (q) where.OR = [{ name: { contains: q } }, { email: { contains: q } }, { companyName: { contains: q } }, { refNumber: { contains: q } }];

  const [quotes, counts] = await Promise.all([
    prisma.quote.findMany({ where, orderBy: { createdAt: "desc" }, include: { industry: true, _count: { select: { files: true } } } }),
    prisma.quote.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const countFor = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;
  const total = counts.reduce((sum, c) => sum + c._count._all, 0);

  return (
    <div>
      <DashHeader title="RFQs" description="Quote requests from the website and pipeline management." />

      {/* Status filter + search */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <FilterChip label="All" href="/admin/rfqs" count={total} active={!status} />
          {QUOTE_STATUSES.map((s) => (
            <FilterChip key={s.value} label={s.label} href={`/admin/rfqs?status=${s.value}`} count={countFor(s.value)} active={status === s.value} />
          ))}
        </div>
        <form className="relative w-full lg:w-64">
          {status && <input type="hidden" name="status" value={status} />}
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Search name, email, ref…" className="pl-9" />
        </form>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        {quotes.length === 0 ? (
          <div className="p-6"><DashEmpty label="No RFQs match" hint="Try a different status or search." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead className="hidden md:table-cell">Industry</TableHead>
                <TableHead className="hidden lg:table-cell">Size</TableHead>
                <TableHead>Quoted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((qr) => (
                <TableRow key={qr.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {qr.refNumber}
                      {qr._count.files > 0 && <Paperclip className="size-3" />}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{qr.name}</div>
                    <div className="text-xs text-muted-foreground">{qr.companyName ?? qr.email}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{qr.industry?.name ?? "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">{qr.sizeSqft ? `${qr.sizeSqft.toLocaleString()} sf` : "—"}</TableCell>
                  <TableCell className="font-mono text-sm">{qr.quotedAmount != null ? formatCurrency(qr.quotedAmount) : "—"}</TableCell>
                  <TableCell><QuoteStatusSelect quoteId={qr.id} status={qr.status} /></TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{formatDate(qr.createdAt)}</TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="icon-sm"><Link href={`/admin/rfqs/${qr.id}`} aria-label="Open"><ArrowUpRight className="size-4" /></Link></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function FilterChip({ label, href, count, active }: { label: string; href: string; count: number; active: boolean }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-secondary")}>
      {label} <span className={cn("rounded-full px-1.5", active ? "bg-white/20" : "bg-muted text-muted-foreground")}>{count}</span>
    </Link>
  );
}
