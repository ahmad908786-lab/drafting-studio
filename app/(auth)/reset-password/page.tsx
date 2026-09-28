import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Set a new password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-6 text-center">
        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-foreground">Set a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose a new password for your account.</p>
      </div>
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-center text-sm text-destructive">
          This reset link is missing its token.{" "}
          <Link href="/forgot-password" className="font-semibold underline">Request a new one</Link>.
        </p>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-semibold text-primary hover:underline">← Back to login</Link>
      </p>
    </Card>
  );
}
