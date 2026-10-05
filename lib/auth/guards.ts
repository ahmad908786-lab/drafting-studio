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

/**
 * Require ADMIN or STAFF. Everyone else lands on /admin, which renders the
 * admin sign-in form (or an access-denied notice for signed-in non-staff).
 */
export async function requireStaff(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin");
  if (user.role !== "ADMIN" && user.role !== "STAFF") redirect("/admin");
  return user;
}

/** Require ADMIN specifically. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin");
  if (user.role !== "ADMIN") redirect("/admin");
  return user;
}

export function isStaff(role?: string | null): boolean {
  return role === "ADMIN" || role === "STAFF";
}
