import Link from "next/link";
import Image from "next/image";
import { Plus, Search, ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { PageHeader, Panel, StageBadge, MiniProgress, EmptyState, Ref } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { formatDate, cn } from "@/lib/utils";
import { PROJECT_STAGES } from "@/lib/taxonomy";

export const metadata = { title: "Projects" };

type SP = Record<string, string | string[] | undefined>;

function timeAgo(d: Date | string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function progressFor(stage: string): number {
  return PROJECT_STAGES.find((s) => s.value === stage)?.pct ?? 0;
}

export default async function AdminProjectsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const view = sp.view === "client" ? "client" : sp.view === "public" ? "public" : "all";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  const where = {
    ...(view === "client" ? { isPublic: false } : view === "public" ? { isPublic: true } : {}),
    ...(q
      ? { OR: [{ title: { contains: q } }, { company: { name: { contains: q } } }, { city: { contains: q } }] }
      : {}),
  };

  const [projects, pubCount, clientCount] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: [{ isPublic: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      include: { company: true },
    }),
    prisma.project.count({ where: { isPublic: true } }),
    prisma.project.count({ where: { isPublic: false } }),
  ]);

  const tabHref = (v: string) => `/admin/projects${v === "all" ? "" : `?view=${v}`}${q ? `${v === "all" ? "?" : "&"}q=${encodeURIComponent(q)}` : ""}`;

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Public sample work and private client projects."
        actions={
          <Button asChild size="sm"><Link href="/admin/projects/new"><Plus className="size-4" /> New project</Link></Button>
        }
      />

      {/* Segmented control + search */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit items-center gap-0.5 rounded-full border border-border bg-card p-1">
          <Segment label="All" href={tabHref("all")} count={pubCount + clientCount} active={view === "all"} />
          <Segment label="Sample work" href={tabHref("public")} count={pubCount} active={view === "public"} />
          <Segment label="Client projects" href={tabHref("client")} count={clientCount} active={view === "client"} />
        </div>
        <form className="relative w-full sm:w-64" action="/admin/projects" method="get">
          {view !== "all" && <input type="hidden" name="view" value={view} />}
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Search title, client, city…" className="pl-9" />
        </form>
      </div>

      <Panel padded={false}>
        {projects.length === 0 ? (
          <div className="p-6"><EmptyState icon="FolderKanban" title="No projects found" hint={q ? "Try a different search." : "Create your first project to get started."} /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Stage</TableHead>
                <TableHead className="hidden lg:table-cell">Progress</TableHead>
                <TableHead className="hidden sm:table-cell">Due</TableHead>
                <TableHead className="hidden sm:table-cell">Updated</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id} className="transition-colors hover:bg-secondary/40">
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                        {p.coverImage && <Image src={p.coverImage} alt="" fill className="object-cover" sizes="40px" />}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/projects/${p.id}`} className="truncate font-medium text-foreground hover:underline">{p.title}</Link>
                        <div className="truncate text-xs text-muted-foreground">
                          {p.company?.name ?? (p.city ? `${p.city}, ${p.state}` : "Sample")} · <Ref className="text-[11px]">{p.slug}</Ref>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {p.isPublic ? (
                      <Badge variant="info" className="gap-1"><Eye className="size-3" /> Public</Badge>
                    ) : (
                      <Badge variant="muted" className="gap-1"><EyeOff className="size-3" /> Client</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {p.isPublic ? (
                      p.featured ? <Badge variant="accent">Featured</Badge> : <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <StageBadge stage={p.stage} />
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {p.isPublic ? <span className="text-xs text-muted-foreground">—</span> : <MiniProgress value={progressFor(p.stage)} />}
                  </TableCell>
                  <TableCell className="hidden font-mono text-xs text-muted-foreground tabular-nums sm:table-cell">
                    {p.isPublic ? "—" : p.dueDate ? formatDate(p.dueDate) : "—"}
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">{timeAgo(p.updatedAt)}</TableCell>
                  <TableCell>
                    <Link href={`/admin/projects/${p.id}`} aria-label={`Open ${p.title}`} className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
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

function Segment({ label, href, count, active }: { label: string; href: string; count: number; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      <span className={cn("rounded-full px-1.5 font-mono tabular-nums", active ? "bg-white/20" : "bg-secondary text-muted-foreground")}>{count}</span>
    </Link>
  );
}
