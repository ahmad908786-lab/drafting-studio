import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashHeader } from "@/components/dashboard/ui";
import { CareerEditor, type CareerFormData } from "@/components/admin/career-editor";
import { Button } from "@/components/ui/button";

export const metadata = { title: "New Role" };

const initial: CareerFormData = {
  id: "",
  title: "",
  type: "Full-time · Remote",
  tags: "",
  desc: "",
  order: "0",
  published: true,
};

export default function NewCareerPage() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm"><Link href="/admin/careers" aria-label="Back"><ArrowLeft className="size-4" /></Link></Button>
          <DashHeader title="New role" description="Add a job opening to the careers page." />
        </div>
      </div>
      <CareerEditor initial={initial} />
    </div>
  );
}
