import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell";
import { requireStaff } from "@/lib/auth/guards";

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: "LayoutDashboard" },
  { href: "/admin/rfqs", label: "RFQs", icon: "Inbox" },
  { href: "/admin/projects", label: "Projects", icon: "FolderKanban" },
  { href: "/admin/blog", label: "Blog", icon: "Newspaper" },
  { href: "/admin/services", label: "Services", icon: "PenTool" },
  { href: "/admin/industries", label: "Industries", icon: "Building2" },
  { href: "/admin/leads", label: "Leads", icon: "UserPlus" },
  { href: "/admin/clients", label: "Clients", icon: "Users" },
  { href: "/admin/content", label: "Content", icon: "Quote" },
  { href: "/admin/media", label: "Media", icon: "Image" },
  { href: "/admin/settings", label: "Settings", icon: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();
  return (
    <DashboardShell nav={ADMIN_NAV} user={user} title="Admin">
      {children}
    </DashboardShell>
  );
}
