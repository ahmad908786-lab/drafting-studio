import Link from "next/link";
import Image from "next/image";
import { Plus, ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { DashHeader, StageBadge, DashEmpty } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { formatDate, cn } from "@/lib/utils";

type SP = Record<string, string | string[] | undefined>;

export default async function AdminProjectsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const view = sp.view === "client" ? "client" : sp.view === "public" ? "public" : "all";
  const where = view === "client" ? { isPublic: false } : view === "public" ? { isPublic: true } : {};

  const [projects, pubCount, clientCount] = await Promise.all([
    prisma.project.findMany({ where, orderBy: [{ isPublic: "desc" }, { order: "asc" }, { createdAt: "desc" }], include: { industry: true, company: true, disciplines: true } }),
    prisma.project.count({ where: { isPublic: true } }),
    prisma.project.count({ where: { isPublic: false } }),
  ]);

  return (
    <div>
      <DashHeader title="Projects" description="Public sample work and private client projects.">
        <Button asChild size="sm"><Link href="/admin/projects/new"><Plus className="size-4" /> New project</Link></Button>
      </DashHeader>

      <div className="mb-5 flex gap-1.5">
        <Tab label="All" href="/admin/projects" count={pubCount + clientCount} active={view === "all"} />
        <Tab label="Sample work" href="/admin/projects?view=public" count={pubCount} active={view === "public"} />
        <Tab label="Client projects" href="/admin/projects?view=client" count={clientCount} active={view === "client"} />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        {projects.length === 0 ? (
          <div className="p-6"><DashEmpty label="No projects" hint="Create your first project." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead className="hidden md:table-cell">Industry</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden lg:table-cell">Stage / Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-primary">
                        {p.coverImage && <Image src={p.coverImage} alt="" fill className="object-cover" sizes="40px" />}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-foreground">{p.title}</div>
                        <div className="text-xs text-muted-foreground">{p.company?.name ?? (p.city ? `${p.city}, ${p.state}` : "Sample")}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{p.industry?.name ?? "—"}</TableCell>
                  <TableCell>
                    {p.isPublic ? (
                      <Badge variant="info" className="gap-1"><Eye className="size-3" /> Public</Badge>
                    ) : (
                      <Badge variant="muted" className="gap-1"><EyeOff className="size-3" /> Client</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {p.isPublic ? (p.featured ? <Badge variant="accent">Featured</Badge> : <span className="text-xs text-muted-foreground">—</span>) : <StageBadge stage={p.stage} />}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="icon-sm"><Link href={`/admin/projects/${p.id}`} aria-label="Edit"><ArrowUpRight className="size-4" /></Link></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function Tab({ label, href, count, active }: { label: string; href: string; count: number; active: boolean }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-secondary")}>
      {label} <span className={cn("rounded-full px-1.5", active ? "bg-white/20" : "bg-muted text-muted-foreground")}>{count}</span>
    </Link>
  );
}
