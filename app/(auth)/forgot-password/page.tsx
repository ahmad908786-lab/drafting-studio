import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-6 text-center">
        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-foreground">Reset your password</h1>
        <p className="mt-1 text-sm text-muted-foreground">Send us a note and we&apos;ll help you back in. (Automated reset coming soon.)</p>
      </div>
      <ContactForm compact type="CONTACT" submitLabel="Send reset request" defaultSubject="Password reset request" />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-semibold text-primary hover:underline">← Back to login</Link>
      </p>
    </Card>
  );
}
