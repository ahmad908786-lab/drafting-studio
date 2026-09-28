import Link from "next/link";
import { Search, Paperclip, ArrowUpRight } from "lucide-react";
import { PageHeader, Panel, StatusBadge, EmptyState, Ref } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/db";
import { formatCurrency, cn } from "@/lib/utils";
import { QUOTE_STATUSES } from "@/lib/taxonomy";

export const metadata = { title: "RFQs" };

type SP = Record<string, string | string[] | undefined>;

function timeAgo(d: Date | string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

type ServiceRef = { slug: string; name: string };

export default async function AdminRfqsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  const where = {
    ...(status ? { status } : {}),
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
  };

  const [quotes, counts] = await Promise.all([
    prisma.quote.findMany({ where, orderBy: { createdAt: "desc" }, include: { _count: { select: { files: true } } } }),
    prisma.quote.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const countFor = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;
  const total = counts.reduce((sum, c) => sum + c._count._all, 0);
  const chipHref = (s: string) => `/admin/rfqs${s ? `?status=${s}` : ""}${q ? `${s ? "&" : "?"}q=${encodeURIComponent(q)}` : ""}`;

  return (
    <div>
      <PageHeader title="RFQs" description="Quote requests from the website and pipeline management." />

      {/* Status filter + search */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <FilterChip label="All" href={chipHref("")} count={total} active={!status} />
          {QUOTE_STATUSES.map((s) => (
            <FilterChip key={s.value} label={s.label} href={chipHref(s.value)} count={countFor(s.value)} active={status === s.value} />
          ))}
        </div>
        <form className="relative w-full lg:w-64" action="/admin/rfqs" method="get">
          {status && <input type="hidden" name="status" value={status} />}
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Search name, company, ref…" className="pl-9" />
        </form>
      </div>

      <Panel padded={false}>
        {quotes.length === 0 ? (
          <div className="p-6"><EmptyState icon="Inbox" title="No RFQs match" hint="Try a different status or search." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Services</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Age</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((qr) => {
                const services = (qr.serviceIds as unknown as ServiceRef[] | null) ?? [];
                return (
                  <TableRow key={qr.id} className="transition-colors hover:bg-secondary/40">
                    <TableCell className="py-2.5">
                      <span className="flex items-center gap-1.5">
                        <Ref>{qr.refNumber}</Ref>
                        {qr._count.files > 0 && <Paperclip className="size-3 text-muted-foreground" />}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0">
                        <Link href={`/admin/rfqs/${qr.id}`} className="truncate font-medium text-foreground hover:underline">{qr.name}</Link>
                        <div className="truncate text-xs text-muted-foreground">{qr.companyName ?? qr.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden max-w-56 md:table-cell">
                      {services.length === 0 ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <span className="flex flex-wrap gap-1">
                          {services.slice(0, 2).map((s) => (
                            <Badge key={s.slug} variant="secondary" className="font-normal">{s.name}</Badge>
                          ))}
                          {services.length > 2 && <Badge variant="secondary">+{services.length - 2}</Badge>}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {qr.quotedAmount != null ? formatCurrency(qr.quotedAmount) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell><StatusBadge status={qr.status} /></TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">{timeAgo(qr.createdAt)}</TableCell>
                    <TableCell>
                      <Link href={`/admin/rfqs/${qr.id}`} aria-label={`Open ${qr.refNumber}`} className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Panel>
    </div>
  );
}

function FilterChip({ label, href, count, active }: { label: string; href: string; count: number; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-secondary",
      )}
    >
      {label}
      <span className={cn("rounded-full px-1.5 font-mono tabular-nums", active ? "bg-white/20" : "bg-secondary text-muted-foreground")}>{count}</span>
    </Link>
  );
}
