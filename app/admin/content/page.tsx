import { DashHeader } from "@/components/dashboard/ui";
import { ContentManager } from "@/components/admin/content-manager";
import { prisma } from "@/lib/db";

export const metadata = { title: "Site Content" };

export default async function AdminContentPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <DashHeader title="Content" description="Testimonials shown across the marketing site." />
      <ContentManager testimonials={testimonials} />
    </div>
  );
}
