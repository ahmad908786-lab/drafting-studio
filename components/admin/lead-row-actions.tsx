"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateLeadStatus, deleteLead } from "@/app/actions/admin-misc";
import { LEAD_STATUSES } from "@/lib/taxonomy";

export function LeadRowActions({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 4000);
      return;
    }
    setConfirming(false);
    start(async () => { await deleteLead(id); toast.success("Deleted"); });
  };

  return (
    <div className="flex items-center gap-1.5">
      <Select value={status} onValueChange={(v) => start(async () => { await updateLeadStatus(id, v); toast.success("Updated"); })}>
        <SelectTrigger className="h-8 w-[120px] text-xs" disabled={pending}><SelectValue /></SelectTrigger>
        <SelectContent>{LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
      </Select>
      <Button
        variant={confirming ? "destructive" : "ghost"}
        size={confirming ? "sm" : "icon-sm"}
        className={confirming ? "h-8 text-xs" : "text-muted-foreground hover:text-destructive"}
        onClick={handleDelete}
        aria-label={confirming ? "Click again to confirm delete" : "Delete"}
        disabled={pending}
      >
        <Trash2 className="size-4" />
        {confirming ? "Sure?" : null}
      </Button>
    </div>
  );
}
