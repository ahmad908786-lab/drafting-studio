/**
 * Where real photography lives, as opposed to the generated demo artwork.
 *
 * Kept in its own module because prisma/seed.ts runs main() on import — anything
 * that imports a helper from there would wipe and reseed the database as a side
 * effect. Import from here instead.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

const EXTENSIONS = ["webp", "jpg", "jpeg", "png"];

function findPhoto(folder: string, slug: string): string | null {
  for (const ext of EXTENSIONS) {
    if (existsSync(join(process.cwd(), "public", ...folder.split("/"), `${slug}.${ext}`))) {
      return `/${folder}/${slug}.${ext}`;
    }
  }
  return null;
}

/** Project cover photos: public/projects/<slug>.<ext> */
export const projectPhoto = (slug: string) => findPhoto("projects", slug);

/** Industry hero photos: public/generated/industries/<slug>.<ext> */
export const industryPhoto = (slug: string) => findPhoto("generated/industries", slug);

/** Blog cover photos: public/generated/blog/<slug>.<ext> */
export const blogPhoto = (slug: string) => findPhoto("generated/blog", slug);
