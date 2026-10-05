"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { signIn, signOut } from "@/auth";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export type AuthActionResult = { ok: boolean; message: string; errors?: Record<string, string> };

export async function authenticate(_prev: AuthActionResult | null, formData: FormData): Promise<AuthActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  // Only allow same-origin relative redirects — never bounce to an external URL.
  const rawCallback = String(formData.get("callbackUrl") ?? "");
  const callbackUrl = rawCallback.startsWith("/") && !rawCallback.startsWith("//") ? rawCallback : undefined;

  const parsed = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse({ email, password });
  if (!parsed.success) return { ok: false, message: "Enter a valid email and password." };

  const lower = email.toLowerCase();

  // This sign-in is for administrators only — the client portal is gone.
  const account = await prisma.user.findUnique({ where: { email: lower }, select: { role: true } });
  if (!account) return { ok: false, message: "Invalid email or password." };
  if (account.role !== "ADMIN" && account.role !== "STAFF") {
    return { ok: false, message: "This sign-in is for administrators only." };
  }

  try {
    await signIn("credentials", {
      email: lower,
      password,
      redirectTo: callbackUrl || "/admin",
    });
    return { ok: true, message: "Signed in" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, message: "Invalid email or password." };
    }
    // Next.js redirect throws — re-throw so it propagates.
    throw error;
  }
}

/** Demo accounts for the one-click login buttons. Never sent to the browser. */
const DEMO_ACCOUNTS: Record<string, { email: string; password: string }> = {
  admin: { email: "admin@draftingstudio.example", password: "Admin123!" },
};

/**
 * Sign in as a seeded demo account from a key alone, so the passwords stay on
 * the server instead of shipping in the client bundle. Refuses outright in
 * production — a one-click admin login must never exist on the live site.
 */
export async function demoLogin(key: string): Promise<AuthActionResult> {
  if (process.env.NODE_ENV === "production") {
    return { ok: false, message: "Demo logins are disabled here." };
  }
  const demo = DEMO_ACCOUNTS[key];
  if (!demo) return { ok: false, message: "Unknown demo account." };

  const fd = new FormData();
  fd.set("email", demo.email);
  fd.set("password", demo.password);
  return authenticate(null, fd);
}

