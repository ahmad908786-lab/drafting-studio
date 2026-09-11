"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateLeadStatus, deleteLead } from "@/app/actions/admin-misc";
import { LEAD_STATUSES } from "@/lib/taxonomy";

export function LeadRowActions({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex items-center gap-1.5">
      <Select value={status} onValueChange={(v) => start(async () => { await updateLeadStatus(id, v); toast.success("Updated"); })}>
        <SelectTrigger className="h-8 w-[120px] text-xs" disabled={pending}><SelectValue /></SelectTrigger>
        <SelectContent>{LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
      </Select>
      <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" onClick={() => { if (confirm("Delete lead?")) start(async () => { await deleteLead(id); toast.success("Deleted"); }); }} aria-label="Delete">
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
