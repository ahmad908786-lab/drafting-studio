"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveIndustry } from "@/app/actions/admin-misc";

export type IndustryFormData = { id: string; shortDesc: string; bodyMdx: string; painPoints: string };

export function IndustryEditor({ initial }: { initial: IndustryFormData }) {
  const router = useRouter();
  const [data, setData] = React.useState(initial);
  const [saving, setSaving] = React.useState(false);

  const save = async () => {
    setSaving(true);
    const res = await saveIndustry({
      id: data.id,
      shortDesc: data.shortDesc,
      bodyMdx: data.bodyMdx,
      painPoints: data.painPoints.split("\n").map((s) => s.trim()).filter(Boolean),
    });
    if (res.ok) { toast.success("Industry saved"); router.refresh(); }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl space-y-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="space-y-1.5"><Label>Short description</Label><Textarea rows={2} value={data.shortDesc} onChange={(e) => setData((d) => ({ ...d, shortDesc: e.target.value }))} /></div>
      <div className="space-y-1.5"><Label>Body (Markdown)</Label><Textarea rows={10} value={data.bodyMdx} onChange={(e) => setData((d) => ({ ...d, bodyMdx: e.target.value }))} className="font-mono text-[13px]" /></div>
      <div className="space-y-1.5"><Label>Pain points (one per line)</Label><Textarea rows={5} value={data.painPoints} onChange={(e) => setData((d) => ({ ...d, painPoints: e.target.value }))} /></div>
      <Button onClick={save} disabled={saving}>{saving ? <><Loader2 className="size-4 animate-spin" /> Saving…</> : <><Save className="size-4" /> Save</>}</Button>
    </div>
  );
}
