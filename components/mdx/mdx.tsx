import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { cn } from "@/lib/utils";

/** Server-side MDX renderer used by services, industries, projects and blog. */
export function Mdx({ source, className }: { source: string; className?: string }) {
  return (
    <div className={cn("max-w-none", className)}>
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </div>
  );
}

/** Extract H2/H3 headings for a table of contents. */
export function extractToc(source: string): { id: string; text: string; level: number }[] {
  const lines = source.split("\n");
  const toc: { id: string; text: string; level: number }[] = [];
  let inCode = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) inCode = !inCode;
    if (inCode) continue;
    const m = /^(#{2,3})\s+(.*)$/.exec(line);
    if (m) {
      const level = m[1].length;
      const text = m[2].replace(/[*_`]/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      toc.push({ id, text, level });
    }
  }
  return toc;
}
