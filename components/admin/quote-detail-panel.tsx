"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send, StickyNote, DollarSign, FolderPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate } from "@/lib/utils";
import { setQuotedAmount, addQuoteNote, addQuoteMessage, convertQuoteToProject } from "@/app/actions/admin-quotes";

type Note = { id: string; body: string; createdAt: Date; author: { name: string | null } | null };
type Message = { id: string; body: string; fromClient: boolean; createdAt: Date; author: { name: string | null } | null };

export function QuoteDetailPanel({
  quoteId,
  quotedAmount,
  convertedProjectId,
  notes,
  messages,
}: {
  quoteId: string;
  quotedAmount: number | null;
  convertedProjectId: string | null;
  notes: Note[];
  messages: Message[];
}) {
  const router = useRouter();
  const [amount, setAmount] = React.useState(quotedAmount?.toString() ?? "");
  const [note, setNote] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [busy, setBusy] = React.useState<string | null>(null);

  const saveAmount = async () => {
    setBusy("amount");
    await setQuotedAmount(quoteId, amount ? Number(amount) : null);
    toast.success("Quote amount saved");
    setBusy(null);
    router.refresh();
  };
  const submitNote = async () => {
    if (!note.trim()) return;
    setBusy("note");
    await addQuoteNote(quoteId, note);
    setNote("");
    setBusy(null);
    router.refresh();
  };
  const submitMessage = async () => {
    if (!message.trim()) return;
    setBusy("msg");
    await addQuoteMessage(quoteId, message, false);
    setMessage("");
    toast.success("Message sent to client");
    setBusy(null);
    router.refresh();
  };
  const convert = async () => {
    setBusy("convert");
    const res = await convertQuoteToProject(quoteId);
    if (res.ok && res.projectId) {
      toast.success("Converted to project");
      router.push(`/admin/projects/${res.projectId}`);
    } else {
      toast.error(res.message ?? "Conversion failed");
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quote amount */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground"><DollarSign className="size-4 text-primary" /> Quoted amount</h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="pl-6 font-mono" />
          </div>
          <Button onClick={saveAmount} disabled={busy === "amount"}>{busy === "amount" ? <Loader2 className="size-4 animate-spin" /> : "Save"}</Button>
        </div>
        {quotedAmount != null && <p className="mt-2 text-xs text-muted-foreground">Current: {formatCurrency(quotedAmount)}</p>}
      </div>

      {/* Convert to project */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-foreground"><FolderPlus className="size-4 text-primary" /> Convert to project</h3>
        {convertedProjectId ? (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground">Already converted.</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => router.push(`/admin/projects/${convertedProjectId}`)}>Open project</Button>
          </div>
        ) : (
          <>
            <p className="mt-1 text-xs text-muted-foreground">Create an active client project from this RFQ, carrying over services, disciplines and details.</p>
            <Button className="mt-3 w-full" onClick={convert} disabled={busy === "convert"}>
              {busy === "convert" ? <><Loader2 className="size-4 animate-spin" /> Converting…</> : "Convert to project"}
            </Button>
          </>
        )}
      </div>

      {/* Client message thread */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground"><Send className="size-4 text-primary" /> Client messages</h3>
        <div className="mb-3 max-h-48 space-y-2 overflow-y-auto">
          {messages.length === 0 && <p className="text-xs text-muted-foreground">No messages yet. The client sees these in their portal.</p>}
          {messages.map((m) => (
            <div key={m.id} className={`rounded-lg p-2.5 text-sm ${m.fromClient ? "bg-secondary" : "bg-primary/5"}`}>
              <div className="mb-0.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{m.fromClient ? "Client" : m.author?.name ?? "Studio"}</span>
                <span>{formatDate(m.createdAt)}</span>
              </div>
              <p className="text-foreground">{m.body}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message the client…" onKeyDown={(e) => e.key === "Enter" && submitMessage()} />
          <Button size="icon" onClick={submitMessage} disabled={busy === "msg"} aria-label="Send"><Send className="size-4" /></Button>
        </div>
      </div>

      {/* Internal notes */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground"><StickyNote className="size-4 text-warning" /> Internal notes</h3>
        <div className="mb-3 space-y-2">
          {notes.length === 0 && <p className="text-xs text-muted-foreground">Private to your team.</p>}
          {notes.map((n) => (
            <div key={n.id} className="rounded-lg border border-warning/20 bg-warning/5 p-2.5 text-sm">
              <div className="mb-0.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{n.author?.name ?? "Staff"}</span><span>{formatDate(n.createdAt)}</span>
              </div>
              <p className="text-foreground">{n.body}</p>
            </div>
          ))}
        </div>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Add an internal note…" />
        <Button size="sm" variant="outline" className="mt-2" onClick={submitNote} disabled={busy === "note"}>Add note</Button>
      </div>
    </div>
  );
}
