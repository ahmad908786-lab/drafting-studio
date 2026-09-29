import { DashboardShell, type NavGroup } from "@/components/dashboard/dashboard-shell";
import { requireStaff } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();
  const newRfqCount = await prisma.quote.count({ where: { status: "NEW" } });

  const nav: NavGroup[] = [
    { items: [{ href: "/admin", label: "Overview", icon: "LayoutDashboard" }] },
    {
      label: "Operate",
      items: [
        { href: "/admin/rfqs", label: "RFQs", icon: "Inbox", badge: newRfqCount },
        { href: "/admin/projects", label: "Projects", icon: "FolderKanban" },
      ],
    },
    {
      label: "Manage",
      items: [
        { href: "/admin/clients", label: "Clients", icon: "Users" },
        { href: "/admin/leads", label: "Leads", icon: "UserPlus" },
        { href: "/admin/blog", label: "Blog", icon: "Newspaper" },
        { href: "/admin/services", label: "Services", icon: "PenTool" },
        { href: "/admin/industries", label: "Industries", icon: "Building2" },
      ],
    },
    {
      label: "System",
      items: [
        { href: "/admin/content", label: "Content", icon: "Quote" },
        { href: "/admin/media", label: "Media", icon: "Image" },
        { href: "/admin/settings", label: "Settings", icon: "Settings" },
      ],
    },
  ];

  return (
    <DashboardShell
      nav={nav}
      user={user}
      title="Admin"
      variant="admin"
      alertCount={newRfqCount}
      alertHref="/admin/rfqs"
    >
      {children}
    </DashboardShell>
  );
}
