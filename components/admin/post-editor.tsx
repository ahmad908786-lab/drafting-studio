"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft, Eye, MoreHorizontal, Trash2, Loader2, Check, X,
  Bold, Italic, Heading2, Heading3, TextQuote, List, ListOrdered,
  Link2, ImagePlus, Code2, Lightbulb, ListChecks, Settings2, Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { savePost, deletePost } from "@/app/actions/admin-blog";
import { POST_TEMPLATES, POST_STATUSES } from "@/lib/taxonomy";
import { cn, slugify, readingMinutes } from "@/lib/utils";

/** Upload a file to /api/upload and return its URL. */
async function uploadFile(file: File, folder = "media"): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Upload failed");
  return json.url as string;
}

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
  authorName?: string;
  createdAt?: string;
  updatedAt?: string;
};

type SaveState = "saved" | "dirty" | "saving";

type Tool = { icon: React.ReactNode; label: string; action: () => void };

/**
 * Its own component so the tool callbacks — which reach into the body textarea's
 * ref when clicked — are not traced through the editor's render.
 */
function MarkdownToolbar({ tools }: { tools: Tool[] }) {
  return (
    <div className="sticky top-[8.5rem] z-20 -mx-2 mb-2 flex flex-wrap items-center gap-0.5 rounded-xl border border-border/70 bg-background/90 px-2 py-1.5 backdrop-blur-xl">
      {tools.map((t) => (
        <Tooltip key={t.label}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={t.action}
              aria-label={t.label}
              className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {t.icon}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{t.label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

export function PostEditor({ initial, categories }: { initial: PostFormData; categories: Cat[] }) {
  const router = useRouter();
  const [data, setData] = React.useState<PostFormData>(initial);
  const [mode, setMode] = React.useState<"write" | "preview">("write");
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [saveState, setSaveState] = React.useState<SaveState>("saved");
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const [imgDialogOpen, setImgDialogOpen] = React.useState(false);

  const dataRef = React.useRef(data);
  // Mirrored after render, not during it, so save callbacks can read the latest
  // form values without being rebuilt on every keystroke.
  React.useEffect(() => {
    dataRef.current = data;
  });
  // The last saved snapshot. State rather than a ref, because `dirty` is derived
  // from it during render and a save replaces it.
  const [baseline, setBaseline] = React.useState(initial);
  const savingRef = React.useRef(false);
  const queuedRef = React.useRef(false);
  const titleRef = React.useRef<HTMLTextAreaElement>(null);
  const excerptRef = React.useRef<HTMLTextAreaElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  const set = <K extends keyof PostFormData>(k: K, v: PostFormData[K]) => setData((d) => ({ ...d, [k]: v }));
  const dirty = React.useMemo(
    () => JSON.stringify(data) !== JSON.stringify(baseline),
    [data, baseline],
  );

  /* Auto-grow title + excerpt. */
  React.useEffect(() => {
    for (const el of [titleRef.current, excerptRef.current]) {
      if (!el) continue;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [data.title, data.excerpt]);

  const wordCount = React.useMemo(() => (data.bodyMdx.trim().match(/\S+/g) || []).length, [data.bodyMdx]);
  const readMins = React.useMemo(() => Math.max(1, readingMinutes(data.bodyMdx)), [data.bodyMdx]);
  const suggestedSlug = React.useMemo(() => slugify(data.title), [data.title]);

  /* ---------- saving (manual + autosave) ---------- */
  const doSave = React.useCallback(async (manual: boolean) => {
    if (savingRef.current) {
      queuedRef.current = true;
      return;
    }
    savingRef.current = true;
    setSaveState("saving");
    const d = dataRef.current;
    try {
      const res = await savePost({
        id: d.id,
        title: d.title,
        slug: d.slug || undefined,
        excerpt: d.excerpt,
        bodyMdx: d.bodyMdx,
        template: d.template,
        categorySlug: d.categorySlug || undefined,
        tags: d.tags.split(",").map((t) => t.trim()).filter(Boolean),
        coverImage: d.coverImage || undefined,
        status: d.status,
        featured: d.featured,
        seoTitle: d.seoTitle || undefined,
        seoDesc: d.seoDesc || undefined,
      });
      if (res.ok) {
        const next = { ...dataRef.current, id: res.id ?? dataRef.current.id, slug: res.slug ?? dataRef.current.slug };
        setBaseline(next);
        dataRef.current = next;
        setData(next);
        setSaveState("saved");
        setLastSaved(new Date());
        if (manual) toast.success(d.status === "PUBLISHED" ? "Post saved" : "Post saved");
        if (!d.id && res.id) router.replace(`/admin/blog/${res.id}`);
        else router.refresh();
      } else {
        toast.error(res.message ?? "Save failed");
        setSaveState("dirty");
      }
    } catch {
      toast.error("Save failed");
      setSaveState("dirty");
    } finally {
      savingRef.current = false;
      if (queuedRef.current) {
        queuedRef.current = false;
        void doSave(false);
      }
    }
  }, [router]);

  /* Autosave: only for existing posts, 2.5s after the last keystroke. */
  React.useEffect(() => {
    if (!data.id || !dirty || savingRef.current) return;
    setSaveState("dirty");
    const t = setTimeout(() => void doSave(false), 2500);
    return () => clearTimeout(t);
  }, [data, data.id, dirty, doSave]);

  /* Cmd/Ctrl+S */
  React.useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void doSave(true);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [doSave]);

  const publish = () => {
    const d = dataRef.current;
    if (d.status !== "PUBLISHED") {
      const next = { ...d, status: "PUBLISHED" };
      dataRef.current = next;
      setData(next);
    }
    void doSave(true);
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

  /* ---------- markdown toolbar ---------- */
  const insertAtCursor = React.useCallback((before: string, after = "", placeholder = "") => {
    const el = bodyRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const sel = value.slice(s, e) || placeholder;
    el.setRangeText(before + sel + after, s, e, "end");
    set("bodyMdx", el.value);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + sel.length);
    });
  }, []);

  const prefixLines = React.useCallback((prefix: (line: string, i: number) => string) => {
    const el = bodyRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const ls = value.lastIndexOf("\n", s - 1) + 1;
    let le = value.indexOf("\n", e);
    if (le === -1) le = value.length;
    const block = value.slice(ls, le);
    el.setRangeText(block.split("\n").map(prefix).join("\n"), ls, le, "end");
    set("bodyMdx", el.value);
    el.focus();
  }, []);

  const insertBlock = React.useCallback((text: string) => {
    const el = bodyRef.current;
    if (!el) return;
    const { selectionStart: s, value } = el;
    const needsGap = s > 0 && !value.slice(0, s).endsWith("\n\n");
    const chunk = (needsGap ? "\n\n" : "") + text + "\n\n";
    el.setRangeText(chunk, s, s, "end");
    set("bodyMdx", el.value);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + chunk.length, s + chunk.length);
    });
  }, []);

  const tools: Tool[] = React.useMemo(() => [
    { icon: <Bold className="size-4" />, label: "Bold", action: () => insertAtCursor("**", "**", "bold text") },
    { icon: <Italic className="size-4" />, label: "Italic", action: () => insertAtCursor("*", "*", "italic text") },
    { icon: <Heading2 className="size-4" />, label: "Heading 2", action: () => prefixLines((l) => (l.startsWith("## ") ? l : `## ${l.replace(/^#+\s*/, "")}`)) },
    { icon: <Heading3 className="size-4" />, label: "Heading 3", action: () => prefixLines((l) => (l.startsWith("### ") ? l : `### ${l.replace(/^#+\s*/, "")}`)) },
    { icon: <TextQuote className="size-4" />, label: "Quote", action: () => prefixLines((l) => (l.startsWith("> ") ? l : `> ${l}`)) },
    { icon: <List className="size-4" />, label: "Bulleted list", action: () => prefixLines((l) => (l.startsWith("- ") ? l : `- ${l}`)) },
    { icon: <ListOrdered className="size-4" />, label: "Numbered list", action: () => prefixLines((l, i) => (/^\d+\.\s/.test(l) ? l : `${i + 1}. ${l}`)) },
    { icon: <Code2 className="size-4" />, label: "Code", action: () => insertAtCursor("`", "`", "code") },
    { icon: <Link2 className="size-4" />, label: "Link", action: () => insertAtCursor("[", "](https://)", "link text") },
    { icon: <ImagePlus className="size-4" />, label: "Image", action: () => setImgDialogOpen(true) },
    { icon: <Lightbulb className="size-4" />, label: "Callout", action: () => insertBlock('<Callout type="tip">\n\n</Callout>') },
    { icon: <ListChecks className="size-4" />, label: "Checklist", action: () => insertBlock('<Checklist items="First item; Second item" />') },
  ], [insertAtCursor, prefixLines, insertBlock]);

  const statusMeta =
    data.status === "PUBLISHED"
      ? { label: "Published", cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" }
      : data.status === "SCHEDULED"
        ? { label: "Scheduled", cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" }
        : { label: "Draft", cls: "bg-muted text-muted-foreground border-border" };

  return (
    <TooltipProvider delayDuration={300}>
      <div>
        {/* ===== Top bar ===== */}
        <div className="sticky top-[4.25rem] z-30 rounded-2xl border border-border/70 bg-background/85 shadow-[var(--shadow-card)] backdrop-blur-xl">
          <div className="flex h-14 items-center gap-1.5 px-3 sm:gap-2 sm:px-4">
            <Button asChild variant="ghost" size="icon" className="size-9" aria-label="Back to posts">
              <Link href="/admin/blog"><ArrowLeft className="size-4" /></Link>
            </Button>
            <span className={cn("hidden rounded-full border px-2.5 py-0.5 text-[11px] font-semibold sm:inline-block", statusMeta.cls)}>
              {statusMeta.label}
            </span>
            <SaveIndicator state={saveState} lastSaved={lastSaved} />
            <div className="flex-1" />
            <span className="hidden text-xs tabular-nums text-muted-foreground lg:block">
              {wordCount.toLocaleString()} words
            </span>
            <div className="flex rounded-full border border-border bg-muted/60 p-0.5">
              {(["write", "preview"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all",
                    mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9" onClick={() => setSettingsOpen(true)} aria-label="Post settings">
                  <Settings2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Post settings</TooltipContent>
            </Tooltip>
            {data.slug && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="ghost" size="icon" className="size-9" aria-label="View live">
                    <Link href={`/blog/${data.slug}`} target="_blank"><Eye className="size-4" /></Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View live</TooltipContent>
              </Tooltip>
            )}
            {data.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-9" aria-label="More actions">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteOpen(true)}>
                    <Trash2 className="size-4" /> Delete post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button onClick={publish} disabled={saveState === "saving"} className="h-9 rounded-full px-5 text-sm font-semibold">
              {saveState === "saving" ? <Loader2 className="size-4 animate-spin" /> : data.status === "PUBLISHED" ? "Save" : "Publish"}
            </Button>
          </div>
        </div>

        {/* ===== Canvas ===== */}
        <div className="mx-auto max-w-3xl px-1 pb-24 pt-8 sm:pt-10">
          {/* Cover */}
          {data.coverImage ? (
            <div className="group relative mb-8 aspect-[21/9] overflow-hidden rounded-2xl bg-muted">
              <Image src={data.coverImage} alt="Cover" fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                <UploadButton
                  accept=".png,.jpg,.jpeg,.webp"
                  onUploaded={(url) => set("coverImage", url)}
                  className="rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-foreground shadow-lg transition-transform hover:scale-105"
                >
                  Change
                </UploadButton>
                <Button
                  type="button" variant="secondary" size="sm" className="rounded-full"
                  onClick={() => set("coverImage", "")}
                >
                  <X className="size-4" /> Remove
                </Button>
              </div>
            </div>
          ) : (
            <UploadButton
              accept=".png,.jpg,.jpeg,.webp"
              onUploaded={(url) => set("coverImage", url)}
              className="mb-8 flex aspect-[21/9] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/30 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
            >
              <ImagePlus className="size-5" />
              Add cover image
            </UploadButton>
          )}

          {/* Title */}
          <textarea
            ref={titleRef}
            rows={1}
            value={data.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Post title"
            className="w-full resize-none overflow-hidden bg-transparent text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground placeholder:text-muted-foreground/40 focus:outline-none sm:text-5xl"
          />

          {/* Slug */}
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
            <span className="text-muted-foreground/70">/blog/</span>
            {data.id ? (
              <>
                <code className="rounded bg-muted/70 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{data.slug}</code>
                <Link href={`/blog/${data.slug}`} target="_blank" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                  <Eye className="size-3" /> View
                </Link>
              </>
            ) : (
              <>
                <input
                  value={data.slug ?? ""}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder={suggestedSlug || "auto-from-title"}
                  spellCheck={false}
                  className="w-56 bg-transparent font-mono text-xs text-muted-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:text-foreground"
                />
                {suggestedSlug && suggestedSlug !== (data.slug ?? "") && (
                  <button type="button" onClick={() => set("slug", suggestedSlug)} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                    <Check className="size-3" /> Use “{suggestedSlug}”
                  </button>
                )}
              </>
            )}
          </div>

          {/* Excerpt */}
          <textarea
            ref={excerptRef}
            rows={2}
            value={data.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            placeholder="Write a short excerpt — shown on cards and in search results…"
            className="mt-4 w-full resize-none overflow-hidden bg-transparent text-[17px] leading-relaxed text-muted-foreground placeholder:text-muted-foreground/40 focus:outline-none"
          />

          {/* Category + tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Select value={data.categorySlug} onValueChange={(v) => set("categorySlug", v)}>
              <SelectTrigger className="h-8 w-auto min-w-36 gap-2 rounded-full border-border bg-muted/50 text-[13px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              value={data.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="Tags, comma separated"
              className="h-8 w-56 rounded-full border-border bg-muted/50 text-[13px]"
            />
            {data.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Star className="size-3 fill-amber-500 text-amber-500" /> Featured
              </span>
            )}
          </div>

          <Separator className="my-8" />

          {/* Body */}
          {mode === "write" ? (
            <>
              <MarkdownToolbar tools={tools} />
              <Textarea
                ref={bodyRef}
                value={data.bodyMdx}
                onChange={(e) => set("bodyMdx", e.target.value)}
                spellCheck={false}
                placeholder={"Start writing in Markdown…\n\n## A heading\n\n- a list item\n\n<Tip> blocks, checklists and images work too."}
                className="min-h-[52vh] resize-y border-0 bg-transparent px-0 font-mono text-[14px] leading-[1.75] shadow-none focus-visible:ring-0"
              />
              <p className="mt-6 text-xs text-muted-foreground">
                {wordCount.toLocaleString()} words · {readMins} min read · Markdown +{" "}
                <code className="rounded bg-muted px-1 font-mono">{"<Callout>"}</code>{" "}
                <code className="rounded bg-muted px-1 font-mono">{"<Checklist>"}</code>
              </p>
            </>
          ) : (
            <div className="min-h-[52vh]">
              {data.bodyMdx.trim() ? (
                <div className="preview-prose">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                    {mdxToPreview(data.bodyMdx)}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="py-16 text-center text-sm text-muted-foreground">Nothing to preview yet — start writing.</p>
              )}
            </div>
          )}
        </div>

        {/* ===== Settings sheet ===== */}
        <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
          <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
            <SheetHeader className="border-b border-border px-6 py-4">
              <SheetTitle>Post settings</SheetTitle>
            </SheetHeader>
            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
              <section>
                <SectionLabel>Publishing</SectionLabel>
                <div className="mt-3 space-y-4">
                  <div className="space-y-1.5">
                    <Label>Status</Label>
                    <Select value={data.status} onValueChange={(v) => set("status", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {POST_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s === "PUBLISHED" ? "Published" : s === "DRAFT" ? "Draft" : "Scheduled"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3.5">
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        Featured {data.featured && <Star className="size-3.5 fill-amber-500 text-amber-500" />}
                      </p>
                      <p className="text-xs text-muted-foreground">Pin to the top of the blog.</p>
                    </div>
                    <Switch checked={data.featured} onCheckedChange={(v) => set("featured", v)} />
                  </div>
                  {data.id && (
                    <dl className="space-y-1.5 text-[13px] text-muted-foreground">
                      {data.authorName && <div className="flex justify-between"><dt>Author</dt><dd className="font-medium text-foreground">{data.authorName}</dd></div>}
                      {data.createdAt && <div className="flex justify-between"><dt>Created</dt><dd>{data.createdAt}</dd></div>}
                      {data.updatedAt && <div className="flex justify-between"><dt>Updated</dt><dd>{data.updatedAt}</dd></div>}
                    </dl>
                  )}
                </div>
              </section>

              <section>
                <SectionLabel>Template</SectionLabel>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {POST_TEMPLATES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => set("template", t.value)}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-all",
                        data.template === t.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-muted-foreground/40 hover:bg-muted/40",
                      )}
                    >
                      <TemplateThumb kind={t.value} active={data.template === t.value} />
                      <p className="mt-2 text-[13px] font-semibold text-foreground">{t.label}</p>
                      <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <SectionLabel>Search appearance</SectionLabel>
                <div className="mt-3 rounded-xl border border-border bg-muted/30 p-3.5">
                  <p className="truncate text-[15px] font-medium leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">
                    {(data.seoTitle || data.title || "Post title").slice(0, 70)}
                  </p>
                  <p className="truncate text-xs text-[#006621] dark:text-[#bdc1c6]">
                    /blog/{data.slug || suggestedSlug || "…"}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
                    {(data.seoDesc || data.excerpt || "Add an excerpt or SEO description…").slice(0, 170)}
                  </p>
                </div>
                <div className="mt-3 space-y-3">
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
                </div>
              </section>

              {data.id && (
                <section>
                  <SectionLabel className="text-destructive">Danger zone</SectionLabel>
                  <div className="mt-3 rounded-xl border border-destructive/30 p-4">
                    <p className="mb-3 text-xs text-muted-foreground">Permanently delete this post. This cannot be undone.</p>
                    <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10" onClick={() => { setSettingsOpen(false); setDeleteOpen(true); }}>
                      <Trash2 className="size-4" /> Delete post
                    </Button>
                  </div>
                </section>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* ===== Image insert dialog ===== */}
        <ImageInsertDialog
          open={imgDialogOpen}
          onClose={() => setImgDialogOpen(false)}
          onInsert={(md) => insertBlock(md)}
        />

        {/* ===== Delete confirmation ===== */}
        <Dialog open={deleteOpen} onOpenChange={(o) => !o && setDeleteOpen(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete post?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              “{data.title || "Untitled post"}” will be permanently deleted. This cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>Cancel</Button>
              <Button variant="destructive" onClick={remove} disabled={deleting}>
                {deleting ? <><Loader2 className="size-4 animate-spin" /> Deleting…</> : <><Trash2 className="size-4" /> Delete</>}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

/* ---------- small pieces ---------- */

function SaveIndicator({ state, lastSaved }: { state: SaveState; lastSaved: Date | null }) {
  if (state === "saving")
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" /> <span className="hidden sm:inline">Saving…</span>
      </span>
    );
  if (state === "dirty")
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
        <span className="size-1.5 rounded-full bg-amber-500" /> <span className="hidden sm:inline">Unsaved</span>
      </span>
    );
  return (
    <span className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground sm:flex">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      {lastSaved ? `Saved ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Saved"}
    </span>
  );
}

/* Reusable upload button: a styled <label> wrapping a hidden file input. */
function UploadButton({
  onUploaded, accept, className, children,
}: {
  onUploaded: (url: string) => void;
  accept?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [busy, setBusy] = React.useState(false);
  return (
    <label className={cn(busy && "pointer-events-none opacity-70", className)}>
      {busy ? <Loader2 className="size-5 animate-spin" /> : children}
      <input
        type="file"
        className="hidden"
        accept={accept}
        disabled={busy}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setBusy(true);
          try {
            onUploaded(await uploadFile(file));
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed");
          } finally {
            setBusy(false);
          }
        }}
      />
    </label>
  );
}

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-xs font-bold uppercase tracking-widest text-muted-foreground", className)}>
      {children}
    </h3>
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

/* ---------- image insert dialog ---------- */

function ImageInsertDialog({ open, onClose, onInsert }: { open: boolean; onClose: () => void; onInsert: (md: string) => void }) {
  const [url, setUrl] = React.useState("");
  const [alt, setAlt] = React.useState("");

  const insert = (src: string) => {
    if (!src.trim()) return;
    onInsert(`![${alt.trim() || "image"}](${src.trim()})`);
    setUrl("");
    setAlt("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <UploadButton
            accept=".png,.jpg,.jpeg,.webp,.gif"
            onUploaded={(url) => insert(url)}
            className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-8 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <ImagePlus className="size-5" />
            Click to upload an image
          </UploadButton>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Separator className="flex-1" /> or paste a link <Separator className="flex-1" />
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" spellCheck={false} />
            </div>
            <div className="space-y-1.5">
              <Label>Alt text</Label>
              <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => insert(url)} disabled={!url.trim()}>Insert image</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- preview helpers ---------- */

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

/** Styled Markdown primitives for the preview pane. */
const mdComponents = {
  h1: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="mb-4 mt-10 text-4xl font-extrabold tracking-tight text-foreground first:mt-0" {...p} />,
  h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="mb-3 mt-10 text-3xl font-bold tracking-tight text-foreground" {...p} />,
  h3: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="mb-2 mt-8 text-2xl font-bold text-foreground" {...p} />,
  h4: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h4 className="mb-2 mt-6 text-xl font-semibold text-foreground" {...p} />,
  p: (p: React.HTMLAttributes<HTMLParagraphElement>) => <p className="my-5 text-[17px] leading-[1.8] text-foreground/90" {...p} />,
  a: (p: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a className="font-medium text-primary underline underline-offset-2" {...p} />,
  ul: (p: React.HTMLAttributes<HTMLUListElement>) => <ul className="my-5 list-disc space-y-2 pl-6 text-[17px] text-foreground/90" {...p} />,
  ol: (p: React.HTMLAttributes<HTMLOListElement>) => <ol className="my-5 list-decimal space-y-2 pl-6 text-[17px] text-foreground/90" {...p} />,
  li: (p: React.HTMLAttributes<HTMLLIElement>) => <li className="leading-relaxed" {...p} />,
  blockquote: (p: React.HTMLAttributes<HTMLElement>) => (
    <blockquote className="my-6 rounded-r-xl border-l-4 border-primary/60 bg-primary/5 px-5 py-4 text-[17px] text-foreground/90 [&>p]:my-1" {...p} />
  ),
  code: (p: React.HTMLAttributes<HTMLElement>) => <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground" {...p} />,
  pre: (p: React.HTMLAttributes<HTMLPreElement>) => <pre className="my-6 overflow-x-auto rounded-xl border border-border bg-muted/60 p-4 font-mono text-[13px] leading-relaxed [&>code]:bg-transparent [&>code]:p-0" {...p} />,
  hr: (p: React.HTMLAttributes<HTMLHRElement>) => <hr className="my-10 border-border" {...p} />,
  table: (p: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-border"><table className="w-full text-[15px]" {...p} /></div>
  ),
  th: (p: React.HTMLAttributes<HTMLTableCellElement>) => <th className="border-b border-border bg-muted/60 px-3 py-2 text-left font-semibold text-foreground" {...p} />,
  td: (p: React.HTMLAttributes<HTMLTableCellElement>) => <td className="border-b border-border px-3 py-2 align-top text-foreground/90 last:border-0" {...p} />,
  img: (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img className="my-6 rounded-xl border border-border" loading="lazy" {...p} />,
  strong: (p: React.HTMLAttributes<HTMLElement>) => <strong className="font-bold text-foreground" {...p} />,
};

/** Visual glyph representing each template layout. */
function TemplateThumb({ kind, active }: { kind: string; active: boolean }) {
  const c = active ? "bg-primary" : "bg-muted-foreground/40";
  return (
    <div className="grid h-14 place-items-center rounded-lg border border-border bg-background">
      <div className="flex w-10 flex-col gap-1">
        {kind === "STANDARD" && <><div className={cn("h-1.5 w-6", c)} /><div className="flex gap-1"><div className={cn("h-4 w-1.5", c)} /><div className="h-4 flex-1 rounded-sm bg-muted" /></div></>}
        {kind === "TECHNICAL_GUIDE" && <div className="flex gap-1"><div className={cn("h-5 w-2", c)} /><div className="h-5 flex-1 rounded-sm bg-muted" /></div>}
        {kind === "CASE_STUDY" && <><div className={cn("h-2 w-full", c)} /><div className="flex gap-1"><div className="h-3 flex-1 rounded-sm bg-muted" /><div className="h-3 flex-1 rounded-sm bg-muted" /></div></>}
        {kind === "LISTICLE" && <><div className={cn("h-1.5 w-3 rounded-full", c)} /><div className="h-1.5 w-full rounded-sm bg-muted" /><div className={cn("h-1.5 w-3 rounded-full", c)} /><div className="h-1.5 w-full rounded-sm bg-muted" /></>}
        {kind === "EDITORIAL" && <><div className="mx-auto h-1.5 w-4 rounded-sm bg-muted" /><div className={cn("mx-auto h-3 w-3", c)} /><div className="mx-auto h-1.5 w-6 rounded-sm bg-muted" /></>}
      </div>
    </div>
  );
}
