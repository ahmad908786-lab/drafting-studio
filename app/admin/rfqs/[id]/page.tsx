import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Building2, MapPin, Ruler, Calendar, DollarSign, FileText, Download } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/ui";
import { QuoteStatusSelect } from "@/components/admin/quote-status-select";
import { QuoteDetailPanel } from "@/components/admin/quote-detail-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { formatDate, formatCurrency } from "@/lib/utils";

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
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string }[];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm"><Link href="/admin/rfqs" aria-label="Back"><ArrowLeft className="size-4" /></Link></Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-sans text-xl font-extrabold text-foreground">{quote.name}</h2>
              <StatusBadge status={quote.status} />
            </div>
            <p className="font-mono text-xs text-muted-foreground">{quote.refNumber} · {formatDate(quote.createdAt)}</p>
          </div>
        </div>
        <QuoteStatusSelect quoteId={quote.id} status={quote.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left: request detail */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-3 text-sm font-bold text-foreground">Requested services</h3>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <Link key={s.slug} href={`/services`} className="rounded-full border border-border bg-secondary px-3 py-1 text-sm font-medium text-foreground">{s.name}</Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-3 text-sm font-bold text-foreground">Details</h3>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5">
                  <f.icon className="size-4 text-muted-foreground" />
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{f.label}</dt>
                  <dd className="ml-auto text-sm font-medium text-foreground">{f.value}</dd>
                </div>
              ))}
            </dl>
            {quote.description && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Scope</p>
                <p className="mt-1.5 whitespace-pre-wrap text-sm text-foreground">{quote.description}</p>
              </div>
            )}
          </div>

          {quote.files.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <h3 className="mb-3 text-sm font-bold text-foreground">Attachments ({quote.files.length})</h3>
              <ul className="space-y-2">
                {quote.files.map((f) => (
                  <li key={f.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm">
                    <FileText className="size-4 text-primary" />
                    <span className="flex-1 truncate font-medium text-foreground">{f.name}</span>
                    <span className="text-xs text-muted-foreground">{(f.sizeBytes / 1024 / 1024).toFixed(1)}MB</span>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Download className="size-4" /></a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: management */}
        <QuoteDetailPanel
          quoteId={quote.id}
          quotedAmount={quote.quotedAmount}
          convertedProjectId={quote.convertedProjectId}
          notes={quote.notes}
          messages={quote.messages}
        />
      </div>
    </div>
  );
}
