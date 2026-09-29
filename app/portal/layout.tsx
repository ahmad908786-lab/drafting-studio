import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell";
import { requireUser } from "@/lib/auth/guards";
import { getPortalOverview } from "@/lib/portal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/portal");
  const { projects, quotes } = await getPortalOverview(user);

  // Badges: quotes the client still needs to act on (QUOTED = proposal waiting).
  const quotedCount = quotes.filter((q) => q.status === "QUOTED").length;
  const revisionCount = projects.filter((p) => p.stage === "REVISIONS").length;
  const attention = quotedCount + revisionCount;

  const nav: NavItem[] = [
    { href: "/portal", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/portal/quotes", label: "My Quotes", icon: "FileText", badge: quotedCount },
    { href: "/portal/projects", label: "My Projects", icon: "FolderKanban" },
    { href: "/portal/files", label: "Files", icon: "FolderOpen" },
    { href: "/portal/profile", label: "Profile", icon: "UserCircle" },
  ];
  // Staff and admins have no company, so this portal reads empty for them.
  // Give them a way back to the dashboard that actually holds their data.
  const finalNav: NavItem[] =
    user.role === "ADMIN" || user.role === "STAFF"
      ? [...nav, { href: "/admin", label: "Admin Dashboard", icon: "Shield" }]
      : nav;

  return (
    <DashboardShell nav={finalNav} user={user} title="Portal" variant="portal" alertCount={attention} alertHref="/portal">
      {children}
    </DashboardShell>
  );
}
