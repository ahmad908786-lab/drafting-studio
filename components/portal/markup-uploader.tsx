"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileUploader, type Uploaded } from "@/components/admin/file-uploader";
import { uploadProjectMarkup } from "@/app/actions/portal";

export function MarkupUploader({ projectId }: { projectId: string }) {
  const router = useRouter();
  const onUploaded = async (f: Uploaded) => {
    await uploadProjectMarkup(projectId, f);
    toast.success("Markup uploaded — your team has been notified");
    router.refresh();
  };
  return <FileUploader folder="rfq" label="Upload a markup or reference" onUploaded={onUploaded} />;
}
