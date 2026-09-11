"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate, initials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type ThreadMessage = { id: string; body: string; createdAt: Date; fromClient: boolean; authorName: string | null };

export function MessageThread({
  messages,
  onSend,
  emptyLabel = "No messages yet.",
}: {
  messages: ThreadMessage[];
  onSend: (body: string) => Promise<void>;
  emptyLabel?: string;
}) {
  const router = useRouter();
  const [body, setBody] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const send = async () => {
    if (!body.trim()) return;
    setBusy(true);
    await onSend(body);
    setBody("");
    setBusy(false);
    router.refresh();
  };

  return (
    <div className="flex flex-col">
      <div className="mb-3 max-h-80 space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 && <p className="text-sm text-muted-foreground">{emptyLabel}</p>}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex gap-2.5", m.fromClient && "flex-row-reverse")}>
            <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold", m.fromClient ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary")}>
              {initials(m.fromClient ? "You" : m.authorName ?? "DS")}
            </span>
            <div className={cn("max-w-[75%] rounded-2xl px-3.5 py-2 text-sm", m.fromClient ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground")}>
              <p>{m.body}</p>
              <p className={cn("mt-1 text-[10px]", m.fromClient ? "text-primary-foreground/60" : "text-muted-foreground")}>{m.fromClient ? "You" : m.authorName ?? "Studio"} · {formatDate(m.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t border-border pt-3">
        <Input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a message…" onKeyDown={(e) => e.key === "Enter" && send()} />
        <Button size="icon" onClick={send} disabled={busy} aria-label="Send">{busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}</Button>
      </div>
    </div>
  );
}
