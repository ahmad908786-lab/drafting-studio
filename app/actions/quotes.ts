"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { quoteSchema } from "@/lib/validations";
import { sendMail, leadsInbox } from "@/lib/mail";
import { absoluteUrl } from "@/lib/utils";

export type QuoteResult =
  | { ok: true; refNumber: string }
  | { ok: false; message: string; errors?: Record<string, string> };

async function generateRef(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `DS-${year}-`;
  const count = await prisma.quote.count({ where: { refNumber: { startsWith: prefix } } });
  return `${prefix}${String(count + 1).padStart(4, "0")}`;
}

export async function createQuote(raw: unknown): Promise<QuoteResult> {
  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0]?.toString() ?? "form";
      if (!errors[k]) errors[k] = issue.message;
    }
    return { ok: false, message: "Please review the highlighted fields.", errors };
  }
  const data = parsed.data;
  if (data.website) return { ok: true, refNumber: "DS-0000-0000" }; // honeypot

  // Snapshot service names for the record.
  const services = await prisma.service.findMany({
    where: { slug: { in: data.serviceSlugs } },
    select: { slug: true, name: true },
  });
  const serviceSnapshot = services.map((s) => ({ slug: s.slug, name: s.name }));

  // Link to a logged-in user, or an existing account with the same email.
  const session = await auth();
  let companyId: string | undefined;
  if (session?.user?.companyId) {
    companyId = session.user.companyId;
  } else {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
      select: { companyId: true },
    });
    if (existing?.companyId) companyId = existing.companyId;
  }

  const industry = data.industrySlug
    ? await prisma.industry.findUnique({ where: { slug: data.industrySlug }, select: { id: true } })
    : null;

  const refNumber = await generateRef();

  await prisma.quote.create({
    data: {
      refNumber,
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      companyName: data.companyName,
      userId: session?.user?.id,
      companyId,
      industryId: industry?.id,
      serviceIds: serviceSnapshot,
      projectType: data.projectType,
      state: data.state,
      sizeSqft: data.sizeSqft,
      floors: data.floors,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      budgetRange: data.budgetRange,
      description: data.description,
      source: "website",
      files: data.fileKeys?.length
        ? { create: data.fileKeys.map((f) => ({ name: f.name, url: f.url, sizeBytes: f.size, mimeType: f.type })) }
        : undefined,
    },
  });

  // Notify the studio + confirm to the requester.
  const serviceList = serviceSnapshot.map((s) => s.name).join(", ");
  await sendMail({
    to: leadsInbox(),
    subject: `New RFQ ${refNumber} — ${data.name}`,
    text: [
      `Reference: ${refNumber}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone && `Phone: ${data.phone}`,
      data.companyName && `Company: ${data.companyName}`,
      `Services: ${serviceList}`,
      data.state && `State: ${data.state}`,
      data.sizeSqft && `Size: ${data.sizeSqft} sq ft`,
      data.budgetRange && `Budget: ${data.budgetRange}`,
      data.deadline && `Deadline: ${data.deadline}`,
      data.description && `\nDetails:\n${data.description}`,
      data.fileKeys?.length && `\nFiles: ${data.fileKeys.length} attached`,
    ].filter(Boolean).join("\n"),
  });

  await sendMail({
    to: data.email,
    subject: `We received your quote request (${refNumber})`,
    text: `Hi ${data.name},\n\nThanks for your request. Your reference number is ${refNumber}. We'll reply with a fixed quote within one business day.\n\nTrack it any time by creating an account at ${absoluteUrl("/register")} with this email.\n\n— Drafting Studio`,
  });

  return { ok: true, refNumber };
}
