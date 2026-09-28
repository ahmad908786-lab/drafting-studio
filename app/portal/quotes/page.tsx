import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, StatusBadge, EmptyState, Ref } from "@/components/dashboard/ui";
import { timeAgo } from "@/components/portal/project-card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/guards";
import { getPortalQuotes } from "@/lib/portal";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "My Quotes" };

export default async function PortalQuotesPage() {
  const user = await requireUser();
  const quotes = await getPortalQuotes(user);

  return (
    <div>
      <PageHeader
        title="My Quotes"
        description="Track your quote requests and respond to proposals."
        actions={
          <Button asChild size="sm">
            <Link href="/request-quote">
              New request <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      {quotes.length === 0 ? (
        <EmptyState
          icon="FileText"
          title="No quotes yet"
          hint="Tell us about your project and we'll price it for you."
          action={
            <Button asChild>
              <Link href="/request-quote">
                Request a quote <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {quotes.map((q) => {
            const services = (q.serviceIds as { name: string }[]) ?? [];
            const isQuoted = q.status === "QUOTED";
            return (
              <div
                key={q.id}
                className="rounded-xl border border-border bg-card p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Ref>{q.refNumber}</Ref>
                    <StatusBadge status={q.status} />
                  </div>
                  <span className="text-xs text-muted-foreground">{timeAgo(q.createdAt)}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-muted-foreground">
                      {services.map((s) => s.name).join(", ") || "Quote request"}
                    </p>
                    <p className="mt-1 font-mono text-2xl font-bold text-foreground tabular-nums">
                      {q.quotedAmount != null ? formatCurrency(q.quotedAmount) : "—"}
                    </p>
                  </div>
                  <Button asChild size="sm" variant={isQuoted ? "default" : "outline"}>
                    <Link href={`/portal/quotes/${q.id}`}>
                      {isQuoted ? (
                        <>
                          Review <ArrowRight className="size-4" />
                        </>
                      ) : (
                        "View"
                      )}
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
