"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Trash2, Check } from "lucide-react";
import { FileUploader, type Uploaded } from "@/components/admin/file-uploader";
import { saveMediaAsset, deleteMediaAsset } from "@/app/actions/admin-misc";

type Asset = { id: string; url: string; name: string; mimeType: string | null; sizeBytes: number };

export function MediaLibrary({ assets }: { assets: Asset[] }) {
  const router = useRouter();
  const [copied, setCopied] = React.useState<string | null>(null);

  const onUploaded = async (f: Uploaded) => {
    await saveMediaAsset({ url: f.url, name: f.name, type: f.type, size: f.size });
    toast.success("Uploaded");
    router.refresh();
  };
  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this asset? (The file stays on disk.)")) return;
    await deleteMediaAsset(id);
    toast.success("Removed");
    router.refresh();
  };

  const isImage = (m: string | null) => m?.startsWith("image") || false;

  return (
    <div className="space-y-6">
      <FileUploader folder="media" label="Upload media" onUploaded={onUploaded} />
      {assets.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">No media yet. Upload images to reuse across the site.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((a) => (
            <div key={a.id} className="group overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="relative aspect-square bg-secondary">
                {isImage(a.mimeType) ? (
                  <Image src={a.url} alt={a.name} fill className="object-cover" sizes="200px" />
                ) : (
                  <div className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">{a.name.split(".").pop()?.toUpperCase()}</div>
                )}
              </div>
              <div className="p-2.5">
                <p className="truncate text-xs font-medium text-foreground">{a.name}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{(a.sizeBytes / 1024).toFixed(0)}KB</span>
                  <div className="flex gap-1">
                    <button onClick={() => copy(a.url)} aria-label="Copy URL" className="text-muted-foreground hover:text-primary">{copied === a.url ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}</button>
                    <button onClick={() => remove(a.id)} aria-label="Delete" className="text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
