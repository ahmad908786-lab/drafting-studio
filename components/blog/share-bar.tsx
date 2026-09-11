"use client";

import * as React from "react";
import { Link2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ShareBar({ title, className }: { title: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const share = (network: "linkedin" | "x") => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    const href =
      network === "linkedin"
        ? `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        : `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Share</span>
      <button onClick={() => share("linkedin")} aria-label="Share on LinkedIn" className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" /></svg>
      </button>
      <button onClick={() => share("x")} aria-label="Share on X" className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
      </button>
      <button onClick={copy} aria-label="Copy link" className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
        {copied ? <Check className="size-4 text-success" /> : <Link2 className="size-4" />}
      </button>
    </div>
  );
}
