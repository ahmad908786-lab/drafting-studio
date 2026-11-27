"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth/guards";

type CareerInput = {
  id?: string;
  title: string;
  type?: string;
  tags?: string;
  desc?: string;
  order?: number;
  published: boolean;
};

export async function saveCareer(input: CareerInput): Promise<{ ok: boolean; id?: string; message?: string }> {
  await requireStaff();
  if (!input.title?.trim()) return { ok: false, message: "Title is required" };

  const data = {
    title: input.title.trim(),
    type: input.type?.trim() || "Full-time · Remote",
    tags: (input.tags ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .join(", "),
    desc: input.desc?.trim() ?? "",
    order: input.order ?? 0,
    published: input.published,
  };

  if (input.id) {
    await prisma.career.update({ where: { id: input.id }, data });
    revalidatePath(`/admin/careers/${input.id}`);
    revalidatePath("/admin/careers");
    revalidatePath("/careers");
    return { ok: true, id: input.id };
  }

  const career = await prisma.career.create({ data });
  revalidatePath(`/admin/careers/${career.id}`);
  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  return { ok: true, id: career.id };
}

export async function deleteCareer(id: string) {
  await requireStaff();
  await prisma.career.delete({ where: { id } });
  revalidatePath("/admin/careers");
  revalidatePath("/careers");
}
