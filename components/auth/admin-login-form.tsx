"use client";

import { useActionState } from "react";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/site/logo";
import { authenticate, type AuthActionResult } from "@/app/actions/auth";
import { DemoLoginButtons } from "@/components/auth/demo-login-buttons";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in…" : "Log in"}
    </Button>
  );
}

/**
 * Admin sign-in, rendered directly at /admin (no redirect to a separate
 * login page). After sign-in the user lands back on the admin page they
 * were trying to reach.
 */
export function AdminLoginForm() {
  const [state, action] = useActionState<AuthActionResult | null, FormData>(authenticate, null);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-5 flex items-center gap-2 font-sans text-2xl font-extrabold tracking-tight text-foreground">
            <ShieldCheck className="size-6 text-primary" /> Admin Login
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in with your administrator email and password
          </p>
        </div>
        <form action={action} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={pathname} />
          {state && !state.ok && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" /> {state.message}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              required
              placeholder="you@draftingstudio.org"
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="admin-password">Password</Label>
              <a href="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot?
              </a>
            </div>
            <Input
              id="admin-password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <SubmitBtn />
        </form>
        {process.env.NODE_ENV !== "production" && <DemoLoginButtons />}
      </Card>
    </div>
  );
}
