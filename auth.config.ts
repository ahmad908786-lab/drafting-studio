import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config.
 *
 * Contains NO Prisma and NO bcrypt so it can be imported by middleware (which
 * runs on the edge runtime). The credentials provider and Prisma adapter are
 * added on top of this in auth.ts, which runs only in the Node runtime.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  // Required in production: without this, Auth.js rejects all auth requests
  // with UntrustedHost on any host that isn't auto-detected (e.g. custom
  // domains, `next start` on localhost). Equivalent to AUTH_TRUST_HOST=true.
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [], // populated in auth.ts
  callbacks: {
    // Copy identity fields from the authorized user onto the JWT at sign-in,
    // then keep them on subsequent calls. No DB access needed here.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "CLIENT";
        token.companyId = (user as { companyId?: string | null }).companyId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "CLIENT";
        session.user.companyId = (token.companyId as string | null) ?? null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
