import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute inset-0 -z-10 bg-blueprint-grid opacity-40" aria-hidden />
      <header className="container-page flex h-16 items-center">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">{children}</main>
      <footer className="container-page py-6 text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">← Back to site</Link>
      </footer>
    </div>
  );
}
