"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Save, Trash2, Loader2, Eye, ArrowLeft, MoreHorizontal,
  Star, ImageIcon, X, Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { FileUploader } from "@/components/admin/file-uploader";
import { savePost, deletePost } from "@/app/actions/admin-blog";
import { POST_TEMPLATES, POST_STATUSES } from "@/lib/taxonomy";
import { cn, slugify } from "@/lib/utils";

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
  /** Readonly meta shown in the Publish card when editing. */
  authorName?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function PostEditor({ initial, categories }: { initial: PostFormData; categories: Cat[] }) {
  const router = useRouter();
  const [data, setData] = React.useState<PostFormData>(initial);
  const initialRef = React.useRef<PostFormData>(initial);
  const [saving, setSaving] = React.useState(false);
  const [tab, setTab] = React.useState<"write" | "preview">("write");
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const titleRef = React.useRef<HTMLTextAreaElement>(null);

  const set = <K extends keyof PostFormData>(k: K, v: PostFormData[K]) => setData((d) => ({ ...d, [k]: v }));
  const dirty = React.useMemo(
    () => JSON.stringify(data) !== JSON.stringify(initialRef.current),
    [data],
  );

  // Auto-grow the title field.
  React.useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [data.title]);

  const wordCount = React.useMemo(() => (data.bodyMdx.trim().match(/\S+/g) || []).length, [data.bodyMdx]);
  const suggestedSlug = React.useMemo(() => slugify(data.title), [data.title]);

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
      const next = { ...data, id: res.id ?? data.id, slug: res.slug ?? data.slug };
      initialRef.current = next;
      setData(next);
      if (!data.id && res.id) router.push(`/admin/blog/${res.id}`);
      else router.refresh();
    } else toast.error(res.message ?? "Save failed");
    setSaving(false);
  };

  const remove = async () => {
    if (!data.id) return;
    setDeleting(true);
    try {
      await deletePost(data.id);
      toast.success("Post deleted");
      router.push("/admin/blog");
    } catch {
      toast.error("Delete failed");
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const statusVariant = data.status === "PUBLISHED" ? "success" : data.status === "DRAFT" ? "muted" : "warning";

  return (
    <div className="space-y-6">
      {/* Sticky action bar */}
      <div className="sticky top-0 z-30 rounded-xl border border-border bg-background/95 shadow-[var(--shadow-card)] backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <Button asChild variant="ghost" size="icon-sm" aria-label="Back to posts">
            <Link href="/admin/blog"><ArrowLeft className="size-4" /></Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex min-w-0 items-center gap-2">
            <Badge variant={statusVariant}>{data.status}</Badge>
            {dirty && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                <span className="size-1.5 rounded-full bg-amber-500" /> Unsaved changes
              </span>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {data.slug && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/blog/${data.slug}`} target="_blank"><Eye className="size-4" /> Preview</Link>
              </Button>
            )}
            {data.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="More actions"><MoreHorizontal className="size-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteOpen(true)}>
                    <Trash2 className="size-4" /> Delete post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button onClick={save} disabled={saving} size="sm" className="min-w-28">
              {saving ? <><Loader2 className="size-4 animate-spin" /> Saving…</> : <><Save className="size-4" /> Save</>}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
            <textarea
              ref={titleRef}
              rows={1}
              value={data.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Post title…"
              className="w-full resize-none overflow-hidden bg-transparent text-3xl font-extrabold tracking-tight text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            />
            {!data.id ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="shrink-0 text-sm text-muted-foreground">/blog/</span>
                <Input
                  value={data.slug ?? ""}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="auto from title"
                  className="h-8 max-w-64 font-mono text-xs"
                />
                {suggestedSlug && suggestedSlug !== (data.slug ?? "") && (
                  <button
                    type="button"
                    onClick={() => set("slug", suggestedSlug)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <Check className="size-3" /> Use “{suggestedSlug}”
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono text-xs">/blog/{data.slug}</span>
                <Link href={`/blog/${data.slug}`} target="_blank" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  <Eye className="size-3" /> View live
                </Link>
              </div>
            )}

            <div className="mt-5">
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Excerpt</Label>
              <Textarea
                rows={2}
                value={data.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="Short summary shown on cards and in search results…"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <Tabs value={tab} onValueChange={(v) => setTab(v as "write" | "preview")}>
              <div className="flex items-center justify-between border-b border-border px-4 py-2">
                <TabsList>
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <span className="text-xs tabular-nums text-muted-foreground">{wordCount.toLocaleString()} words</span>
              </div>
              <TabsContent value="write" className="m-0">
                <Textarea
                  value={data.bodyMdx}
                  onChange={(e) => set("bodyMdx", e.target.value)}
                  rows={24}
                  spellCheck={false}
                  placeholder={"## Heading\n\nWrite in Markdown…"}
                  className="min-h-[480px] resize-y rounded-none border-0 font-mono text-[13px] leading-relaxed focus-visible:ring-0"
                />
                <div className="border-t border-border bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
                  Custom tags: <code className="rounded bg-muted px-1 font-mono">{"<Callout type=\"tip\">…</Callout>"}</code>
                  {" "}· <code className="rounded bg-muted px-1 font-mono">{"<Checklist items=\"a;b;c\" />"}</code>
                </div>
              </TabsContent>
              <TabsContent value="preview" className="m-0">
                <div className="min-h-[480px] p-6 sm:p-8">
                  {data.bodyMdx.trim() ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                      {mdxToPreview(data.bodyMdx)}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nothing to preview yet — start writing.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-sm">Publish</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={data.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {POST_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s === "PUBLISHED" ? "Published" : s === "DRAFT" ? "Draft" : "Scheduled"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    Featured {data.featured && <Star className="size-3.5 fill-accent text-accent" />}
                  </div>
                  <p className="text-xs text-muted-foreground">Pin to the blog homepage.</p>
                </div>
                <Switch checked={data.featured} onCheckedChange={(v) => set("featured", v)} />
              </div>
              {data.id && (
                <>
                  <Separator />
                  <dl className="space-y-1 text-xs text-muted-foreground">
                    {data.authorName && <div className="flex justify-between"><dt>Author</dt><dd className="font-medium text-foreground">{data.authorName}</dd></div>}
                    {data.createdAt && <div className="flex justify-between"><dt>Created</dt><dd>{data.createdAt}</dd></div>}
                    {data.updatedAt && <div className="flex justify-between"><dt>Updated</dt><dd>{data.updatedAt}</dd></div>}
                  </dl>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Cover image</CardTitle></CardHeader>
            <CardContent>
              {data.coverImage ? (
                <div className="group relative aspect-[16/9] overflow-hidden rounded-lg border border-border">
                  <Image src={data.coverImage} alt="Cover preview" fill className="object-cover" sizes="340px" />
                  <button
                    type="button"
                    onClick={() => set("coverImage", "")}
                    aria-label="Remove cover"
                    className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="grid aspect-[16/9] place-items-center rounded-lg border-2 border-dashed border-border bg-muted/40">
                  <div className="text-center">
                    <ImageIcon className="mx-auto size-6 text-muted-foreground/50" />
                    <p className="mt-1 text-xs text-muted-foreground">No cover yet</p>
                  </div>
                </div>
              )}
              <div className="mt-3">
                <FileUploader folder="media" label="Upload cover" accept=".png,.jpg,.jpeg,.webp,.svg" onUploaded={(f) => set("coverImage", f.url)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Category & tags</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={data.categorySlug} onValueChange={(v) => set("categorySlug", v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Tags</Label>
                <Input value={data.tags} onChange={(e) => set("tags", e.target.value)} placeholder="NEC, load calc" />
                <p className="text-[11px] text-muted-foreground">Comma-separated.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Template</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {POST_TEMPLATES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => set("template", t.value)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-2.5 text-left transition-all",
                      data.template === t.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-muted-foreground/40 hover:bg-muted/40",
                    )}
                  >
                    <TemplateThumb kind={t.value} active={data.template === t.value} />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">{t.label}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{t.desc}</div>
                    </div>
                    {data.template === t.value && <Check className="ml-auto size-4 shrink-0 text-primary" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">SEO</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {/* Google snippet preview */}
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-[11px] text-muted-foreground">Search preview</p>
                <p className="mt-1 truncate text-[15px] font-medium leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">
                  {(data.seoTitle || data.title || "Post title").slice(0, 70)}
                </p>
                <p className="truncate text-xs text-[#006621] dark:text-[#bdc1c6]">
                  {typeof window !== "undefined" ? window.location.origin : ""}/blog/{data.slug || suggestedSlug || "…"}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
                  {(data.seoDesc || data.excerpt || "Add an excerpt or SEO description…").slice(0, 170)}
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>SEO title</Label>
                  <CharCount value={(data.seoTitle || data.title).length} limit={60} />
                </div>
                <Input value={data.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder="Defaults to post title" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>SEO description</Label>
                  <CharCount value={(data.seoDesc || data.excerpt).length} limit={160} />
                </div>
                <Textarea rows={3} value={data.seoDesc} onChange={(e) => set("seoDesc", e.target.value)} placeholder="Defaults to excerpt — aim for ~155 characters" />
              </div>
            </CardContent>
          </Card>

          {data.id && (
            <Card className="border-destructive/40">
              <CardHeader><CardTitle className="text-sm text-destructive">Danger zone</CardTitle></CardHeader>
              <CardContent>
                <p className="mb-3 text-xs text-muted-foreground">Permanently delete this post. This cannot be undone.</p>
                <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="size-4" /> Delete post
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onOpenChange={(open) => !open && setDeleteOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete post?</DialogTitle>
            <DialogDescription>
              “{data.title || "Untitled post"}” will be permanently deleted. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={remove} disabled={deleting}>
              {deleting ? <><Loader2 className="size-4 animate-spin" /> Deleting…</> : <><Trash2 className="size-4" /> Delete</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CharCount({ value, limit }: { value: number; limit: number }) {
  const over = value > limit;
  return (
    <span className={cn("text-[11px] tabular-nums", over ? "font-semibold text-destructive" : "text-muted-foreground")}>
      {value}/{limit}
    </span>
  );
}

/** Convert the MDX-only custom tags into plain Markdown so the preview can render them. */
function mdxToPreview(md: string): string {
  let out = md.replace(/<Checklist\s+items="([^"]*)"\s*\/>/g, (_m, items) =>
    String(items).split(";").map((s: string) => s.trim()).filter(Boolean).map((s: string) => `- [ ] ${s}`).join("\n"),
  );
  out = out.replace(/<Callout\s+type="([^"]*)"\s*>([\s\S]*?)<\/Callout>/g, (_m, type, body) => {
    const lines = String(body).trim().split("\n").map((l: string) => `> ${l}`).join("\n");
    return `> **${String(type).toUpperCase()}**\n${lines}`;
  });
  return out;
}

/** Styled Markdown primitives for the preview pane (no typography plugin in this repo). */
const mdComponents = {
  h1: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="mb-4 mt-8 text-3xl font-extrabold tracking-tight text-foreground first:mt-0" {...p} />,
  h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="mb-3 mt-8 border-b border-border pb-2 text-2xl font-bold tracking-tight text-foreground" {...p} />,
  h3: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="mb-2 mt-6 text-xl font-bold text-foreground" {...p} />,
  h4: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h4 className="mb-2 mt-5 text-lg font-semibold text-foreground" {...p} />,
  p: (p: React.HTMLAttributes<HTMLParagraphElement>) => <p className="my-4 leading-relaxed text-foreground/90" {...p} />,
  a: (p: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a className="font-medium text-primary underline underline-offset-2" {...p} />,
  ul: (p: React.HTMLAttributes<HTMLUListElement>) => <ul className="my-4 list-disc space-y-1.5 pl-6 text-foreground/90" {...p} />,
  ol: (p: React.HTMLAttributes<HTMLOListElement>) => <ol className="my-4 list-decimal space-y-1.5 pl-6 text-foreground/90" {...p} />,
  li: (p: React.HTMLAttributes<HTMLLIElement>) => <li className="leading-relaxed" {...p} />,
  blockquote: (p: React.HTMLAttributes<HTMLElement>) => (
    <blockquote className="my-5 rounded-r-lg border-l-4 border-primary/60 bg-primary/5 px-4 py-3 text-foreground/90 [&>p]:my-1" {...p} />
  ),
  code: (p: React.HTMLAttributes<HTMLElement>) => <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground" {...p} />,
  pre: (p: React.HTMLAttributes<HTMLPreElement>) => <pre className="my-5 overflow-x-auto rounded-lg border border-border bg-muted/60 p-4 font-mono text-[13px] leading-relaxed [&>code]:bg-transparent [&>code]:p-0" {...p} />,
  hr: (p: React.HTMLAttributes<HTMLHRElement>) => <hr className="my-8 border-border" {...p} />,
  table: (p: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-5 overflow-x-auto rounded-lg border border-border"><table className="w-full text-sm" {...p} /></div>
  ),
  th: (p: React.HTMLAttributes<HTMLTableCellElement>) => <th className="border-b border-border bg-muted/60 px-3 py-2 text-left font-semibold text-foreground" {...p} />,
  td: (p: React.HTMLAttributes<HTMLTableCellElement>) => <td className="border-b border-border px-3 py-2 align-top text-foreground/90 last:border-0" {...p} />,
  img: (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img className="my-5 rounded-lg border border-border" loading="lazy" {...p} />,
  strong: (p: React.HTMLAttributes<HTMLElement>) => <strong className="font-bold text-foreground" {...p} />,
};

/** Tiny visual glyph representing each template layout. */
function TemplateThumb({ kind, active }: { kind: string; active: boolean }) {
  const c = active ? "bg-primary" : "bg-muted-foreground/40";
  return (
    <div className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-background">
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
