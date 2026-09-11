"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { saveService } from "@/app/actions/admin-misc";

export type ServiceFormData = {
  id: string;
  name: string;
  shortDesc: string;
  heroCopy: string;
  bodyMdx: string;
  turnaroundDays: string;
  startingPrice: string;
  priceNote: string;
  published: boolean;
  deliverables: string;
};

export function ServiceEditor({ initial }: { initial: ServiceFormData }) {
  const router = useRouter();
  const [data, setData] = React.useState(initial);
  const [saving, setSaving] = React.useState(false);
  const set = <K extends keyof ServiceFormData>(k: K, v: ServiceFormData[K]) => setData((d) => ({ ...d, [k]: v }));

  const save = async () => {
    setSaving(true);
    const res = await saveService({
      id: data.id,
      shortDesc: data.shortDesc,
      heroCopy: data.heroCopy,
      bodyMdx: data.bodyMdx,
      turnaroundDays: Number(data.turnaroundDays) || 5,
      startingPrice: data.startingPrice ? Number(data.startingPrice) : null,
      priceNote: data.priceNote,
      published: data.published,
      deliverables: data.deliverables.split("\n").map((s) => s.trim()).filter(Boolean),
    });
    if (res.ok) { toast.success("Service saved"); router.refresh(); }
    setSaving(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <Field label="Short description"><Textarea rows={2} value={data.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} /></Field>
        <Field label="Hero copy"><Textarea rows={3} value={data.heroCopy} onChange={(e) => set("heroCopy", e.target.value)} /></Field>
        <Field label="Deliverables (one per line)"><Textarea rows={8} value={data.deliverables} onChange={(e) => set("deliverables", e.target.value)} className="font-mono text-[13px]" /></Field>
        <Field label="Body (Markdown)"><Textarea rows={10} value={data.bodyMdx} onChange={(e) => set("bodyMdx", e.target.value)} className="font-mono text-[13px]" /></Field>
      </div>
      <div className="space-y-6">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Published</span>
            <Switch checked={data.published} onCheckedChange={(v) => set("published", v)} />
          </label>
          <Field label="Turnaround (days)"><Input type="number" value={data.turnaroundDays} onChange={(e) => set("turnaroundDays", e.target.value)} /></Field>
          <Field label="Starting price ($)"><Input type="number" value={data.startingPrice} onChange={(e) => set("startingPrice", e.target.value)} /></Field>
          <Field label="Price note"><Textarea rows={2} value={data.priceNote} onChange={(e) => set("priceNote", e.target.value)} /></Field>
        </div>
        <Button onClick={save} disabled={saving} className="w-full">{saving ? <><Loader2 className="size-4 animate-spin" /> Saving…</> : <><Save className="size-4" /> Save</>}</Button>
      </div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
