"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter, type ActionResult } from "@/app/actions/leads";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="accent" size="sm" disabled={pending} aria-label="Subscribe">
      {pending ? "…" : <ArrowRight className="size-4" />}
    </Button>
  );
}

export function NewsletterForm() {
  const [state, action] = useActionState<ActionResult | null, FormData>(subscribeNewsletter, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      toast.success(state.message);
      ref.current?.reset();
    } else if (state && !state.ok) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex gap-2">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <Input name="email" type="email" required placeholder="you@company.com" className="flex-1" aria-label="Email address" />
      <SubmitBtn />
    </form>
  );
}
