import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "@/components/dashboard/ui";
import { LeadRowActions } from "@/components/admin/lead-row-actions";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import { LEAD_TYPES } from "@/lib/taxonomy";

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

export default async function AdminLeadsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const type = typeof sp.type === "string" ? sp.type : "";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  const where = {
    ...(type ? { type } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { subject: { contains: q } },
            { message: { contains: q } },
          ],
        }
      : {}),
  };

  const [leads, typeCounts] = await Promise.all([
    prisma.lead.findMany({ where, orderBy: { createdAt: "desc" } }),
    prisma.lead.groupBy({ by: ["type"], _count: { _all: true } }),
  ]);
  const countFor = (t: string) => typeCounts.find((c) => c.type === t)?._count._all ?? 0;
  const total = typeCounts.reduce((sum, c) => sum + c._count._all, 0);
  const chipHref = (t: string) => `/admin/leads${t ? `?type=${t}` : ""}${q ? `${t ? "&" : "?"}q=${encodeURIComponent(q)}` : ""}`;

  return (
    <div>
      <PageHeader title="Leads" description="Contact, callback and newsletter submissions." />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <FilterChip label="All" href={chipHref("")} count={total} active={!type} />
          {LEAD_TYPES.map((t) => (
            <FilterChip key={t} label={t} href={chipHref(t)} count={countFor(t)} active={type === t} />
          ))}
        </div>
        <form className="relative w-full lg:w-64" action="/admin/leads" method="get">
          {type && <input type="hidden" name="type" value={type} />}
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Search leads…" className="pl-9" />
        </form>
      </div>

      <Panel padded={false}>
        {leads.length === 0 ? (
          <div className="p-6"><EmptyState icon="UserPlus" title="No leads found" hint="Try a different type or search." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead className="w-28">Type</TableHead>
                <TableHead className="hidden md:table-cell">Message</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="w-40">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((l) => (
                <TableRow key={l.id} className="transition-colors hover:bg-secondary/40">
                  <TableCell className="py-2.5">
                    <div className="font-medium text-foreground">{l.name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{l.email}{l.phone ? ` · ${l.phone}` : ""}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{l.type}</span>
                  </TableCell>
                  <TableCell className="hidden max-w-xs md:table-cell">
                    <p className="truncate text-sm text-muted-foreground">{l.subject ? `${l.subject}: ` : ""}{l.message ?? "—"}</p>
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">{timeAgo(l.createdAt)}</TableCell>
                  <TableCell><LeadRowActions id={l.id} status={l.status} /></TableCell>
                </TableRow>
              ))}
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
