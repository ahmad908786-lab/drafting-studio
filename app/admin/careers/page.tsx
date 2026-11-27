import Link from "next/link";
import { Plus, ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { prisma } from "@/lib/db";

export const metadata = { title: "Careers" };

function timeAgo(d: Date | string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function AdminCareersPage() {
  const careers = await prisma.career.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <PageHeader
        title="Careers"
        description="Job openings shown on the public careers page."
        actions={
          <Button asChild size="sm"><Link href="/admin/careers/new"><Plus className="size-4" /> New role</Link></Button>
        }
      />

      <Panel padded={false}>
        {careers.length === 0 ? (
          <div className="p-6"><EmptyState icon="Briefcase" title="No roles yet" hint="Create your first role to get started." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Updated</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {careers.map((c) => (
                <TableRow key={c.id} className="transition-colors hover:bg-secondary/40">
                  <TableCell className="py-2.5">
                    <Link href={`/admin/careers/${c.id}`} className="truncate font-medium text-foreground hover:underline">{c.title}</Link>
                    <div className="truncate text-xs text-muted-foreground">{c.desc}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.type}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                        <Badge key={t} variant="secondary">{t}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {c.published ? (
                      <Badge variant="info" className="gap-1"><Eye className="size-3" /> Published</Badge>
                    ) : (
                      <Badge variant="muted" className="gap-1"><EyeOff className="size-3" /> Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">{timeAgo(c.updatedAt)}</TableCell>
                  <TableCell>
                    <Link href={`/admin/careers/${c.id}`} aria-label={`Open ${c.title}`} className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Panel>
    </div>
  );
}
