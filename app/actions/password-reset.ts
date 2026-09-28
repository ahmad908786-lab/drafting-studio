"use server";

import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { sendMail } from "@/lib/mail";
import type { AuthActionResult } from "./auth";

// Re-exported so the reset forms can type their useActionState against this module.
export type { AuthActionResult };

const TOKEN_BYTES = 32;
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function baseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return process.env.NEXTAUTH_URL ?? (host ? `${proto}://${host}` : "");
}

export async function requestPasswordReset(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const parsed = z.object({ email: z.string().email() }).safeParse({ email: String(formData.get("email") ?? "") });
  // Always respond the same way so we don't reveal which emails are registered.
  const done: AuthActionResult = {
    ok: true,
    message: "If an account exists for that email, a reset link is on its way (valid for 1 hour).",
  };
  if (!parsed.success) return { ok: false, message: "Enter a valid email address." };

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) return done;

  // Invalidate older tokens, then issue a fresh one.
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  const token = randomBytes(TOKEN_BYTES).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });

  const url = `${await baseUrl()}/reset-password?token=${token}`;
  await sendMail({
    to: email,
    subject: "Reset your Drafting Studio password",
    text: `Hi ${user.name ?? "there"},\n\nUse the link below to set a new password. It expires in 1 hour.\n\n${url}\n\nIf you didn't ask for this, you can ignore this email.`,
  });

  return done;
}

const resetSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Use at least 8 characters").max(200),
    confirm: z.string().min(1),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

export async function resetPassword(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const parsed = resetSchema.safeParse({
    token: String(formData.get("token") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirm: String(formData.get("confirm") ?? ""),
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0]?.toString() ?? "form";
      if (!errors[k]) errors[k] = issue.message;
    }
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }

  const { token, password } = parsed.data;
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { ok: false, message: "This reset link is invalid or has expired. Request a new one." };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash: await hashPassword(password) },
    }),
    prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } }),
  ]);

  return { ok: true, message: "Password updated — you can log in now." };
}
