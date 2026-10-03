import { POSTS } from "./content/posts";
console.log("POSTS length:", (POSTS as any[]).length);
const slugs = new Set((POSTS as any[]).map((p: any) => p.slug));
console.log("unique:", slugs.size);
