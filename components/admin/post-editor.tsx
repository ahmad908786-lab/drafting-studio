"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { Save, Trash2, Loader2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploader } from "@/components/admin/file-uploader";
import { savePost, deletePost } from "@/app/actions/admin-blog";
import { POST_TEMPLATES, POST_STATUSES } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

type Cat = { slug: string; name: string };

export type PostFormData = {
  id?: string;
  slug?: string;
  title: string;
  excerpt: string;
  bodyMdx: string;
  template: string;
  categorySlug: string;
  tags: string;
  coverImage: string;
  status: string;
  featured: boolean;
  seoTitle: string;
  seoDesc: string;
};

export function PostEditor({ initial, categories }: { initial: PostFormData; categories: Cat[] }) {
  const router = useRouter();
  const [data, setData] = React.useState<PostFormData>(initial);
  const [saving, setSaving] = React.useState(false);
  const set = <K extends keyof PostFormData>(k: K, v: PostFormData[K]) => setData((d) => ({ ...d, [k]: v }));

  const save = async () => {
    setSaving(true);
    const res = await savePost({
      id: data.id,
      title: data.title,
      slug: data.slug || undefined,
      excerpt: data.excerpt,
      bodyMdx: data.bodyMdx,
      template: data.template,
      categorySlug: data.categorySlug || undefined,
      tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
      coverImage: data.coverImage || undefined,
      status: data.status,
      featured: data.featured,
      seoTitle: data.seoTitle || undefined,
      seoDesc: data.seoDesc || undefined,
    });
    if (res.ok) {
      toast.success("Post saved");
      if (!data.id && res.id) router.push(`/admin/blog/${res.id}`);
      else router.refresh();
    } else toast.error(res.message ?? "Save failed");
    setSaving(false);
  };

  const remove = async () => {
    if (!data.id || !confirm("Delete this post?")) return;
    await deletePost(data.id);
    toast.success("Post deleted");
    router.push("/admin/blog");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Card>
          <div className="space-y-4">
            <Field label="Title"><Input value={data.title} onChange={(e) => set("title", e.target.value)} placeholder="Post title" className="text-lg font-semibold" /></Field>
            {!data.id && <Field label="Slug (optional)"><Input value={data.slug ?? ""} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" /></Field>}
            <Field label="Excerpt"><Textarea rows={2} value={data.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Short summary shown on cards" /></Field>
            <Field label="Body (MDX / Markdown)"><Textarea rows={18} value={data.bodyMdx} onChange={(e) => set("bodyMdx", e.target.value)} className="font-mono text-[13px]" placeholder={"## Heading\n\nWrite in Markdown. Custom tags: <Callout type=\"tip\">…</Callout>, <Checklist items=\"a;b;c\" />"} /></Field>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Template">
          <div className="grid gap-2">
            {POST_TEMPLATES.map((t) => (
              <button key={t.value} type="button" onClick={() => set("template", t.value)} className={cn("rounded-lg border p-3 text-left transition-colors", data.template === t.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-secondary")}>
                <div className="flex items-center gap-2">
                  <TemplateThumb kind={t.value} active={data.template === t.value} />
                  <div>
                    <div className="text-sm font-bold text-foreground">{t.label}</div>
                    <div className="text-[11px] leading-tight text-muted-foreground">{t.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Publish">
          <div className="space-y-4">
            <Field label="Status">
              <Select value={data.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{POST_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Featured</span>
              <Switch checked={data.featured} onCheckedChange={(v) => set("featured", v)} />
            </label>
          </div>
        </Card>

        <Card title="Category & tags">
          <div className="space-y-4">
            <Field label="Category">
              <Select value={data.categorySlug} onValueChange={(v) => set("categorySlug", v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Tags (comma-separated)"><Input value={data.tags} onChange={(e) => set("tags", e.target.value)} placeholder="NEC, load calc" /></Field>
          </div>
        </Card>

        <Card title="Cover image">
          {data.coverImage && (
            <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-lg border border-border">
              <Image src={data.coverImage} alt="Cover" fill className="object-cover" sizes="320px" />
            </div>
          )}
          <FileUploader folder="media" label="Upload cover" accept=".png,.jpg,.jpeg,.webp,.svg" onUploaded={(f) => set("coverImage", f.url)} />
        </Card>

        <Card title="SEO">
          <div className="space-y-4">
            <Field label="SEO title"><Input value={data.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} /></Field>
            <Field label="SEO description"><Textarea rows={2} value={data.seoDesc} onChange={(e) => set("seoDesc", e.target.value)} /></Field>
          </div>
        </Card>

        <div className="flex flex-col gap-2">
          <Button onClick={save} disabled={saving}>{saving ? <><Loader2 className="size-4 animate-spin" /> Saving…</> : <><Save className="size-4" /> Save post</>}</Button>
          {data.id && data.slug && <Button asChild variant="outline"><Link href={`/blog/${data.slug}`} target="_blank"><Eye className="size-4" /> Preview</Link></Button>}
          {data.id && <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={remove}><Trash2 className="size-4" /> Delete</Button>}
        </div>
      </div>
    </div>
  );
}

/** Tiny visual glyph representing each template layout. */
function TemplateThumb({ kind, active }: { kind: string; active: boolean }) {
  const c = active ? "bg-primary" : "bg-muted-foreground/40";
  return (
    <div className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-background">
      <div className="flex w-6 flex-col gap-0.5">
        {kind === "STANDARD" && <><div className={cn("h-1 w-4", c)} /><div className="flex gap-0.5"><div className={cn("h-3 w-1", c)} /><div className="h-3 flex-1 rounded-sm bg-muted" /></div></>}
        {kind === "TECHNICAL_GUIDE" && <><div className="flex gap-0.5"><div className={cn("h-4 w-1.5", c)} /><div className="h-4 flex-1 rounded-sm bg-muted" /></div></>}
        {kind === "CASE_STUDY" && <><div className={cn("h-1.5 w-full", c)} /><div className="flex gap-0.5"><div className="h-2.5 flex-1 rounded-sm bg-muted" /><div className="h-2.5 flex-1 rounded-sm bg-muted" /></div></>}
        {kind === "LISTICLE" && <><div className={cn("h-1 w-2 rounded-full", c)} /><div className="h-1 w-full rounded-sm bg-muted" /><div className={cn("h-1 w-2 rounded-full", c)} /><div className="h-1 w-full rounded-sm bg-muted" /></>}
        {kind === "EDITORIAL" && <><div className="mx-auto h-1 w-3 rounded-sm bg-muted" /><div className={cn("mx-auto h-2 w-2", c)} /><div className="mx-auto h-1 w-4 rounded-sm bg-muted" /></>}
      </div>
    </div>
  );
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">{title && <h3 className="mb-4 text-sm font-bold text-foreground">{title}</h3>}{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
