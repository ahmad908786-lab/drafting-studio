import { POSTS } from "./content/posts";
console.log("POSTS length:", POSTS.length);
const slugs = new Set(POSTS.map((p) => p.slug));
console.log("unique:", slugs.size);
