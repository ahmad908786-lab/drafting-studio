import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DashHeader } from "@/components/dashboard/ui";
import { Icon } from "@/components/icon";
import { prisma } from "@/lib/db";

export const metadata = { title: "Industries" };

export default async function AdminIndustriesPage() {
  const industries = await prisma.industry.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { projects: true } } } });
  return (
    <div>
      <DashHeader title="Industries" description="Edit copy and pain points for all 12 industry pages." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((i) => (
          <Link key={i.id} href={`/admin/industries/${i.slug}`} className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-colors hover:border-primary/40">
            <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><Icon name={i.icon} className="size-5" /></span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-foreground group-hover:text-primary">{i.name}</div>
              <div className="text-xs text-muted-foreground">{i._count.projects} projects</div>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
