import { DashHeader, DashEmpty } from "@/components/dashboard/ui";
import { LeadRowActions } from "@/components/admin/lead-row-actions";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <DashHeader title="Leads" description="Contact, callback and newsletter submissions." />
      <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        {leads.length === 0 ? (
          <div className="p-6"><DashEmpty label="No leads yet" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="hidden md:table-cell">Message</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((l) => (
                <TableRow key={l.id}>
                  <TableCell><Badge variant="secondary">{l.type}</Badge></TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{l.name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{l.email}{l.phone ? ` · ${l.phone}` : ""}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs">
                    <p className="truncate text-sm text-muted-foreground">{l.subject ? `${l.subject}: ` : ""}{l.message ?? "—"}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{formatDate(l.createdAt)}</TableCell>
                  <TableCell><LeadRowActions id={l.id} status={l.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
