import { PageHeader, Panel } from "@/components/dashboard/ui";
import { prisma } from "@/lib/db";
import { NewQuoteForm } from "@/components/admin/new-quote-form";

export const metadata = { title: "New Quote" };

export default async function AdminNewQuotePage() {
  const services = await prisma.service.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  return (
    <div>
      <PageHeader title="New quote" description="Manually log a quote request — e.g. from a phone call or email." />
      <Panel>
        <NewQuoteForm services={services} />
      </Panel>
    </div>
  );
}
