"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/guards";
import { slugify } from "@/lib/utils";
import { PROJECT_STAGES } from "@/lib/taxonomy";

type ProjectInput = {
  id?: string;
  title: string;
  slug?: string;
  summary: string;
  bodyMdx?: string;
  industrySlug?: string;
  disciplineSlugs: string[];
  serviceSlugs: string[];
  city?: string;
  state?: string;
  sizeSqft?: number;
  floors?: number;
  year?: number;
  coverImage?: string;
  isPublic: boolean;
  featured: boolean;
  status?: string;
  stage?: string;
  companyId?: string;
  dueDate?: string;
};

export async function saveProject(input: ProjectInput): Promise<{ ok: boolean; id?: string; message?: string }> {
  const user = await requireStaff();
  if (!input.title?.trim()) return { ok: false, message: "Title is required" };

  const industry = input.industrySlug ? await prisma.industry.findUnique({ where: { slug: input.industrySlug }, select: { id: true } }) : null;
  const disciplines = await prisma.discipline.findMany({ where: { slug: { in: input.disciplineSlugs } }, select: { id: true } });
  const services = await prisma.service.findMany({ where: { slug: { in: input.serviceSlugs } }, select: { id: true } });
  const progress = PROJECT_STAGES.find((s) => s.value === input.stage)?.pct ?? 0;

  const data = {
    title: input.title.trim(),
    summary: input.summary?.trim() || input.title.trim(),
    bodyMdx: input.bodyMdx ?? "",
    city: input.city || null,
    state: input.state || null,
    sizeSqft: input.sizeSqft ?? null,
    floors: input.floors ?? null,
    year: input.year ?? null,
    coverImage: input.coverImage || null,
    isPublic: input.isPublic,
    featured: input.featured,
    status: input.status ?? "ACTIVE",
    stage: input.stage ?? "KICKOFF",
    progress: input.isPublic ? 0 : progress,
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
    companyId: input.companyId || null,
    industryId: industry?.id ?? null,
  };

  if (input.id) {
    await prisma.project.update({
      where: { id: input.id },
      data: {
        ...data,
        disciplines: { set: disciplines.map((d) => ({ id: d.id })) },
        services: { set: services.map((s) => ({ id: s.id })) },
      },
    });
    revalidatePath(`/admin/projects/${input.id}`);
    revalidatePath("/admin/projects");
    return { ok: true, id: input.id };
  }

  const baseSlug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);
  const exists = await prisma.project.findUnique({ where: { slug: baseSlug } });
  const slug = exists ? `${baseSlug}-${Math.floor(Date.now() % 10000)}` : baseSlug;

  const project = await prisma.project.create({
    data: {
      ...data,
      slug,
      disciplines: { connect: disciplines.map((d) => ({ id: d.id })) },
      services: { connect: services.map((s) => ({ id: s.id })) },
    },
  });
  await prisma.auditLog.create({ data: { userId: user.id, action: "project.create", entity: "Project", entityId: project.id } });
  revalidatePath("/admin/projects");
  return { ok: true, id: project.id };
}

export async function deleteProject(id: string) {
  await requireStaff();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
}

export async function addProjectUpdate(projectId: string, stage: string, note: string) {
  const user = await requireStaff();
  const progress = PROJECT_STAGES.find((s) => s.value === stage)?.pct ?? undefined;
  await prisma.$transaction([
    prisma.projectUpdate.create({ data: { projectId, stage, note: note.trim() || `Moved to ${stage}`, authorId: user.id } }),
    prisma.project.update({ where: { id: projectId }, data: { stage, ...(progress != null ? { progress } : {}) } }),
  ]);
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function addProjectFile(projectId: string, file: { name: string; url: string; size: number; type?: string }, revision: string, visibleToClient: boolean) {
  const user = await requireStaff();
  await prisma.projectFile.create({
    data: { projectId, name: file.name, url: file.url, sizeBytes: file.size, mimeType: file.type, revision, visibleToClient, uploadedById: user.id },
  });
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function addProjectMessage(projectId: string, body: string) {
  const user = await requireStaff();
  if (!body.trim()) return;
  await prisma.projectMessage.create({ data: { projectId, body: body.trim(), authorId: user.id } });
  revalidatePath(`/admin/projects/${projectId}`);
}
