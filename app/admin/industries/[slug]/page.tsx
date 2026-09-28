import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { DashHeader } from "@/components/dashboard/ui";
import { IndustryEditor, type IndustryFormData } from "@/components/admin/industry-editor";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export const metadata = { title: "Edit Industry" };

export default async function EditIndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = await prisma.industry.findUnique({ where: { slug } });
  if (!ind) notFound();

  const initial: IndustryFormData = {
    id: ind.id,
    shortDesc: ind.shortDesc,
    bodyMdx: ind.bodyMdx,
    painPoints: ((ind.painPoints as string[]) ?? []).join("\n"),
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm"><Link href="/admin/industries" aria-label="Back"><ArrowLeft className="size-4" /></Link></Button>
          <DashHeader title={`${ind.name} industry`} />
        </div>
        <Button asChild variant="outline" size="sm"><Link href={`/industries/${ind.slug}`} target="_blank">View live <ExternalLink className="size-4" /></Link></Button>
      </div>
      <IndustryEditor initial={initial} />
    </div>
  );
}
