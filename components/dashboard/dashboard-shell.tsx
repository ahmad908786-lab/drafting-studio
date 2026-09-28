"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, ExternalLink, Bell } from "lucide-react";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, initials } from "@/lib/utils";
import { signOutAction } from "@/app/actions/auth";

export type NavItem = { href: string; label: string; icon: string; badge?: number };
export type NavGroup = { label?: string; items: NavItem[] };

export function DashboardShell({
  nav,
  user,
  title,
  variant = "admin",
  alertCount = 0,
  alertHref,
  children,
}: {
  nav: NavItem[] | NavGroup[];
  user: { name?: string | null; email?: string | null; image?: string | null; role: string };
  title: string;
  variant?: "admin" | "portal";
  alertCount?: number;
  alertHref?: string;
  children: React.ReactNode;
}) {
  if (variant === "portal") {
    const items = (nav as NavItem[]).filter((i) => "href" in i);
    return <PortalShell nav={items} user={user} title={title} alertCount={alertCount} alertHref={alertHref}>{children}</PortalShell>;
  }
  const groups: NavGroup[] = Array.isArray(nav) && nav.length > 0 && "items" in (nav[0] as object)
    ? (nav as NavGroup[])
    : [{ items: nav as NavItem[] }];
  return <AdminShell groups={groups} user={user} title={title} alertCount={alertCount} alertHref={alertHref}>{children}</AdminShell>;
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                          */
/* ------------------------------------------------------------------ */

function isActive(pathname: string, href: string, firstHref: string) {
  return href === firstHref ? pathname === href : pathname === href || pathname.startsWith(href + "/");
}

function UserBlock({ user, dark }: { user: { name?: string | null; email?: string | null; image?: string | null; role: string }; dark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", dark ? "text-white" : "text-foreground")}>
      <Avatar className="size-8">
        {user.image && <AvatarImage src={user.image} alt={user.name ?? ""} />}
        <AvatarFallback className={dark ? "bg-white/10 text-white" : undefined}>{initials(user.name ?? user.email ?? "U")}</AvatarFallback>
      </Avatar>
      <div className="leading-tight">
        <div className="max-w-32 truncate text-[13px] font-semibold">{user.name ?? user.email}</div>
        <div className={cn("text-[10px] font-semibold uppercase tracking-wider", dark ? "text-white/50" : "text-muted-foreground")}>{user.role}</div>
      </div>
    </div>
  );
}

function AlertBell({ count, href }: { count: number; href?: string }) {
  if (!href || count <= 0) return null;
  return (
    <Button asChild variant="ghost" size="icon-sm" className="relative" aria-label={`${count} new items need attention`}>
      <Link href={href}>
        <Bell className="size-4.5" />
        <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-destructive font-mono text-[10px] font-bold text-white tabular-nums">
          {count > 9 ? "9+" : count}
        </span>
      </Link>
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/* Admin: dark sidebar + topbar                                         */
/* ------------------------------------------------------------------ */

function AdminShell({
  groups,
  user,
  title,
  alertCount,
  alertHref,
  children,
}: {
  groups: NavGroup[];
  user: { name?: string | null; email?: string | null; image?: string | null; role: string };
  title: string;
  alertCount: number;
  alertHref?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const firstHref = groups[0]?.items[0]?.href ?? "/admin";

  const SidebarContent = (
    <div className="flex h-full flex-col bg-[#0b1e3f] text-white">
      <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-5">
        <Logo showText={false} />
        <span className="ml-2.5 font-sans text-sm font-extrabold tracking-tight">Drafting Studio</span>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groups.map((g, gi) => (
          <div key={gi}>
            {g.label && (
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">{g.label}</p>
            )}
            <div className="space-y-0.5">
              {g.items.map((item) => {
                const active = isActive(pathname, item.href, firstHref);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
                      active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <Icon name={item.icon} className="size-4.5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge != null && item.badge > 0 && (
                      <span className="grid min-w-5 place-items-center rounded-full bg-amber-400 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#0b1e3f] tabular-nums">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <UserBlock user={user} dark />
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="icon-sm" aria-label="Sign out" className="text-white/60 hover:bg-white/10 hover:text-white">
              <LogOut className="size-4" />
            </Button>
          </form>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-4" /> View website
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{SidebarContent}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 shadow-2xl">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 z-10 text-white/70" aria-label="Close menu">
              <X className="size-5" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-lg sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
            <h1 className="font-sans text-[17px] font-bold tracking-tight text-foreground">{title}</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertBell count={alertCount} href={alertHref} />
            <ThemeToggle />
            <div className="ml-1 hidden sm:block">
              <UserBlock user={user} />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Portal: top nav, banking-app style                                    */
/* ------------------------------------------------------------------ */

function PortalShell({
  nav,
  user,
  title,
  alertCount,
  alertHref,
  children,
}: {
  nav: NavItem[];
  user: { name?: string | null; email?: string | null; image?: string | null; role: string };
  title: string;
  alertCount: number;
  alertHref?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const firstHref = nav[0]?.href ?? "/portal";

  return (
    <div className="flex min-h-screen flex-col bg-secondary/40">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-lg">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/portal" className="flex items-center gap-2.5">
              <Logo showText={false} />
              <span className="font-sans text-[15px] font-extrabold tracking-tight text-foreground">Drafting Studio</span>
              <span className="hidden rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary sm:inline">Client</span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((item) => {
                const active = isActive(pathname, item.href, firstHref);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative rounded-lg px-3.5 py-2 text-[13.5px] font-semibold transition-colors",
                      active ? "text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {item.label}
                    {active && <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-primary" />}
                    {item.badge != null && item.badge > 0 && (
                      <span className="ml-1.5 inline-grid min-w-5 place-items-center rounded-full bg-destructive px-1 py-px align-middle font-mono text-[10px] font-bold text-white tabular-nums">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertBell count={alertCount} href={alertHref} />
            <ThemeToggle />
            <div className="ml-1 hidden sm:block">
              <UserBlock user={user} />
            </div>
            <form action={signOutAction} className="hidden sm:block">
              <Button type="submit" variant="ghost" size="icon-sm" aria-label="Sign out">
                <LogOut className="size-4" />
              </Button>
            </form>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-border px-4 py-2 md:hidden">
            {nav.map((item) => {
              const active = isActive(pathname, item.href, firstHref);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold",
                    active ? "bg-secondary text-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon name={item.icon} className="size-4.5" />
                  {item.label}
                  {item.badge != null && item.badge > 0 && (
                    <span className="ml-auto grid min-w-5 place-items-center rounded-full bg-destructive px-1.5 py-0.5 font-mono text-[10px] font-bold text-white tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <form action={signOutAction} className="mt-1 border-t border-border pt-2">
              <Button type="submit" variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                <LogOut className="size-4" /> Sign out
              </Button>
            </form>
          </nav>
        )}
      </header>
      <main className="mx-auto w-full max-w-[1200px] flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      <footer className="border-t border-border py-5">
        <p className="text-center text-xs text-muted-foreground">
          {title} · Need help? <Link href="/contact" className="font-semibold text-primary hover:underline">Contact the studio</Link>
        </p>
      </footer>
    </div>
  );
}
