"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-destructive">Something went wrong</p>
      <h1 className="mt-3 font-sans text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">We hit a snag</h1>
      <p className="mt-3 max-w-md text-muted-foreground">An unexpected error occurred. Try again, and if it persists, let us know.</p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}><RotateCw className="size-4" /> Try again</Button>
        <Button asChild variant="outline"><Link href="/"><Home className="size-4" /> Home</Link></Button>
      </div>
      {error.digest && <p className="mt-4 font-mono text-xs text-muted-foreground">Ref: {error.digest}</p>}
    </div>
  );
}
