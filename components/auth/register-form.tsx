"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerUser, type AuthActionResult } from "@/app/actions/auth";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return <Button type="submit" className="w-full" disabled={pending}>{pending ? "Creating account…" : "Create account"}</Button>;
}

export function RegisterForm() {
  const [state, action] = useActionState<AuthActionResult | null, FormData>(registerUser, null);

  return (
    <form action={action} className="space-y-4">
      {state && !state.ok && !state.errors && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" /> {state.message}
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required placeholder="Your name" />
        {state?.errors?.name && <p className="text-xs text-destructive">{state.errors.name}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@company.com" />
        {state?.errors?.email && <p className="text-xs text-destructive">{state.errors.email}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="company">Company (optional)</Label>
        <Input id="company" name="company" placeholder="Company name" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required placeholder="8+ characters" autoComplete="new-password" />
          {state?.errors?.password && <p className="text-xs text-destructive">{state.errors.password}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm</Label>
          <Input id="confirm" name="confirm" type="password" required placeholder="Repeat password" autoComplete="new-password" />
          {state?.errors?.confirm && <p className="text-xs text-destructive">{state.errors.confirm}</p>}
        </div>
      </div>
      <SubmitBtn />
    </form>
  );
}
