"use server";

import { prisma } from "@/lib/db";
import { leadSchema, newsletterSchema } from "@/lib/validations";
import { sendMail, leadsInbox } from "@/lib/mail";
import { brand } from "@/lib/theme";

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

/**
 * Meeting request from the header's "Book A Meeting" dialog.
 *
 * Stored as a CALLBACK lead so it lands in the existing admin Leads list; the
 * requested slot and topic are folded into the subject and message, since the
 * Lead model has no scheduling columns of its own.
 */
export async function requestMeeting(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const preferredDate = String(formData.get("preferredDate") ?? "").trim();
  const preferredTime = String(formData.get("preferredTime") ?? "").trim();
  const topic = String(formData.get("topic") ?? "").trim();
  const timeZone = String(formData.get("timeZone") ?? "").trim();
  const notes = String(formData.get("message") ?? "").trim();

  const slot = [preferredDate, preferredTime].filter(Boolean).join(" at ");
  const when = slot && timeZone ? `${slot} (${timeZone})` : slot;

  // Name and phone are optional on leadSchema (the contact form and newsletter
  // share it), but an appointment needs someone to call, so require them here.
  const required: Record<string, string> = {};
  if (!String(formData.get("name") ?? "").trim()) required.name = "Your name is required.";
  if (!String(formData.get("phone") ?? "").trim()) required.phone = "A phone number is required.";

  const parsed = leadSchema.safeParse({
    type: "CALLBACK",
    name: formData.get("name") || undefined,
    email: formData.get("email") || "",
    phone: formData.get("phone") || undefined,
    company: formData.get("company") || undefined,
    subject: when ? `Meeting request — ${when}` : "Meeting request",
    message: [
      slot && `Requested slot: ${slot}`,
      timeZone && `Time zone: ${timeZone}`,
      topic && `Topic: ${topic}`,
      notes && `Notes:\n${notes}`,
    ]
      .filter(Boolean)
      .join("\n\n") || undefined,
    website: formData.get("website") || undefined, // honeypot
  });

  if (!parsed.success || Object.keys(required).length > 0) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: { ...(parsed.success ? {} : zodErrors(parsed.error)), ...required },
    };
  }
  if (parsed.data.website) return { ok: true, message: "Thanks — we'll be in touch." };

  const { website: _hp, ...data } = parsed.data;
  await prisma.lead.create({ data });

  await sendMail({
    to: leadsInbox(),
    subject: `Meeting request${data.name ? ` from ${data.name}` : ""}${when ? ` — ${when}` : ""}`,
    text: [
      data.name && `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone && `Phone: ${data.phone}`,
      data.company && `Company: ${data.company}`,
      slot && `Requested slot: ${slot}`,
      timeZone && `Time zone: ${timeZone}`,
      topic && `Topic: ${topic}`,
      notes && `Notes:\n${notes}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  // Confirmation to whoever booked. Never let a mail failure lose the lead —
  // it is already saved, and the studio has its own copy.
  const details = [
    slot && `  Requested slot: ${slot}`,
    timeZone && `  Time zone: ${timeZone}`,
    topic && `  Topic: ${topic}`,
    data.phone && `  Phone: ${data.phone}`,
    data.company && `  Company: ${data.company}`,
    notes && `  Your notes: ${notes}`,
  ].filter((line): line is string => Boolean(line));

  try {
    await sendMail({
      to: data.email,
      subject: `We received your meeting request${when ? ` — ${when}` : ""}`,
      text: [
        `Hi ${data.name},`,
        "",
        `Thanks for booking time with ${brand.name}. Here's what we have:`,
        "",
        ...details,
        "",
        "This is a request, not a confirmed booking yet. One of our drafters will",
        "reply within one business day to confirm the slot or offer the nearest",
        "alternative, and you'll get a calendar invite once it's set.",
        "",
        `Need us sooner? Email us at ${brand.contact.email} or reply to this email.`,
        "",
        `— ${brand.name}`,
        brand.contact.email,
      ].join("\n"),
    });
  } catch (err) {
    console.error("[requestMeeting] confirmation email failed:", err);
  }

  return { ok: true, message: when ? `Request sent for ${when}. A confirmation is on its way to ${data.email}.` : `Request sent. A confirmation is on its way to ${data.email}.` };
}
