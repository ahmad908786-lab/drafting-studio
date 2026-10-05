import { DashboardShell, type NavGroup } from "@/components/dashboard/dashboard-shell";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { getCurrentUser, isStaff } from "@/lib/auth/guards";
import { signOutAction } from "@/app/actions/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // Not signed in → show the admin email+password login right here at /admin.
  if (!user) {
    return <AdminLoginForm />;
  }

  // Signed in but not staff → access denied with a way to sign out.
  if (!isStaff(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-12">
        <Card className="w-full max-w-md p-8 text-center">
          <ShieldAlert className="mx-auto size-10 text-destructive" />
          <h1 className="mt-4 font-sans text-xl font-extrabold text-foreground">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This area is for Drafting Studio administrators only.
          </p>
          <form action={signOutAction} className="mt-6">
            <Button type="submit" variant="outline" className="w-full">
              Sign out
            </Button>
          </form>
        </Card>
      </div>
    );
  }

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
      alertCount={newRfqCount}
      alertHref="/admin/rfqs"
    >
      {children}
    </DashboardShell>
  );
}
