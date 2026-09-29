"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Paperclip, MoreVertical, Eye, ArrowRightLeft, FolderPlus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge, EmptyState } from "@/components/dashboard/ui";
import { QUOTE_STATUSES } from "@/lib/taxonomy";
import { formatCurrency, cn } from "@/lib/utils";
import { updateQuoteStatus, convertQuoteToProject, deleteQuotes } from "@/app/actions/admin-quotes";

export type PipelineQuote = {
  id: string;
  refNumber: string;
  status: string;
  name: string;
  email: string;
  companyName: string | null;
  serviceIds: { slug: string; name: string }[];
  quotedAmount: number | null;
  filesCount: number;
  createdAt: string;
  convertedProjectId: string | null;
};

const RANGE_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

const STATUS_DOT: Record<string, string> = {
  info: "bg-sky-500",
  warning: "bg-amber-500",
  accent: "bg-violet-500",
  success: "bg-emerald-500",
  destructive: "bg-red-500",
};

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function avatarStyle(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return { backgroundColor: `hsl(${h} 55% 90%)`, color: `hsl(${h} 45% 32%)` };
}

const menuItemClass = "text-[11px] font-semibold uppercase tracking-wider";

export function QuotePipelineTable({
  status,
  statusLabel,
  q,
  range,
  quotes,
}: {
  status: string;
  statusLabel: string;
  q: string;
  range: string;
  quotes: PipelineQuote[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [pending, start] = useTransition();

  const allSelected = quotes.length > 0 && selected.size === quotes.length;

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(quotes.map((x) => x.id)));

  const withIds = (ids: string[], fn: (list: string[]) => Promise<unknown>, doneMsg: (n: number) => string) => {
    if (ids.length === 0) return;
    start(async () => {
      try {
        await fn(ids);
        setSelected(new Set());
        toast.success(doneMsg(ids.length));
        router.refresh();
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  const bulkDelete = () => {
    const ids = [...selected];
    if (!window.confirm(`Delete ${ids.length} quote${ids.length === 1 ? "" : "s"}? This cannot be undone.`)) return;
    withIds(ids, deleteQuotes, (n) => `${n} quote${n === 1 ? "" : "s"} deleted`);
  };

  const moveQuote = (id: string, to: string) =>
    withIds([id], (list) => updateQuoteStatus(list[0], to), () => {
      const label = QUOTE_STATUSES.find((s) => s.value === to)?.label ?? to;
      return `Moved to ${label}`;
    });

  const convertQuote = (id: string) => {
    start(async () => {
      try {
        const res = await convertQuoteToProject(id);
        if (res.ok && res.projectId) {
          toast.success("Converted to project");
          router.push(`/admin/projects/${res.projectId}`);
        } else {
          toast.error(res.message ?? "Could not convert this quote.");
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  const deleteOne = (id: string, ref: string) => {
    if (!window.confirm(`Delete quote ${ref}? This cannot be undone.`)) return;
    withIds([id], deleteQuotes, () => `Quote ${ref} deleted`);
  };

  const rangeHref = (v: string) =>
    `/admin/rfqs?status=${status}&range=${v}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      {/* Card header: label + search + range + bulk delete */}
      <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
        <h2 className="text-[13px] font-bold uppercase tracking-wide">
          {statusLabel} quotes
          <span className="ml-2 font-mono text-xs font-medium text-muted-foreground tabular-nums">{quotes.length}</span>
        </h2>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <form action="/admin/rfqs" method="get" className="relative">
            <input type="hidden" name="status" value={status} />
            <input type="hidden" name="range" value={range} />
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={q} placeholder="Search…" className="h-8 w-40 pl-8 text-xs" />
          </form>
          <Select value={range} onValueChange={(v) => router.push(rangeHref(v))}>
            <SelectTrigger className="h-8 w-32 text-[11px] font-semibold uppercase tracking-wide">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANGE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            disabled={pending || selected.size === 0}
            onClick={bulkDelete}
            className="h-8 text-[11px] font-semibold uppercase tracking-wide"
          >
            Delete{selected.size > 0 ? ` (${selected.size})` : ""}
          </Button>
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="p-8">
          <EmptyState icon="Inbox" title={`No ${statusLabel.toLowerCase()} quotes`} hint="New website requests will appear here." />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={allSelected ? true : selected.size > 0 ? "indeterminate" : false}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wide">Quote</TableHead>
              <TableHead className="text-right text-[11px] font-semibold uppercase tracking-wide">Amount</TableHead>
              <TableHead className="hidden text-[11px] font-semibold uppercase tracking-wide sm:table-cell">Files</TableHead>
              <TableHead className="hidden text-[11px] font-semibold uppercase tracking-wide md:table-cell">Received</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wide">Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((qt) => (
              <TableRow key={qt.id} className={cn("transition-colors hover:bg-secondary/40", selected.has(qt.id) && "bg-secondary/40")}>
                <TableCell className="pl-4">
                  <Checkbox checked={selected.has(qt.id)} onCheckedChange={() => toggle(qt.id)} aria-label={`Select ${qt.refNumber}`} />
                </TableCell>
                <TableCell>
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="grid size-10 shrink-0 place-items-center rounded-md text-base font-bold"
                      style={avatarStyle(qt.name)}
                      aria-hidden
                    >
                      {qt.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/rfqs/${qt.id}`)}
                        className="block max-w-full truncate text-left text-sm font-medium hover:underline"
                      >
                        {qt.name}
                      </button>
                      <div className="truncate font-mono text-[11px] text-muted-foreground">{qt.refNumber}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {[qt.companyName, qt.serviceIds.slice(0, 2).map((s) => s.name).join(", ")]
                          .filter(Boolean)
                          .join(" · ") || qt.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-sm tabular-nums">
                  {qt.quotedAmount != null ? formatCurrency(qt.quotedAmount) : <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {qt.filesCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Paperclip className="size-3" />{qt.filesCount}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="hidden whitespace-nowrap text-xs text-muted-foreground md:table-cell">
                  {timeAgo(qt.createdAt)}
                </TableCell>
                <TableCell><StatusBadge status={qt.status} /></TableCell>
                <TableCell className="pr-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Actions for ${qt.refNumber}`}
                        className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <MoreVertical className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem className={menuItemClass} onSelect={() => router.push(`/admin/rfqs/${qt.id}`)}>
                        <Eye className="mr-2 size-3.5" /> View details
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className={menuItemClass}>
                          <ArrowRightLeft className="mr-2 size-3.5" /> Move to
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {QUOTE_STATUSES.map((s) => (
                            <DropdownMenuItem
                              key={s.value}
                              disabled={pending || s.value === qt.status}
                              className={menuItemClass}
                              onSelect={() => moveQuote(qt.id, s.value)}
                            >
                              <span className={cn("mr-2 size-2 rounded-full", STATUS_DOT[s.color] ?? "bg-muted")} />
                              {s.label}
                              {s.value === qt.status && <span className="ml-auto text-muted-foreground">✓</span>}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuItem
                        className={menuItemClass}
                        disabled={pending || !!qt.convertedProjectId}
                        onSelect={() => convertQuote(qt.id)}
                      >
                        <FolderPlus className="mr-2 size-3.5" />
                        {qt.convertedProjectId ? "Converted" : "Convert to project"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className={cn(menuItemClass, "text-destructive focus:text-destructive")}
                        disabled={pending}
                        onSelect={() => deleteOne(qt.id, qt.refNumber)}
                      >
                        <Trash2 className="mr-2 size-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
