"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { requestPasswordReset, type AuthActionResult } from "@/app/actions/password-reset";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Sending…" : "Send reset link"}
    </Button>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useActionState<AuthActionResult | null, FormData>(requestPasswordReset, null);

  return (
    <form action={action} className="space-y-4">
      {state && (
        <div
          className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
            state.ok
              ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700"
              : "border-destructive/30 bg-destructive/5 text-destructive"
          }`}
        >
          {state.ok ? <CheckCircle2 className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
          {state.message}
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@company.com" autoComplete="email" />
      </div>
      <SubmitBtn />
    </form>
  );
}
