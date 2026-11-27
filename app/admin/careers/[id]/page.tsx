import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { DashHeader } from "@/components/dashboard/ui";
import { CareerEditor, type CareerFormData } from "@/components/admin/career-editor";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export const metadata = { title: "Edit Role" };

export default async function EditCareerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const career = await prisma.career.findUnique({ where: { id } });
  if (!career) notFound();

  const initial: CareerFormData = {
    id: career.id,
    title: career.title,
    type: career.type,
    tags: career.tags,
    desc: career.desc,
    order: career.order.toString(),
    published: career.published,
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm"><Link href="/admin/careers" aria-label="Back"><ArrowLeft className="size-4" /></Link></Button>
          <DashHeader title={career.title} description={career.type} />
        </div>
        <Button asChild variant="outline" size="sm"><Link href="/careers" target="_blank">View live <ExternalLink className="size-4" /></Link></Button>
      </div>
      <CareerEditor initial={initial} />
    </div>
  );
}
