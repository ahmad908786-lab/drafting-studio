import Link from "next/link";
import { Building2, Users, FolderKanban, FileText } from "lucide-react";
import { DashHeader, DashEmpty } from "@/components/dashboard/ui";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminClientsPage() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { users: true, projects: true, quotes: true } }, users: { select: { name: true, email: true, role: true }, take: 4 } },
  });

  return (
    <div>
      <DashHeader title="Clients" description="Companies and their portal users, projects and quotes." />
      {companies.length === 0 ? (
        <DashEmpty label="No client companies yet" hint="Companies are created when clients register or when you convert an RFQ." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {companies.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><Building2 className="size-5" /></span>
                <div>
                  <h3 className="font-sans font-bold text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{[c.city, c.state].filter(Boolean).join(", ") || "—"} · joined {formatDate(c.createdAt)}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Stat icon={<Users className="size-4" />} value={c._count.users} label="Users" />
                <Stat icon={<FolderKanban className="size-4" />} value={c._count.projects} label="Projects" />
                <Stat icon={<FileText className="size-4" />} value={c._count.quotes} label="Quotes" />
              </div>
              {c.users.length > 0 && (
                <div className="mt-4 border-t border-border pt-3">
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Users</p>
                  <ul className="space-y-1">
                    {c.users.map((u) => (
                      <li key={u.email} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{u.name ?? u.email}</span>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">{u.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link href={`/admin/projects?view=client`} className="mt-4 inline-block text-xs font-semibold text-primary hover:underline">View projects →</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="rounded-lg bg-secondary/50 py-2">
      <div className="flex items-center justify-center gap-1 text-primary">{icon}<span className="font-sans text-lg font-extrabold text-foreground">{value}</span></div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
