import { prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";
import { brand } from "@/lib/theme";

export const dynamic = "force-dynamic";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 30,
    include: { category: true },
  });

  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${absoluteUrl(`/blog/${p.slug}`)}</link>
      <guid>${absoluteUrl(`/blog/${p.slug}`)}</guid>
      <pubDate>${p.publishedAt?.toUTCString() ?? new Date().toUTCString()}</pubDate>
      ${p.category ? `<category>${esc(p.category.name)}</category>` : ""}
      <description>${esc(p.excerpt)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(brand.name)} Blog</title>
    <link>${absoluteUrl("/blog")}</link>
    <description>${esc(brand.descriptor)}</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
