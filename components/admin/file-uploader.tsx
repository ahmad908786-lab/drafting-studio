"use client";

import * as React from "react";
import { Upload, Loader2, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ALLOWED_EXT, MAX_UPLOAD_MB } from "@/lib/upload-config";

export type Uploaded = { name: string; url: string; size: number; type?: string };

export function FileUploader({
  folder = "media",
  onUploaded,
  accept,
  label = "Click to upload",
  className,
}: {
  folder?: string;
  onUploaded: (file: Uploaded) => void;
  accept?: string;
  label?: string;
  className?: string;
}) {
  const [busy, setBusy] = React.useState(false);

  const handle = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Upload failed");
        onUploaded(json);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed");
      }
    }
    setBusy(false);
  };

  return (
    <label className={cn("flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/40 p-6 text-center transition-colors hover:border-primary/40 hover:bg-secondary", className)}>
      {busy ? <Loader2 className="mb-2 size-6 animate-spin text-primary" /> : <Upload className="mb-2 size-6 text-muted-foreground" />}
      <span className="text-sm font-semibold text-foreground">{busy ? "Uploading…" : label}</span>
      <span className="mt-1 text-xs text-muted-foreground">{(accept ? accept.split(",") : ALLOWED_EXT).join(", ")} · up to {MAX_UPLOAD_MB}MB</span>
      <input type="file" multiple className="hidden" onChange={(e) => handle(e.target.files)} accept={accept ?? ALLOWED_EXT.join(",")} disabled={busy} />
    </label>
  );
}

export function FilePill({ file, onRemove }: { file: Uploaded; onRemove?: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm">
      <FileText className="size-4 text-primary" />
      <span className="flex-1 truncate font-medium text-foreground">{file.name}</span>
      <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)}MB</span>
      {onRemove && <button onClick={onRemove} aria-label="Remove" className="text-muted-foreground hover:text-destructive"><X className="size-4" /></button>}
    </div>
  );
}
