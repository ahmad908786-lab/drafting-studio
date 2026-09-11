"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

type NavCategory = {
  slug: string;
  name: string;
  icon: string;
  blurb: string | null;
  services: { slug: string; name: string; shortDesc: string }[];
};
type IndustryLink = { slug: string; name: string; icon: string };

export function HeaderNav({ nav, industries }: { nav: NavCategory[]; industries: IndustryLink[] }) {
  const [open, setOpen] = React.useState<string | null>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const enter = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(key);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };
  /* Hover alone leaves the menu unreachable by click, keyboard and touch. */
  const toggle = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen((cur) => (cur === key ? null : key));
  };
  const close = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(null);
  };

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
      <NavLink href="/">Home</NavLink>

      {/* Services mega-menu */}
      <div className="relative" onMouseEnter={() => enter("services")} onMouseLeave={leave}>
        <button
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground",
            open === "services" && "text-foreground",
          )}
          aria-expanded={open === "services"}
          aria-haspopup="true"
          type="button"
          onClick={() => toggle("services")}
        >
          Services <ChevronDown className={cn("size-4 transition-transform", open === "services" && "rotate-180")} />
        </button>
        {open === "services" && (
          <div className="absolute left-1/2 top-full z-50 w-[min(60rem,90vw)] -translate-x-1/2 pt-2">
            <div className="grid grid-cols-4 gap-1 rounded-xl border border-border bg-popover p-3 shadow-xl">
              {nav.map((cat) => (
                <div key={cat.slug} className="flex flex-col rounded-lg p-2">
                  <Link
                    href={`/services/${cat.slug}`}
                    onClick={close}
                    className="mb-1.5 flex items-center gap-2 border-b border-border pb-2 text-[13px] font-bold text-foreground hover:text-primary"
                  >
                    <span className="grid size-7 place-items-center rounded-md bg-primary/10 text-primary">
                      <Icon name={cat.icon} className="size-4" />
                    </span>
                    {cat.name}
                  </Link>
                  <ul className="flex flex-col gap-0.5">
                    {cat.services.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${cat.slug}/${s.slug}`}
                          onClick={close}
                          className="block rounded-md px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="col-span-4 mt-1 flex items-center justify-between rounded-lg bg-secondary px-4 py-2.5">
                <span className="text-[13px] font-medium text-secondary-foreground">
                  2D AutoCAD only — permit-ready DWG &amp; PDF sets, delivered fast.
                </span>
                <Link href="/services" onClick={close} className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline">
                  All services <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Industries dropdown */}
      <div className="relative" onMouseEnter={() => enter("industries")} onMouseLeave={leave}>
        <button
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground",
            open === "industries" && "text-foreground",
          )}
          aria-expanded={open === "industries"}
          aria-haspopup="true"
          type="button"
          onClick={() => toggle("industries")}
        >
          Industries <ChevronDown className={cn("size-4 transition-transform", open === "industries" && "rotate-180")} />
        </button>
        {open === "industries" && (
          <div className="absolute left-1/2 top-full z-50 w-[min(38rem,90vw)] -translate-x-1/2 pt-2">
            <div className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-popover p-3 shadow-xl">
              {industries.map((ind) => (
                <Link
                  key={ind.slug}
                  href={`/industries/${ind.slug}`}
                  onClick={close}
                  className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Icon name={ind.icon} className="size-4 text-primary" />
                  {ind.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <NavLink href="/projects">Projects</NavLink>
      <NavLink href="/blog">Blog</NavLink>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/contact">Contact</NavLink>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}
