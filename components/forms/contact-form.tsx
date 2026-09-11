"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { submitLead, type ActionResult } from "@/app/actions/leads";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Sending…" : label}
    </Button>
  );
}

export function ContactForm({
  type = "CONTACT",
  compact = false,
  submitLabel = "Send message",
  defaultSubject,
}: {
  type?: "CONTACT" | "CALLBACK";
  compact?: boolean;
  submitLabel?: string;
  defaultSubject?: string;
}) {
  const [state, action] = useActionState<ActionResult | null, FormData>(submitLead, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      toast.success(state.message);
      formRef.current?.reset();
    } else if (state && !state.ok) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <input type="hidden" name="type" value={type} />
      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-1.5">
          <Label htmlFor="cf-name">Name</Label>
          <Input id="cf-name" name="name" placeholder="Your name" />
          {state?.errors?.name && <p className="text-xs text-destructive">{state.errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cf-email">Email *</Label>
          <Input id="cf-email" name="email" type="email" placeholder="you@company.com" required />
          {state?.errors?.email && <p className="text-xs text-destructive">{state.errors.email}</p>}
        </div>
      </div>

      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-1.5">
          <Label htmlFor="cf-phone">Phone</Label>
          <Input id="cf-phone" name="phone" type="tel" placeholder="(555) 555-5555" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cf-company">Company</Label>
          <Input id="cf-company" name="company" placeholder="Company name" />
        </div>
      </div>

      {defaultSubject !== undefined && (
        <div className="space-y-1.5">
          <Label htmlFor="cf-subject">Subject</Label>
          <Input id="cf-subject" name="subject" defaultValue={defaultSubject} />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="cf-message">{type === "CALLBACK" ? "What should we call about?" : "Message"}</Label>
        <Textarea id="cf-message" name="message" rows={compact ? 3 : 5} placeholder="Tell us about your project or question…" />
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
