"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Plus, Search, MoreHorizontal, Star, Eye, Pencil, Trash2,
  ImageIcon, CheckCircle2, FileText, Loader2, ExternalLink,
} from "lucide-react";
import { DashEmpty } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { bulkDeletePosts, deletePost, setPostsStatus, togglePostFeatured } from "@/app/actions/admin-blog";
import { POST_TEMPLATES } from "@/lib/taxonomy";
import { cn, formatDate } from "@/lib/utils";

export type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  status: string;
  featured: boolean;
  template: string;
  views: number;
  publishedAt: Date | null;
  createdAt: Date;
  category: { name: string } | null;
  author: { name: string | null } | null;
};

const STATUS_FILTERS = ["ALL", "PUBLISHED", "DRAFT", "SCHEDULED"] as const;

function statusBadge(status: string) {
  return (
    <Badge variant={status === "PUBLISHED" ? "success" : status === "DRAFT" ? "muted" : "warning"}>
      {status === "PUBLISHED" ? "Published" : status === "DRAFT" ? "Draft" : "Scheduled"}
    </Badge>
  );
}

export function BlogPostTable({ posts }: { posts: BlogPostRow[] }) {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<(typeof STATUS_FILTERS)[number]>("ALL");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = React.useState<string[] | null>(null);
  const [busy, setBusy] = React.useState(false);

  const counts = React.useMemo(() => {
    const c: Record<string, number> = { ALL: posts.length };
    for (const s of ["PUBLISHED", "DRAFT", "SCHEDULED"]) c[s] = posts.filter((p) => p.status === s).length;
    return c;
  }, [posts]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (filter === "ALL" || p.status === filter) &&
        (!q || p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)),
    );
  }, [posts, query, filter]);

  // Reset selection when the underlying list changes.
  const postIds = React.useMemo(() => posts.map((p) => p.id).join(","), [posts]);
  React.useEffect(() => setSelected(new Set()), [postIds]);

  const allVisibleSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
  const someVisibleSelected = filtered.some((p) => selected.has(p.id));

  const toggleAll = (on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((p) => (on ? next.add(p.id) : next.delete(p.id)));
      return next;
    });

  const toggleOne = (id: string, on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const runBulk = async (fn: () => Promise<{ ok: boolean; count: number }>, label: string) => {
    setBusy(true);
    try {
      const res = await fn();
      toast.success(`${label}: ${res.count} post${res.count === 1 ? "" : "s"}`);
      setSelected(new Set());
    } catch {
      toast.error("Action failed");
    }
    setBusy(false);
  };

  const doDelete = async () => {
    if (!confirmDelete) return;
    setBusy(true);
    try {
      if (confirmDelete.length === 1) {
        await deletePost(confirmDelete[0]);
        toast.success("Post deleted");
      } else {
        const res = await bulkDeletePosts(confirmDelete);
        toast.success(`${res.count} posts deleted`);
      }
      setSelected(new Set());
      setConfirmDelete(null);
    } catch {
      toast.error("Delete failed");
    }
    setBusy(false);
  };

  const doFeature = async (p: BlogPostRow) => {
    try {
      await togglePostFeatured(p.id, !p.featured);
      toast.success(p.featured ? "Removed from featured" : "Marked as featured");
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            {STATUS_FILTERS.map((s) => (
              <TabsTrigger key={s} value={s} className="gap-1.5">
                {s === "ALL" ? "All" : s === "PUBLISHED" ? "Published" : s === "DRAFT" ? "Drafts" : "Scheduled"}
                <span className="rounded-full bg-muted px-1.5 text-[11px] font-semibold text-muted-foreground">{counts[s]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search posts…" className="w-56 pl-8" />
          </div>
          <Button asChild>
            <Link href="/admin/blog/new"><Plus className="size-4" /> New post</Link>
          </Button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5">
          <span className="text-sm font-semibold text-foreground">{selected.size} selected</span>
          <Separator orientation="vertical" className="h-5" />
          <Button size="sm" variant="outline" disabled={busy} onClick={() => runBulk(() => setPostsStatus([...selected], "PUBLISHED"), "Published")}>
            <CheckCircle2 className="size-4" /> Publish
          </Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => runBulk(() => setPostsStatus([...selected], "DRAFT"), "Moved to draft")}>
            <FileText className="size-4" /> Move to draft
          </Button>
          <Button size="sm" variant="outline" disabled={busy} className="text-destructive hover:bg-destructive/10" onClick={() => setConfirmDelete([...selected])}>
            <Trash2 className="size-4" /> Delete
          </Button>
          <Button size="sm" variant="ghost" disabled={busy} onClick={() => setSelected(new Set())}>Clear</Button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        {filtered.length === 0 ? (
          <div className="p-8">
            <DashEmpty
              label={posts.length === 0 ? "No posts yet" : "No posts match your filters"}
              hint={posts.length === 0 ? "Write your first article." : "Try a different search or status filter."}
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
                    onCheckedChange={(v) => toggleAll(v === true)}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Post</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden xl:table-cell">Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell text-right">Views</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} data-state={selected.has(p.id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox checked={selected.has(p.id)} onCheckedChange={(v) => toggleOne(p.id, v === true)} aria-label={`Select ${p.title}`} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative hidden aspect-[16/9] w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted sm:block">
                        {p.coverImage ? (
                          <Image src={p.coverImage} alt="" fill className="object-cover" sizes="80px" />
                        ) : (
                          <div className="grid size-full place-items-center"><ImageIcon className="size-5 text-muted-foreground/50" /></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          {p.featured && <Star className="size-3.5 shrink-0 fill-accent text-accent" aria-label="Featured" />}
                          <Link href={`/admin/blog/${p.id}`} className="truncate font-medium text-foreground hover:text-primary">
                            {p.title}
                          </Link>
                        </div>
                        <div className="truncate text-xs text-muted-foreground">/{p.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{p.category?.name ?? "—"}</TableCell>
                  <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">
                    {POST_TEMPLATES.find((t) => t.value === p.template)?.label ?? p.template}
                  </TableCell>
                  <TableCell>{statusBadge(p.status)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-right text-sm tabular-nums text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Eye className="size-3.5" />{p.views.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell whitespace-nowrap text-xs text-muted-foreground">
                    {formatDate(p.publishedAt ?? p.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="Row actions"><MoreHorizontal className="size-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/blog/${p.id}`}><Pencil className="size-4" /> Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/blog/${p.slug}`} target="_blank"><ExternalLink className="size-4" /> View post</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => doFeature(p)}>
                          <Star className={cn("size-4", p.featured && "fill-accent text-accent")} />
                          {p.featured ? "Unfeature" : "Feature"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setConfirmDelete([p.id])}>
                          <Trash2 className="size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
          Showing {filtered.length} of {posts.length} posts
        </div>
      </div>

      {/* Delete confirmation */}
      <Dialog open={confirmDelete !== null} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {confirmDelete && confirmDelete.length > 1 ? `${confirmDelete.length} posts` : "post"}?</DialogTitle>
            <DialogDescription>
              This permanently deletes {confirmDelete && confirmDelete.length > 1 ? "these posts" : "this post"} and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)} disabled={busy}>Cancel</Button>
            <Button variant="destructive" onClick={doDelete} disabled={busy}>
              {busy ? <><Loader2 className="size-4 animate-spin" /> Deleting…</> : <><Trash2 className="size-4" /> Delete</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
