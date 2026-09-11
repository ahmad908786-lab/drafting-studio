import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

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
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">Create one</Link>
      </p>
      <div className="mt-6 rounded-lg border border-border bg-secondary/40 p-3 text-center text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">Demo accounts</p>
        <p className="mt-1">Admin: admin@draftingstudio.example / Admin123!</p>
        <p>Client: client@acme.example / Client123!</p>
      </div>
    </Card>
  );
}
