"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, FileText, Eye, EyeOff, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploader, type Uploaded } from "@/components/admin/file-uploader";
import { addProjectUpdate, addProjectFile } from "@/app/actions/admin-projects";
import { PROJECT_STAGES } from "@/lib/taxonomy";
import { formatDate } from "@/lib/utils";

type Update = { id: string; stage: string; note: string; createdAt: Date; author: { name: string | null } | null };
type PFile = { id: string; name: string; url: string; sizeBytes: number; revision: string; visibleToClient: boolean; createdAt: Date };

export function ProjectManagement({
  projectId,
  stage,
  updates,
  files,
}: {
  projectId: string;
  stage: string;
  updates: Update[];
  files: PFile[];
}) {
  const router = useRouter();
  const [newStage, setNewStage] = React.useState(stage);
  const [note, setNote] = React.useState("");
  const [rev, setRev] = React.useState("R0");
  const [visible, setVisible] = React.useState(true);
  const [busy, setBusy] = React.useState(false);

  const postUpdate = async () => {
    setBusy(true);
    await addProjectUpdate(projectId, newStage, note);
    setNote("");
    toast.success("Update posted");
    setBusy(false);
    router.refresh();
  };
  const onUploaded = async (f: Uploaded) => {
    await addProjectFile(projectId, f, rev, visible);
    toast.success("File added");
    router.refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Updates */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="mb-4 text-sm font-bold text-foreground">Timeline & stage</h3>
        <div className="mb-4 flex flex-col gap-2 rounded-lg border border-border bg-secondary/40 p-3">
          <div className="flex gap-2">
            <Select value={newStage} onValueChange={setNewStage}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{PROJECT_STAGES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
            <Button size="sm" onClick={postUpdate} disabled={busy}><Plus className="size-4" /> Post</Button>
          </div>
          <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Update note (visible to client)…" />
        </div>
        <ol className="space-y-3">
          {updates.map((u) => (
            <li key={u.id} className="flex gap-3">
              <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{PROJECT_STAGES.find((s) => s.value === u.stage)?.label ?? u.stage}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(u.createdAt)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{u.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Files */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="mb-4 text-sm font-bold text-foreground">Deliverables & files</h3>
        <div className="mb-3 flex items-center gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Revision</Label>
            <Input value={rev} onChange={(e) => setRev(e.target.value)} className="h-9 w-20" />
          </div>
          <label className="flex items-center gap-2 pt-5 text-sm">
            <Switch checked={visible} onCheckedChange={setVisible} /> Client-visible
          </label>
        </div>
        <FileUploader folder="rfq" label="Upload deliverable" onUploaded={onUploaded} className="mb-4" />
        <ul className="space-y-2">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-2.5 rounded-lg border border-border bg-background p-2.5 text-sm">
              <FileText className="size-4 text-primary" />
              <span className="flex-1 truncate font-medium text-foreground">{f.name}</span>
              <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">{f.revision}</span>
              {f.visibleToClient ? <Eye className="size-3.5 text-success" /> : <EyeOff className="size-3.5 text-muted-foreground" />}
              <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Download className="size-4" /></a>
            </li>
          ))}
          {files.length === 0 && <li className="text-xs text-muted-foreground">No files yet.</li>}
        </ul>
      </div>
    </div>
  );
}
