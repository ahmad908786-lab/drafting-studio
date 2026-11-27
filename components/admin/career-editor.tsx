"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { saveCareer, deleteCareer } from "@/app/actions/admin-careers";

export type CareerFormData = {
  id: string;
  title: string;
  type: string;
  tags: string;
  desc: string;
  order: string;
  published: boolean;
};

export function CareerEditor({ initial }: { initial: CareerFormData }) {
  const router = useRouter();
  const [data, setData] = React.useState(initial);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const set = <K extends keyof CareerFormData>(k: K, v: CareerFormData[K]) => setData((d) => ({ ...d, [k]: v }));

  const save = async () => {
    setSaving(true);
    const res = await saveCareer({
      id: data.id || undefined,
      title: data.title,
      type: data.type,
      tags: data.tags,
      desc: data.desc,
      order: Number(data.order) || 0,
      published: data.published,
    });
    if (res.ok) {
      toast.success("Role saved");
      if (!data.id && res.id) {
        router.push(`/admin/careers/${res.id}`);
      } else {
        router.refresh();
      }
    } else {
      toast.error(res.message ?? "Could not save the role");
    }
    setSaving(false);
  };

  const remove = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    await deleteCareer(data.id);
    toast.success("Role deleted");
    router.push("/admin/careers");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <Field label="Title"><Input value={data.title} onChange={(e) => set("title", e.target.value)} placeholder="Senior Electrical Drafter (AutoCAD)" /></Field>
        <Field label="Type"><Input value={data.type} onChange={(e) => set("type", e.target.value)} placeholder="Full-time · Remote" /></Field>
        <Field label="Tags (comma-separated)"><Input value={data.tags} onChange={(e) => set("tags", e.target.value)} placeholder="Electrical, Lighting" /></Field>
        <Field label="Description"><Textarea rows={3} value={data.desc} onChange={(e) => set("desc", e.target.value)} /></Field>
      </div>
      <div className="space-y-6">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Published</span>
            <Switch checked={data.published} onCheckedChange={(v) => set("published", v)} />
          </label>
          <Field label="Order"><Input type="number" value={data.order} onChange={(e) => set("order", e.target.value)} /></Field>
        </div>
        <Button onClick={save} disabled={saving} className="w-full">{saving ? <><Loader2 className="size-4 animate-spin" /> Saving…</> : <><Save className="size-4" /> Save</>}</Button>
        {data.id && (
          <Button onClick={remove} disabled={deleting} variant={confirmDelete ? "destructive" : "outline"} className="w-full">
            {deleting ? (
              <><Loader2 className="size-4 animate-spin" /> Deleting…</>
            ) : confirmDelete ? (
              "Click again to confirm delete"
            ) : (
              <><Trash2 className="size-4" /> Delete role</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
