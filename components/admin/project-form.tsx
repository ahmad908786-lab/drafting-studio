"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Save, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploader } from "@/components/admin/file-uploader";
import { saveProject, deleteProject } from "@/app/actions/admin-projects";
import { US_STATES, PROJECT_STAGES, PROJECT_STATUSES } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

type Option = { slug: string; name: string; label?: string };
type Company = { id: string; name: string };

export type ProjectFormData = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  bodyMdx: string;
  industrySlug: string;
  disciplineSlugs: string[];
  serviceSlugs: string[];
  city: string;
  state: string;
  sizeSqft: string;
  floors: string;
  year: string;
  coverImage: string;
  isPublic: boolean;
  featured: boolean;
  status: string;
  stage: string;
  companyId: string;
  dueDate: string;
};

export function ProjectForm({
  initial,
  disciplines,
  services,
  industries,
  companies,
}: {
  initial: ProjectFormData;
  disciplines: Option[];
  services: Option[];
  industries: Option[];
  companies: Company[];
}) {
  const router = useRouter();
  const [data, setData] = React.useState<ProjectFormData>(initial);
  const [saving, setSaving] = React.useState(false);
  const set = <K extends keyof ProjectFormData>(k: K, v: ProjectFormData[K]) => setData((d) => ({ ...d, [k]: v }));

  const toggle = (key: "disciplineSlugs" | "serviceSlugs", slug: string) =>
    set(key, data[key].includes(slug) ? data[key].filter((s) => s !== slug) : [...data[key], slug]);

  const save = async () => {
    setSaving(true);
    const res = await saveProject({
      id: data.id,
      title: data.title,
      slug: data.slug || undefined,
      summary: data.summary,
      bodyMdx: data.bodyMdx,
      industrySlug: data.industrySlug || undefined,
      disciplineSlugs: data.disciplineSlugs,
      serviceSlugs: data.serviceSlugs,
      city: data.city || undefined,
      state: data.state || undefined,
      sizeSqft: data.sizeSqft ? Number(data.sizeSqft) : undefined,
      floors: data.floors ? Number(data.floors) : undefined,
      year: data.year ? Number(data.year) : undefined,
      coverImage: data.coverImage || undefined,
      isPublic: data.isPublic,
      featured: data.featured,
      status: data.status,
      stage: data.stage,
      companyId: data.companyId || undefined,
      dueDate: data.dueDate || undefined,
    });
    if (res.ok) {
      toast.success("Project saved");
      if (!data.id && res.id) router.push(`/admin/projects/${res.id}`);
      else router.refresh();
    } else {
      toast.error(res.message ?? "Save failed");
    }
    setSaving(false);
  };

  const remove = async () => {
    if (!data.id || !confirm("Delete this project? This cannot be undone.")) return;
    await deleteProject(data.id);
    toast.success("Project deleted");
    router.push("/admin/projects");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Card>
          <div className="space-y-4">
            <Field label="Title"><Input value={data.title} onChange={(e) => set("title", e.target.value)} placeholder="Project title" /></Field>
            {!data.id && <Field label="Slug (optional)"><Input value={data.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated from title" /></Field>}
            <Field label="Summary"><Textarea rows={2} value={data.summary} onChange={(e) => set("summary", e.target.value)} placeholder="One-line summary" /></Field>
            <Field label="Body (Markdown)"><Textarea rows={5} value={data.bodyMdx} onChange={(e) => set("bodyMdx", e.target.value)} placeholder="## Scope..." className="font-mono text-[13px]" /></Field>
          </div>
        </Card>

        <Card title="Disciplines">
          <div className="flex flex-wrap gap-2">
            {disciplines.map((d) => (
              <button key={d.slug} type="button" onClick={() => toggle("disciplineSlugs", d.slug)} className={cn("rounded-full border px-3 py-1.5 text-sm font-medium transition-colors", data.disciplineSlugs.includes(d.slug) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary")}>
                {d.label ?? d.name}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Services">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {services.map((s) => (
              <button key={s.slug} type="button" onClick={() => toggle("serviceSlugs", s.slug)} className={cn("flex items-center gap-2 rounded-lg border p-2 text-left text-sm", data.serviceSlugs.includes(s.slug) ? "border-primary bg-primary/5" : "border-border hover:bg-secondary")}>
                <Checkbox checked={data.serviceSlugs.includes(s.slug)} className="pointer-events-none" tabIndex={-1} />
                <span className="text-foreground">{s.name}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Location & size">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City"><Input value={data.city} onChange={(e) => set("city", e.target.value)} /></Field>
            <Field label="State">
              <Select value={data.state} onValueChange={(v) => set("state", v)}>
                <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                <SelectContent className="max-h-64">{US_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Size (sq ft)"><Input type="number" value={data.sizeSqft} onChange={(e) => set("sizeSqft", e.target.value)} /></Field>
            <Field label="Floors"><Input type="number" value={data.floors} onChange={(e) => set("floors", e.target.value)} /></Field>
            <Field label="Year"><Input type="number" value={data.year} onChange={(e) => set("year", e.target.value)} /></Field>
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card title="Publish">
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Public sample work</span>
              <Switch checked={data.isPublic} onCheckedChange={(v) => set("isPublic", v)} />
            </label>
            {data.isPublic ? (
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Featured</span>
                <Switch checked={data.featured} onCheckedChange={(v) => set("featured", v)} />
              </label>
            ) : (
              <>
                <Field label="Client company">
                  <Select value={data.companyId} onValueChange={(v) => set("companyId", v)}>
                    <SelectTrigger><SelectValue placeholder="Assign company" /></SelectTrigger>
                    <SelectContent>{companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Stage">
                  <Select value={data.stage} onValueChange={(v) => set("stage", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{PROJECT_STAGES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Status">
                  <Select value={data.status} onValueChange={(v) => set("status", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{PROJECT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Due date"><Input type="date" value={data.dueDate} onChange={(e) => set("dueDate", e.target.value)} /></Field>
              </>
            )}
          </div>
        </Card>

        <Card title="Industry">
          <Select value={data.industrySlug} onValueChange={(v) => set("industrySlug", v)}>
            <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
            <SelectContent>{industries.map((i) => <SelectItem key={i.slug} value={i.slug}>{i.name}</SelectItem>)}</SelectContent>
          </Select>
        </Card>

        <Card title="Cover image">
          {data.coverImage && (
            <div className="relative mb-3 aspect-[3/2] overflow-hidden rounded-lg border border-border">
              <Image src={data.coverImage} alt="Cover" fill className="object-cover" sizes="320px" />
            </div>
          )}
          <FileUploader folder="media" label="Upload cover" accept=".png,.jpg,.jpeg,.webp,.svg" onUploaded={(f) => set("coverImage", f.url)} />
        </Card>

        <div className="flex flex-col gap-2">
          <Button onClick={save} disabled={saving}>{saving ? <><Loader2 className="size-4 animate-spin" /> Saving…</> : <><Save className="size-4" /> Save project</>}</Button>
          {data.id && <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={remove}><Trash2 className="size-4" /> Delete</Button>}
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      {title && <h3 className="mb-4 text-sm font-bold text-foreground">{title}</h3>}
      {children}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
