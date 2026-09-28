import { Building2, Users, Mail, Phone } from "lucide-react";
import { PageHeader, Panel, KpiCard } from "@/components/dashboard/ui";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth/guards";
import { getPortalProjects, getPortalQuotes, getPortalFiles } from "@/lib/portal";
import { prisma } from "@/lib/db";
import { initials } from "@/lib/utils";

export const metadata = { title: "Profile Settings" };

export default async function PortalProfilePage() {
  const user = await requireUser();
  const [dbUser, company, projects, quotes, files] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id } }),
    user.companyId ? prisma.company.findUnique({ where: { id: user.companyId }, include: { users: true } }) : null,
    getPortalProjects(user),
    getPortalQuotes(user),
    getPortalFiles(user),
  ]);

  return (
    <div>
      <PageHeader title="Profile" description="Your account and company details." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Your account">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              {dbUser?.image && <AvatarImage src={dbUser.image} alt={dbUser.name ?? ""} />}
              <AvatarFallback className="text-lg">{initials(dbUser?.name ?? user.email ?? "U")}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-sans text-lg font-bold text-foreground">{dbUser?.name ?? "—"}</div>
              {dbUser?.title && <div className="text-sm text-muted-foreground">{dbUser.title}</div>}
              <Badge variant="secondary" className="mt-1">{user.role}</Badge>
            </div>
          </div>
          <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
            <div className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-foreground">{dbUser?.email}</span>
            </div>
            {dbUser?.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-foreground">{dbUser.phone}</span>
              </div>
            )}
            {company && (
              <div className="flex items-center gap-2.5">
                <Building2 className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-foreground">{company.name}</span>
              </div>
            )}
          </dl>
          <p className="mt-5 rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
            To update your account details or password, contact your drafting team — self-service editing is coming soon.
          </p>
        </Panel>

        {company && (
          <Panel title="Company">
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="size-6" />
              </span>
              <div>
                <div className="font-sans font-bold text-foreground">{company.name}</div>
                <div className="text-xs text-muted-foreground">
                  {[company.city, company.state].filter(Boolean).join(", ") || "—"}
                </div>
              </div>
            </div>
            <div className="mt-5 border-t border-border pt-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <Users className="size-3.5" /> Team ({company.users.length})
              </p>
              <ul className="space-y-1.5">
                {company.users.map((u) => (
                  <li key={u.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate text-foreground">{u.name ?? u.email}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{u.email}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        )}
      </div>

      <div className="mt-6">
        <h3 className="mb-3 font-sans text-base font-bold text-foreground">Your activity</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <KpiCard label="Projects" value={projects.length} icon="FolderKanban" href="/portal/projects" />
          <KpiCard label="Quotes" value={quotes.length} icon="FileText" href="/portal/quotes" />
          <KpiCard label="Files" value={files.length} icon="FolderOpen" href="/portal/files" />
        </div>
      </div>
    </div>
  );
}
