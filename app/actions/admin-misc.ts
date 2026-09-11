"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/guards";

/* ---- Leads ---- */
export async function updateLeadStatus(id: string, status: string) {
  await requireStaff();
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/leads");
}
export async function deleteLead(id: string) {
  await requireStaff();
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
}

/* ---- Services ---- */
export async function saveService(input: {
  id: string;
  shortDesc: string;
  heroCopy: string;
  bodyMdx: string;
  turnaroundDays: number;
  startingPrice: number | null;
  priceNote: string;
  published: boolean;
  deliverables: string[];
}) {
  await requireStaff();
  await prisma.service.update({
    where: { id: input.id },
    data: {
      shortDesc: input.shortDesc,
      heroCopy: input.heroCopy,
      bodyMdx: input.bodyMdx,
      turnaroundDays: input.turnaroundDays,
      startingPrice: input.startingPrice,
      priceNote: input.priceNote || null,
      published: input.published,
      deliverables: input.deliverables,
    },
  });
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true };
}

/* ---- Industries ---- */
export async function saveIndustry(input: { id: string; shortDesc: string; bodyMdx: string; painPoints: string[] }) {
  await requireStaff();
  await prisma.industry.update({
    where: { id: input.id },
    data: { shortDesc: input.shortDesc, bodyMdx: input.bodyMdx, painPoints: input.painPoints },
  });
  revalidatePath("/admin/industries");
  revalidatePath("/industries");
  return { ok: true };
}

/* ---- Testimonials ---- */
export async function saveTestimonial(input: { id?: string; author: string; role: string; company: string; quote: string; rating: number; featured: boolean }) {
  await requireStaff();
  const data = { author: input.author, role: input.role || null, company: input.company || null, quote: input.quote, rating: input.rating, featured: input.featured };
  if (input.id) await prisma.testimonial.update({ where: { id: input.id }, data });
  else await prisma.testimonial.create({ data });
  revalidatePath("/admin/content");
  return { ok: true };
}
export async function deleteTestimonial(id: string) {
  await requireStaff();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/content");
}

/* ---- Team ---- */
export async function saveTeamMember(input: { id?: string; name: string; role: string; bio: string; photo?: string }) {
  await requireStaff();
  const data = { name: input.name, role: input.role, bio: input.bio || null, photo: input.photo || null };
  if (input.id) await prisma.teamMember.update({ where: { id: input.id }, data });
  else await prisma.teamMember.create({ data });
  revalidatePath("/admin/content");
  return { ok: true };
}
export async function deleteTeamMember(id: string) {
  await requireStaff();
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath("/admin/content");
}

/* ---- Media ---- */
export async function saveMediaAsset(input: { url: string; name: string; alt?: string; type?: string; size: number }) {
  const user = await requireStaff();
  await prisma.mediaAsset.create({
    data: { url: input.url, name: input.name, alt: input.alt, mimeType: input.type, sizeBytes: input.size, uploadedById: user.id },
  });
  revalidatePath("/admin/media");
}
export async function deleteMediaAsset(id: string) {
  await requireStaff();
  await prisma.mediaAsset.delete({ where: { id } });
  revalidatePath("/admin/media");
}

/* ---- Settings ---- */
export async function saveSettings(input: {
  brand: string;
  tagline: string;
  phones: string[];
  emails: string[];
  stats: { value: string; label: string }[];
}) {
  await requireStaff();
  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", brand: input.brand, tagline: input.tagline, phones: input.phones, emails: input.emails, stats: input.stats },
    update: { brand: input.brand, tagline: input.tagline, phones: input.phones, emails: input.emails, stats: input.stats },
  });
  revalidatePath("/", "layout");
  return { ok: true };
}
