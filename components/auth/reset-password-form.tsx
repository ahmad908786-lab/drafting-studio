"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { resetPassword, type AuthActionResult } from "@/app/actions/password-reset";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Updating…" : "Set new password"}
    </Button>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState<AuthActionResult | null, FormData>(resetPassword, null);

  if (state?.ok) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" /> {state.message}
        </div>
        <Button asChild className="w-full">
          <Link href="/login">Log in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      {state && !state.ok && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" /> {state.message}
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
        {state?.errors?.password && <p className="text-xs text-destructive">{state.errors.password}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm">Confirm password</Label>
        <Input id="confirm" name="confirm" type="password" required placeholder="Repeat the password" autoComplete="new-password" />
        {state?.errors?.confirm && <p className="text-xs text-destructive">{state.errors.confirm}</p>}
      </div>
      <SubmitBtn />
    </form>
  );
}
