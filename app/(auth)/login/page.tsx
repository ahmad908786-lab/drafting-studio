import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { DemoLoginButtons } from "@/components/auth/demo-login-buttons";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-6 text-center">
        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-foreground">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Log in to your Drafting Studio account</p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
      {/* Demo logins are a development convenience — never render them live. */}
      {process.env.NODE_ENV !== "production" && <DemoLoginButtons />}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">Create one</Link>
      </p>
    </Card>
  );
}
