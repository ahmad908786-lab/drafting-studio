"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";
import { MessageThread, type ThreadMessage } from "@/components/portal/message-thread";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { sendQuoteMessage, respondToQuote } from "@/app/actions/portal";

export function QuoteMessages({
  quoteId,
  messages,
  status,
  quotedAmount,
}: {
  quoteId: string;
  messages: ThreadMessage[];
  status: string;
  quotedAmount: number | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState<string | null>(null);

  const respond = async (decision: "accept" | "decline") => {
    setBusy(decision);
    await respondToQuote(quoteId, decision);
    toast.success(decision === "accept" ? "Quote accepted" : "Quote declined");
    setBusy(null);
    router.refresh();
  };

  const canRespond = status === "QUOTED" && quotedAmount != null;

  return (
    <div className="space-y-4">
      {canRespond && (
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
          <p className="text-sm font-semibold text-foreground">Your quote: <span className="font-mono text-lg">{formatCurrency(quotedAmount)}</span></p>
          <p className="mt-0.5 text-xs text-muted-foreground">Review and respond below.</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="accent" onClick={() => respond("accept")} disabled={!!busy}>
              {busy === "accept" ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Accept
            </Button>
            <Button size="sm" variant="outline" onClick={() => respond("decline")} disabled={!!busy}>
              {busy === "decline" ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />} Decline
            </Button>
          </div>
        </div>
      )}
      <MessageThread
        messages={messages}
        emptyLabel="Ask us anything about this quote."
        onSend={(body) => sendQuoteMessage(quoteId, body)}
      />
    </div>
  );
}
