"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, ExternalLink } from "lucide-react";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, initials } from "@/lib/utils";
import { signOutAction } from "@/app/actions/auth";

export type NavItem = { href: string; label: string; icon: string };

export function DashboardShell({
  nav,
  user,
  title,
  children,
}: {
  nav: NavItem[];
  user: { name?: string | null; email?: string | null; image?: string | null; role: string };
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const isActive = (href: string) =>
    href === nav[0].href ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo showText={false} />
        <span className="ml-2.5 font-sans text-sm font-extrabold text-foreground">Drafting Studio</span>
        <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">{title}</span>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon name={item.icon} className="size-4.5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border p-3">
        <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <ExternalLink className="size-4.5" /> View site
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-border bg-card lg:block">{SidebarContent}</aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-card shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 z-10 text-muted-foreground" aria-label="Close menu"><X className="size-5" /></button>
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/90 px-4 backdrop-blur-lg sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="size-5" /></Button>
            <h1 className="font-sans text-lg font-bold text-foreground">{title === "Admin" ? "Admin Dashboard" : "Client Portal"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden items-center gap-2.5 rounded-full border border-border bg-background py-1 pl-1 pr-3 sm:flex">
              <Avatar className="size-7">
                {user.image && <AvatarImage src={user.image} alt={user.name ?? ""} />}
                <AvatarFallback>{initials(user.name ?? user.email ?? "U")}</AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <div className="text-xs font-semibold text-foreground">{user.name ?? user.email}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{user.role}</div>
              </div>
            </div>
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="icon-sm" aria-label="Sign out"><LogOut className="size-4.5" /></Button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
