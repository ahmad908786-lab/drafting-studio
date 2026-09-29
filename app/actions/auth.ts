"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { signIn, signOut } from "@/auth";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
import { hashPassword } from "@/lib/auth/password";
import { registerSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

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

  // Land each role on the dashboard it actually owns. /portal is company-scoped,
  // so staff and admins (who have no company) would otherwise see an empty one.
  const account = await prisma.user.findUnique({ where: { email: lower }, select: { role: true } });
  const home = account?.role === "ADMIN" || account?.role === "STAFF" ? "/admin" : "/portal";

  try {
    await signIn("credentials", {
      email: lower,
      password,
      redirectTo: callbackUrl || home,
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
  client: { email: "client@acme.example", password: "Client123!" },
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

export async function registerUser(_prev: AuthActionResult | null, formData: FormData): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") || undefined,
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0]?.toString() ?? "form";
      if (!errors[k]) errors[k] = issue.message;
    }
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }
  const { name, email, company, password } = parsed.data;
  const lower = email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: lower } });
  if (existing) return { ok: false, message: "An account with that email already exists.", errors: { email: "Email already registered" } };

  const passwordHash = await hashPassword(password);

  // Create/attach a company, then link any prior quotes made with this email.
  let companyId: string | undefined;
  if (company) {
    const slug = `${slugify(company)}-${Math.floor((Date.now() % 100000))}`;
    const co = await prisma.company.create({ data: { name: company, slug } });
    companyId = co.id;
  }

  const user = await prisma.user.create({
    data: { name, email: lower, passwordHash, role: "CLIENT", companyId },
  });

  // Link existing quotes submitted with this email to the new user/company.
  await prisma.quote.updateMany({
    where: { email: lower, userId: null },
    data: { userId: user.id, ...(companyId ? { companyId } : {}) },
  });

  // Sign them in.
  try {
    await signIn("credentials", { email: lower, password, redirectTo: "/portal" });
    return { ok: true, message: "Account created" };
  } catch (error) {
    if (error instanceof AuthError) return { ok: true, message: "Account created — please log in." };
    throw error;
  }
}
