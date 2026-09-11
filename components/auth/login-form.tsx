"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authenticate, type AuthActionResult } from "@/app/actions/auth";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return <Button type="submit" className="w-full" disabled={pending}>{pending ? "Signing in…" : "Log in"}</Button>;
}

export function LoginForm() {
  const [state, action] = useActionState<AuthActionResult | null, FormData>(authenticate, null);
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      {state && !state.ok && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" /> {state.message}
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@company.com" autoComplete="email" />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</a>
        </div>
        <Input id="password" name="password" type="password" required placeholder="••••••••" autoComplete="current-password" />
      </div>
      <SubmitBtn />
    </form>
  );
}
