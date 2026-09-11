"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Icon } from "@/components/icon";
import { ThemeToggle } from "@/components/theme-toggle";

type NavCategory = { slug: string; name: string; icon: string; services: { slug: string; name: string }[] };
type IndustryLink = { slug: string; name: string; icon: string };

export function MobileNav({
  nav,
  industries,
  dashHref,
  isLoggedIn,
}: {
  nav: NavCategory[];
  industries: IndustryLink[];
  dashHref: string;
  isLoggedIn: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="size-5.5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] max-w-sm p-0">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-1 overflow-y-auto px-4 pb-8">
          <MLink href="/" onClick={close}>Home</MLink>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="services" className="border-none">
              <AccordionTrigger className="py-2.5 text-[15px] font-semibold hover:no-underline">Services</AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="flex flex-col gap-3">
                  {nav.map((cat) => (
                    <div key={cat.slug}>
                      <Link
                        href={`/services/${cat.slug}`}
                        onClick={close}
                        className="mb-1 flex items-center gap-2 text-[13px] font-bold text-foreground"
                      >
                        <Icon name={cat.icon} className="size-4 text-primary" /> {cat.name}
                      </Link>
                      <ul className="ml-6 flex flex-col gap-0.5 border-l border-border pl-3">
                        {cat.services.map((s) => (
                          <li key={s.slug}>
                            <Link href={`/services/${cat.slug}/${s.slug}`} onClick={close} className="block py-1 text-[13px] text-muted-foreground">
                              {s.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="industries" className="border-none">
              <AccordionTrigger className="py-2.5 text-[15px] font-semibold hover:no-underline">Industries</AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="grid grid-cols-2 gap-1">
                  {industries.map((ind) => (
                    <Link key={ind.slug} href={`/industries/${ind.slug}`} onClick={close} className="flex items-center gap-2 py-1.5 text-[13px] text-muted-foreground">
                      <Icon name={ind.icon} className="size-4 text-primary" /> {ind.name}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <MLink href="/projects" onClick={close}>Projects</MLink>

          <MLink href="/blog" onClick={close}>Blog</MLink>
          <MLink href="/about" onClick={close}>About</MLink>
          <MLink href="/contact" onClick={close}>Contact</MLink>

          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <Button asChild variant="accent" size="lg" onClick={close}>
              <Link href="/request-quote">Request a Quote <ArrowRight className="size-4" /></Link>
            </Button>
            <div className="flex items-center justify-between">
              <Button asChild variant="outline" size="sm" onClick={close}>
                <Link href={dashHref}>{isLoggedIn ? "Dashboard" : "Log in"}</Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="border-b border-border py-2.5 text-[15px] font-semibold text-foreground">
      {children}
    </Link>
  );
}
