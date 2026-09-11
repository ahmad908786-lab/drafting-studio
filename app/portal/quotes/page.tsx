import Link from "next/link";
import { ArrowRight, Paperclip } from "lucide-react";
import { DashHeader, StatusBadge, DashEmpty } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { requireUser } from "@/lib/auth/guards";
import { getPortalQuotes } from "@/lib/portal";
import { formatDate, formatCurrency } from "@/lib/utils";

export default async function PortalQuotesPage() {
  const user = await requireUser();
  const quotes = await getPortalQuotes(user);

  return (
    <div>
      <DashHeader title="My Quotes" description="Track your quote requests and respond to proposals.">
        <Button asChild size="sm"><Link href="/request-quote">New request <ArrowRight className="size-4" /></Link></Button>
      </DashHeader>

      {quotes.length === 0 ? (
        <DashEmpty label="No quotes yet" hint="Request a quote to get started." />
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref</TableHead>
                <TableHead className="hidden sm:table-cell">Services</TableHead>
                <TableHead>Quoted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((q) => {
                const services = (q.serviceIds as { name: string }[]) ?? [];
                return (
                  <TableRow key={q.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">{q.refNumber}{q._count.files > 0 && <Paperclip className="size-3" />}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{services.slice(0, 2).map((s) => s.name).join(", ")}{services.length > 2 ? ` +${services.length - 2}` : ""}</TableCell>
                    <TableCell className="font-mono text-sm">{q.quotedAmount != null ? formatCurrency(q.quotedAmount) : "—"}</TableCell>
                    <TableCell><StatusBadge status={q.status} /></TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(q.createdAt)}</TableCell>
                    <TableCell><Button asChild variant="ghost" size="sm"><Link href={`/portal/quotes/${q.id}`}>View</Link></Button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
