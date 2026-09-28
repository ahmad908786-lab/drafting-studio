import Link from "next/link";
import { AlertTriangle, Inbox, MessageSquare, PenLine, StickyNote, Plus, ArrowRight } from "lucide-react";
import { PageHeader, KpiCard, Panel, EmptyState, Ref } from "@/components/dashboard/ui";
import { RfqChart } from "@/components/dashboard/rfq-chart";
import { Button } from "@/components/ui/button";
import { getAdminOverview } from "@/lib/admin";
import { formatCurrency } from "@/lib/utils";
import { QUOTE_STATUSES } from "@/lib/taxonomy";

export const metadata = { title: "Admin Overview" };

function timeAgo(d: Date | string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const KANBAN_COLS = ["NEW", "REVIEWING", "QUOTED"];

export default async function AdminOverviewPage() {
  const o = await getAdminOverview();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Studio activity at a glance."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/projects/new"><Plus className="size-4" /> New project</Link>
          </Button>
        }
      />

      {/* Row 1 — KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Active projects" value={o.activeProjects} icon="FolderKanban" href="/admin/projects" deltaHint={`${o.onHoldProjects} on hold`} />
        <KpiCard label="New RFQs" value={o.newRfqs} icon="Inbox" href="/admin/rfqs" delta={o.rfqsDelta} deltaHint="vs last month" />
        <KpiCard label="Pipeline value" value={formatCurrency(o.pipelineValue)} icon="DollarSign" href="/admin/rfqs" deltaHint="open quotes" />
        <KpiCard label="Leads this month" value={o.leadsMtd} icon="UserPlus" href="/admin/leads" delta={o.leadsDelta} deltaHint="vs last month" />
      </div>

      {/* Row 2 — kanban + needs attention */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Quote pipeline"
          className="lg:col-span-2"
          action={
            <Link href="/admin/rfqs" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              All RFQs <ArrowRight className="size-3" />
            </Link>
          }
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {KANBAN_COLS.map((col) => {
              const def = QUOTE_STATUSES.find((s) => s.value === col);
              const cards = o.kanbanQuotes.filter((q) => q.status === col);
              return (
                <div key={col} className="rounded-lg border border-border bg-background/50 p-2.5">
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{def?.label ?? col}</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground tabular-nums">{cards.length}</span>
                  </div>
                  <div className="space-y-2">
                    {cards.slice(0, 4).map((q) => (
                      <Link
                        key={q.id}
                        href={`/admin/rfqs/${q.id}`}
                        className="block rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/25"
                      >
                        <p className="truncate text-sm font-semibold text-foreground">{q.name}</p>
                        {q.companyName && <p className="truncate text-xs text-muted-foreground">{q.companyName}</p>}
                        <div className="mt-2 flex items-center justify-between">
                          <Ref>{q.refNumber}</Ref>
                          <span className="text-[11px] text-muted-foreground">{timeAgo(q.createdAt)}</span>
                        </div>
                        {q.quotedAmount != null && (
                          <p className="mt-1 font-mono text-sm font-bold text-foreground tabular-nums">{formatCurrency(q.quotedAmount)}</p>
                        )}
                      </Link>
                    ))}
                    {cards.length === 0 && <p className="px-1 py-3 text-center text-xs text-muted-foreground">No quotes</p>}
                    {cards.length > 4 && (
                      <Link href="/admin/rfqs" className="block px-1 py-1 text-center text-xs font-semibold text-primary hover:underline">
                        +{cards.length - 4} more
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Needs attention">
          <AttentionList
            stalled={o.stalledProjects}
            messages={o.recentClientMessages}
            newRfqs={o.newRfqs}
          />
        </Panel>
      </div>

      {/* Row 3 — chart + activity */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Panel title="RFQ submissions — last 30 days">
          <RfqChart data={o.chart} />
        </Panel>

        <Panel title="Activity">
          {o.activity.length === 0 ? (
            <EmptyState icon="Activity" title="Nothing yet" hint="Updates, notes and new RFQs will appear here." />
          ) : (
            <ol className="space-y-4">
              {o.activity.map((a) => {
                const Icon = a.kind === "update" ? PenLine : a.kind === "note" ? StickyNote : Inbox;
                return (
                  <li key={a.id}>
                    <Link href={a.href} className="group flex gap-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-foreground group-hover:underline">{a.title}</span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {a.kind === "rfq" ? <Ref>{a.body}</Ref> : a.body} · {timeAgo(a.at)}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </Panel>
      </div>
    </div>
  );
}

function AttentionList({
  stalled,
  messages,
  newRfqs,
}: {
  stalled: { id: string; title: string; updatedAt: Date }[];
  messages: { id: string; body: string; project: { id: string; title: string } }[];
  newRfqs: number;
}) {
  const rows: React.ReactNode[] = [];

  for (const p of stalled) {
    rows.push(
      <Link key={`s-${p.id}`} href={`/admin/projects/${p.id}`} className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-foreground">{p.title}</span>
          <span className="text-xs text-muted-foreground">No update in {timeAgo(p.updatedAt)}</span>
        </span>
      </Link>,
    );
  }
  for (const m of messages) {
    rows.push(
      <Link key={`m-${m.id}`} href={`/admin/projects/${m.project.id}`} className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary">
        <MessageSquare className="mt-0.5 size-4 shrink-0 text-sky-500" />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-foreground">{m.project.title}</span>
          <span className="block truncate text-xs text-muted-foreground">{m.body}</span>
        </span>
      </Link>,
    );
  }
  if (newRfqs > 0) {
    rows.push(
      <Link key="rfqs" href="/admin/rfqs" className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary">
        <Inbox className="mt-0.5 size-4 shrink-0 text-primary" />
        <span className="min-w-0">
          <span className="block text-sm font-medium text-foreground">{newRfqs} new RFQ{newRfqs === 1 ? "" : "s"} awaiting review</span>
          <span className="text-xs text-muted-foreground">Open the RFQ inbox →</span>
        </span>
      </Link>,
    );
  }

  if (rows.length === 0) {
    return <EmptyState icon="CheckCircle2" title="All clear" hint="No stalled projects, unread client messages, or unreviewed RFQs." />;
  }
  return <div className="space-y-1">{rows}</div>;
}
