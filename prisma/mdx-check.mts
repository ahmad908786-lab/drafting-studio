import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { POSTS } from "./content/posts";

for (const p of POSTS as any[]) {
  try {
    await compileMDX({
      source: p.bodyMdx,
      options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } },
    });
  } catch (e: any) {
    console.log("MDX FAIL:", p.slug, "-", String(e.message ?? e).slice(0, 300));
  }
}
console.log("mdx check done");
