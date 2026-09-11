import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell";
import { requireUser } from "@/lib/auth/guards";

const PORTAL_NAV: NavItem[] = [
  { href: "/portal", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/portal/quotes", label: "My Quotes", icon: "FileText" },
  { href: "/portal/projects", label: "My Projects", icon: "FolderKanban" },
  { href: "/portal/files", label: "Files", icon: "FolderOpen" },
  { href: "/portal/profile", label: "Profile", icon: "UserCircle" },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/portal");
  // Staff and admins have no company, so this portal reads empty for them.
  // Give them a way back to the dashboard that actually holds their data.
  const nav =
    user.role === "ADMIN" || user.role === "STAFF"
      ? [...PORTAL_NAV, { href: "/admin", label: "Admin Dashboard", icon: "Shield" } as NavItem]
      : PORTAL_NAV;

  return (
    <DashboardShell nav={nav} user={user} title="Portal">
      {children}
    </DashboardShell>
  );
}
