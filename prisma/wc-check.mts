import { POSTS } from "./content/posts";
const words = (s: string) => {
  let t = s.replace(/!\[[^\]]*\]\([^)]+\)/g, " ");
  t = t.replace(/<[^>]+>/g, " ");
  return t.replace(/[#*>`\[\]()|-]/g, " ").split(/\s+/).filter(Boolean).length;
};
let thin: string[] = [];
for (const p of POSTS) {
  const wc = words((p as any).bodyMdx ?? "");
  if (wc < 600) thin.push(`${(p as any).slug}: ${wc}`);
}
console.log("posts:", POSTS.length, "| thin (<600):", thin.length);
thin.forEach(t => console.log(" ", t));
const wcs = POSTS.map(p => words((p as any).bodyMdx ?? ""));
console.log("avg:", Math.round(wcs.reduce((a,b)=>a+b,0)/wcs.length), "min:", Math.min(...wcs), "max:", Math.max(...wcs));
