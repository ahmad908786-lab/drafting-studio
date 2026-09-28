import { notFound } from "next/navigation";
import { Mail, Phone, Building2, MapPin, Ruler, Calendar, DollarSign, FileText, Download } from "lucide-react";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import { QuoteStatusSelect } from "@/components/admin/quote-status-select";
import { QuoteDetailPanel } from "@/components/admin/quote-detail-panel";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminRfqDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      industry: true,
      files: true,
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } },
      messages: { orderBy: { createdAt: "asc" }, include: { author: { select: { name: true } } } },
      assignedTo: { select: { name: true } },
    },
  });
  if (!quote) notFound();

  const services = (quote.serviceIds as { slug: string; name: string }[]) ?? [];
  const facts = [
    { icon: Mail, label: "Email", value: quote.email },
    quote.phone && { icon: Phone, label: "Phone", value: quote.phone },
    quote.companyName && { icon: Building2, label: "Company", value: quote.companyName },
    quote.industry && { icon: Building2, label: "Industry", value: quote.industry.name },
    quote.state && { icon: MapPin, label: "State", value: quote.state },
    quote.sizeSqft && { icon: Ruler, label: "Size", value: `${quote.sizeSqft.toLocaleString()} sq ft` },
    quote.floors && { icon: Building2, label: "Floors", value: String(quote.floors) },
    quote.deadline && { icon: Calendar, label: "Deadline", value: formatDate(quote.deadline) },
    quote.budgetRange && { icon: DollarSign, label: "Budget", value: quote.budgetRange },
    quote.assignedTo && { icon: Building2, label: "Assigned", value: quote.assignedTo.name ?? "—" },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string }[];

  return (
    <div>
      <PageHeader
        title={quote.name}
        description={`${quote.refNumber} · ${formatDate(quote.createdAt)}${quote.companyName ? ` · ${quote.companyName}` : ""}`}
        backHref="/admin/rfqs"
        backLabel="RFQs"
        actions={<QuoteStatusSelect quoteId={quote.id} status={quote.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left: request detail */}
        <div className="space-y-6">
          <Panel title="Requested services">
            {services.length === 0 ? (
              <p className="text-sm text-muted-foreground">No services specified.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <span key={s.slug} className="rounded-full border border-border bg-secondary px-3 py-1 text-sm font-medium text-foreground">{s.name}</span>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Details">
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5">
                  <f.icon className="size-4 shrink-0 text-muted-foreground" />
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{f.label}</dt>
                  <dd className="ml-auto truncate text-right text-sm font-medium text-foreground">{f.value}</dd>
                </div>
              ))}
            </dl>
            {quote.description && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Scope</p>
                <p className="mt-1.5 whitespace-pre-wrap text-sm text-foreground">{quote.description}</p>
              </div>
            )}
          </Panel>

          {quote.files.length > 0 && (
            <Panel title={`Attachments (${quote.files.length})`}>
              <ul className="space-y-2">
                {quote.files.map((f) => (
                  <li key={f.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm">
                    <FileText className="size-4 shrink-0 text-primary" />
                    <span className="flex-1 truncate font-medium text-foreground">{f.name}</span>
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">{(f.sizeBytes / 1024 / 1024).toFixed(1)}MB</span>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary" aria-label={`Download ${f.name}`}><Download className="size-4" /></a>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>

        {/* Right: management */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Panel title="Manage">
            <QuoteDetailPanel
              quoteId={quote.id}
              quotedAmount={quote.quotedAmount}
              convertedProjectId={quote.convertedProjectId}
              notes={quote.notes}
              messages={quote.messages}
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}
