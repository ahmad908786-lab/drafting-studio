import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, EmptyState, PersonChip } from "@/components/dashboard/ui";
import { prisma } from "@/lib/db";
import { formatDate, formatCurrency, initials, cn } from "@/lib/utils";

export const metadata = { title: "Clients" };

const AVATAR_COLORS = [
  "bg-sky-500/10 text-sky-600",
  "bg-violet-500/10 text-violet-600",
  "bg-emerald-500/10 text-emerald-600",
  "bg-amber-500/10 text-amber-600",
  "bg-rose-500/10 text-rose-600",
  "bg-indigo-500/10 text-indigo-600",
];

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export default async function AdminClientsPage() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { users: true, projects: true } },
      users: { select: { name: true, email: true, image: true, role: true }, take: 4 },
      quotes: {
        where: { status: { in: ["NEW", "REVIEWING", "QUOTED"] }, quotedAmount: { not: null } },
        select: { quotedAmount: true },
      },
    },
  });

  return (
    <div>
      <PageHeader title="Clients" description="Companies and their portal users, projects and quotes." />

      {companies.length === 0 ? (
        <EmptyState icon="Building2" title="No client companies yet" hint="Companies are created when clients register or when you convert an RFQ." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((c) => {
            const pipeline = c.quotes.reduce((sum, q) => sum + (q.quotedAmount ?? 0), 0);
            const location = [c.city, c.state].filter(Boolean).join(", ");
            return (
              <div key={c.id} className="flex flex-col rounded-xl border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className={cn("grid size-11 shrink-0 place-items-center rounded-lg font-sans text-sm font-extrabold", avatarColor(c.name))}>
                    {initials(c.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-sans font-bold text-foreground">{c.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {location || "—"} · joined {formatDate(c.createdAt)}
                    </p>
                    {pipeline > 0 && (
                      <p className="mt-1 font-mono text-xs font-semibold text-foreground tabular-nums">
                        Open pipeline: {formatCurrency(pipeline)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-secondary/50 py-2.5 text-center">
                    <div className="font-mono text-lg font-bold text-foreground tabular-nums">{c._count.users}</div>
                    <div className="text-[11px] text-muted-foreground">Users</div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 py-2.5 text-center">
                    <div className="font-mono text-lg font-bold text-foreground tabular-nums">{c._count.projects}</div>
                    <div className="text-[11px] text-muted-foreground">Projects</div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 py-2.5 text-center">
                    <div className="font-mono text-lg font-bold text-foreground tabular-nums">{c.quotes.length}</div>
                    <div className="text-[11px] text-muted-foreground">Open quotes</div>
                  </div>
                </div>

                {c.users.length > 0 && (
                  <div className="mt-4 border-t border-border pt-3">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Team</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {c.users.map((u) => (
                        <PersonChip key={u.email} name={u.name} image={u.image} email={u.email} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex-1" />
                <Link
                  href="/admin/projects?view=client"
                  className="inline-flex items-center gap-1 border-t border-border pt-3 text-xs font-semibold text-primary hover:underline"
                >
                  View projects <ArrowRight className="size-3" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
