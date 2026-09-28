import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { DashHeader } from "@/components/dashboard/ui";
import { ServiceEditor, type ServiceFormData } from "@/components/admin/service-editor";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export const metadata = { title: "Edit Service" };

export default async function EditServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug }, include: { category: true } });
  if (!service) notFound();

  const initial: ServiceFormData = {
    id: service.id,
    name: service.name,
    shortDesc: service.shortDesc,
    heroCopy: service.heroCopy,
    bodyMdx: service.bodyMdx,
    turnaroundDays: service.turnaroundDays.toString(),
    startingPrice: service.startingPrice?.toString() ?? "",
    priceNote: service.priceNote ?? "",
    published: service.published,
    deliverables: ((service.deliverables as string[]) ?? []).join("\n"),
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm"><Link href="/admin/services" aria-label="Back"><ArrowLeft className="size-4" /></Link></Button>
          <DashHeader title={service.name} description={service.category.name} />
        </div>
        <Button asChild variant="outline" size="sm"><Link href={`/services/${service.category.slug}/${service.slug}`} target="_blank">View live <ExternalLink className="size-4" /></Link></Button>
      </div>
      <ServiceEditor initial={initial} />
    </div>
  );
}
