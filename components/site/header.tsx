import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { getNavData } from "@/lib/queries";
import { INDUSTRIES } from "@/lib/taxonomy";
import { brand } from "@/lib/theme";
import { HeaderNav } from "@/components/site/header-nav";
import { MobileNav } from "@/components/site/mobile-nav";
import { BookMeetingDialog } from "@/components/site/book-meeting-dialog";
import { auth } from "@/auth";

export async function SiteHeader() {
  const [nav, session] = await Promise.all([getNavData(), auth()]);
  const industries = INDUSTRIES.map((i) => ({ slug: i.slug, name: i.name, icon: i.icon }));
  const role = session?.user?.role;
  const dashHref = role === "ADMIN" || role === "STAFF" ? "/admin" : role === "CLIENT" ? "/portal" : "/login";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70">
      {/* Utility bar */}
      <div className="hidden border-b border-border/70 bg-primary text-primary-foreground lg:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <p className="font-medium text-primary-foreground/85">
            Nationwide 2D AutoCAD drafting · Fixed quotes in under 24 hours
          </p>
          <div className="flex items-center gap-5">
            <a href={`mailto:${brand.contact.email}`} className="hover:text-accent">{brand.contact.email}</a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <HeaderNav nav={nav} industries={industries} />
        <div className="flex items-center gap-1.5">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
            <Link href={dashHref}>{role ? "Dashboard" : "Log in"}</Link>
          </Button>
          <BookMeetingDialog />
          <MobileNav nav={nav} industries={industries} dashHref={dashHref} isLoggedIn={!!role} />
        </div>
      </div>
    </header>
  );
}
