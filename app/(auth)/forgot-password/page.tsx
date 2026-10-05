import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-6 text-center">
        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-foreground">Reset your password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your account email and we&rsquo;ll send you a reset link.
        </p>
      </div>
      <ForgotPasswordForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/admin" className="font-semibold text-primary hover:underline">← Back to login</Link>
      </p>
    </Card>
  );
}
