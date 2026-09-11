"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QUOTE_STATUSES } from "@/lib/taxonomy";
import { updateQuoteStatus } from "@/app/actions/admin-quotes";

export function QuoteStatusSelect({ quoteId, status }: { quoteId: string; status: string }) {
  const [pending, start] = useTransition();
  return (
    <Select
      value={status}
      onValueChange={(v) =>
        start(async () => {
          await updateQuoteStatus(quoteId, v);
          toast.success(`Status → ${QUOTE_STATUSES.find((s) => s.value === v)?.label}`);
        })
      }
    >
      <SelectTrigger className="h-8 w-[140px] text-xs" disabled={pending}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {QUOTE_STATUSES.map((s) => (
          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
