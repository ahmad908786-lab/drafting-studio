import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DashHeader } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: [{ category: { order: "asc" } }, { order: "asc" }], include: { category: true } });
  return (
    <div>
      <DashHeader title="Services" description="Edit copy, deliverables, pricing and turnaround for all 13 services." />
      <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Turnaround</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-foreground">{s.name}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{s.category.name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{s.turnaroundDays} days</TableCell>
                <TableCell className="font-mono text-sm">{s.startingPrice != null ? formatCurrency(s.startingPrice) : "—"}</TableCell>
                <TableCell><Badge variant={s.published ? "success" : "muted"}>{s.published ? "Published" : "Hidden"}</Badge></TableCell>
                <TableCell><Button asChild variant="ghost" size="icon-sm"><Link href={`/admin/services/${s.slug}`} aria-label="Edit"><ArrowUpRight className="size-4" /></Link></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
