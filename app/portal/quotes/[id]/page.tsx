import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Download, FolderKanban } from "lucide-react";
import { StatusBadge, Panel } from "@/components/dashboard/ui";
import { QuoteMessages } from "@/components/portal/quote-messages";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/guards";
import { getPortalQuote } from "@/lib/portal";
import { formatDate } from "@/lib/utils";

export default async function PortalQuoteDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const quote = await getPortalQuote(user, id);
  if (!quote) notFound();

  const services = (quote.serviceIds as { name: string }[]) ?? [];
  const threadMessages = quote.messages.map((m) => ({ id: m.id, body: m.body, createdAt: m.createdAt, fromClient: m.fromClient, authorName: m.author?.name ?? null }));

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon-sm"><Link href="/portal/quotes" aria-label="Back"><ArrowLeft className="size-4" /></Link></Button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-sans text-xl font-extrabold text-foreground">{quote.refNumber}</h2>
            <StatusBadge status={quote.status} />
          </div>
          <p className="text-xs text-muted-foreground">Submitted {formatDate(quote.createdAt)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Panel title="Request summary">
            <dl className="grid gap-3 sm:grid-cols-2">
              <Info label="Services" value={services.map((s) => s.name).join(", ") || "—"} full />
              {quote.industry && <Info label="Industry" value={quote.industry.name} />}
              {quote.state && <Info label="State" value={quote.state} />}
              {quote.sizeSqft && <Info label="Size" value={`${quote.sizeSqft.toLocaleString()} sq ft`} />}
              {quote.deadline && <Info label="Deadline" value={formatDate(quote.deadline)} />}
              {quote.budgetRange && <Info label="Budget" value={quote.budgetRange} />}
            </dl>
            {quote.description && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Your notes</p>
                <p className="mt-1.5 whitespace-pre-wrap text-sm text-foreground">{quote.description}</p>
              </div>
            )}
          </Panel>

          {quote.files.length > 0 && (
            <Panel title={`Attachments (${quote.files.length})`}>
              <ul className="space-y-2">
                {quote.files.map((f) => (
                  <li key={f.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm">
                    <FileText className="size-4 text-primary" />
                    <span className="flex-1 truncate font-medium text-foreground">{f.name}</span>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Download className="size-4" /></a>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {quote.convertedProject && (
            <div className="flex items-center justify-between rounded-xl border border-success/30 bg-success/5 p-4">
              <div className="flex items-center gap-2 text-sm">
                <FolderKanban className="size-4 text-success" />
                <span className="font-medium text-foreground">This quote is now an active project.</span>
              </div>
              <Button asChild size="sm" variant="outline"><Link href={`/portal/projects/${quote.convertedProject.id}`}>Open project</Link></Button>
            </div>
          )}
        </div>

        <Panel title="Messages">
          <QuoteMessages quoteId={quote.id} messages={threadMessages} status={quote.status} quotedAmount={quote.quotedAmount} />
        </Panel>
      </div>
    </div>
  );
}

function Info({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
