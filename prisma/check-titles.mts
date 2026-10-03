import { POSTS } from "./content/posts";
for (const p of POSTS as any[]) {
  if (p.title.length > 60) console.log(p.title.length, p.slug, "|", p.title);
}
