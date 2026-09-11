"use server";

import { prisma } from "@/lib/db";
import { leadSchema, newsletterSchema } from "@/lib/validations";
import { sendMail, leadsInbox } from "@/lib/mail";

export type ActionResult = { ok: boolean; message: string; errors?: Record<string, string> };

function zodErrors(e: import("zod").ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of e.issues) {
    const key = issue.path[0]?.toString() ?? "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function submitLead(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = leadSchema.safeParse({
    type: (formData.get("type") as string) || "CONTACT",
    name: formData.get("name") || undefined,
    email: formData.get("email") || "",
    phone: formData.get("phone") || undefined,
    company: formData.get("company") || undefined,
    subject: formData.get("subject") || undefined,
    message: formData.get("message") || undefined,
    website: formData.get("website") || undefined, // honeypot
  });

  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: zodErrors(parsed.error) };
  }
  // Honeypot tripped — pretend success, drop silently.
  if (parsed.data.website) return { ok: true, message: "Thanks — we'll be in touch." };

  const { website: _hp, ...data } = parsed.data;
  await prisma.lead.create({ data });

  await sendMail({
    to: leadsInbox(),
    subject: `New ${data.type.toLowerCase()} lead${data.name ? ` from ${data.name}` : ""}`,
    text: [
      `Type: ${data.type}`,
      data.name && `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone && `Phone: ${data.phone}`,
      data.company && `Company: ${data.company}`,
      data.subject && `Subject: ${data.subject}`,
      data.message && `Message:\n${data.message}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return {
    ok: true,
    message:
      data.type === "CALLBACK"
        ? "Got it — we'll call you back shortly."
        : "Thanks for reaching out. We'll reply within one business day.",
  };
}

export async function subscribeNewsletter(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get("email") || "",
    website: formData.get("website") || undefined,
  });
  if (!parsed.success) return { ok: false, message: "Enter a valid email address." };
  if (parsed.data.website) return { ok: true, message: "You're subscribed!" };

  const existing = await prisma.lead.findFirst({
    where: { email: parsed.data.email, type: "NEWSLETTER" },
  });
  if (!existing) {
    await prisma.lead.create({ data: { type: "NEWSLETTER", email: parsed.data.email } });
  }
  return { ok: true, message: "You're subscribed — thanks!" };
}
