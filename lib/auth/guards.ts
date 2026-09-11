import { redirect } from "next/navigation";
import { auth } from "@/auth";

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
  companyId: string | null;
};

/** Returns the current session user or null. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  return (session?.user as SessionUser | undefined) ?? null;
}

/** Require any signed-in user; redirect to /login otherwise. */
export async function requireUser(callbackUrl = "/portal"): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return user;
}

/** Require ADMIN or STAFF; clients are redirected to their portal. */
export async function requireStaff(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/admin");
  if (user.role !== "ADMIN" && user.role !== "STAFF") redirect("/portal");
  return user;
}

/** Require ADMIN specifically. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/admin");
  if (user.role !== "ADMIN") redirect("/admin");
  return user;
}

export function isStaff(role?: string | null): boolean {
  return role === "ADMIN" || role === "STAFF";
}

/**
 * Company scope for client-portal queries. A CLIENT is locked to their own
 * companyId; staff/admin pass `null` meaning "no restriction". Every portal
 * data fetch must funnel through this so a client can never read another
 * company's rows even by guessing an id.
 */
export function companyScope(user: SessionUser): { companyId: string } | Record<string, never> {
  if (user.role === "CLIENT") {
    return { companyId: user.companyId ?? "__none__" };
  }
  return {};
}
