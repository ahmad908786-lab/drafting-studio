import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { StatCard, Panel, StatusBadge, DashHeader } from "@/components/dashboard/ui";
import { RfqChart } from "@/components/dashboard/rfq-chart";
import { Button } from "@/components/ui/button";
import { getAdminOverview } from "@/lib/admin";
import { formatDate, formatCurrency } from "@/lib/utils";
import { QUOTE_STATUSES } from "@/lib/taxonomy";

export default async function AdminOverviewPage() {
  const o = await getAdminOverview();
  const maxFunnel = Math.max(1, ...o.funnel.map((f) => f.count));

  return (
    <div className="space-y-6">
      <DashHeader title="Overview" description="Studio activity at a glance.">
        <Button asChild size="sm"><Link href="/admin/projects/new"><Plus className="size-4" /> New project</Link></Button>
      </DashHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New RFQs" value={o.newRfqs} icon="Inbox" accent="info" href="/admin/rfqs" hint={`${o.totalRfqs} total`} />
        <StatCard label="Active projects" value={o.activeProjects} icon="FolderKanban" accent="primary" href="/admin/projects" />
        <StatCard label="Leads this month" value={o.leadsMtd} icon="UserPlus" accent="accent" href="/admin/leads" />
        <StatCard label="Published posts" value={o.publishedPosts} icon="Newspaper" accent="success" href="/admin/blog" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Panel title="RFQ submissions — last 30 days">
          <RfqChart data={o.chart} />
        </Panel>

        <Panel title="RFQ pipeline">
          <div className="space-y-3">
            {o.funnel.map((f) => {
              const def = QUOTE_STATUSES.find((s) => s.value === f.status);
              return (
                <div key={f.status}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{def?.label ?? f.status}</span>
                    <span className="font-mono text-muted-foreground">{f.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(f.count / maxFunnel) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Recent RFQs" action={<Link href="/admin/rfqs" className="text-xs font-semibold text-primary hover:underline">View all</Link>}>
          <div className="space-y-1">
            {o.recentQuotes.map((q) => (
              <Link key={q.id} href={`/admin/rfqs/${q.id}`} className="flex items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors hover:bg-secondary">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{q.refNumber}</span>
                    <StatusBadge status={q.status} />
                  </div>
                  <div className="truncate font-medium text-foreground">{q.name}{q.companyName ? ` · ${q.companyName}` : ""}</div>
                </div>
                <div className="shrink-0 text-right">
                  {q.quotedAmount != null && <div className="font-mono text-sm font-semibold text-foreground">{formatCurrency(q.quotedAmount)}</div>}
                  <div className="text-xs text-muted-foreground">{formatDate(q.createdAt)}</div>
                </div>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="Recent leads" action={<Link href="/admin/leads" className="text-xs font-semibold text-primary hover:underline">View all</Link>}>
          <div className="space-y-1">
            {o.recentLeads.map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-lg px-2 py-2 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-medium text-foreground">{l.name ?? l.email}</div>
                  <div className="truncate text-xs text-muted-foreground">{l.subject ?? l.message ?? l.email}</div>
                </div>
                <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">{l.type}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
