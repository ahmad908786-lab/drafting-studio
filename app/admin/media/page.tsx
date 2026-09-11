import { DashHeader } from "@/components/dashboard/ui";
import { MediaLibrary } from "@/components/admin/media-library";
import { prisma } from "@/lib/db";

export default async function AdminMediaPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 60 });
  return (
    <div>
      <DashHeader title="Media" description="Upload and manage images used across the site." />
      <MediaLibrary assets={assets} />
    </div>
  );
}
