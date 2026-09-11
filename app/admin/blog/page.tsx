import Link from "next/link";
import { Plus, ArrowUpRight, Star } from "lucide-react";
import { DashHeader, DashEmpty } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { POST_TEMPLATES } from "@/lib/taxonomy";

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({ orderBy: [{ status: "asc" }, { createdAt: "desc" }], include: { category: true, author: { select: { name: true } } } });

  return (
    <div>
      <DashHeader title="Blog" description="Articles, guides and case studies.">
        <Button asChild size="sm"><Link href="/admin/blog/new"><Plus className="size-4" /> New post</Link></Button>
      </DashHeader>

      <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        {posts.length === 0 ? (
          <div className="p-6"><DashEmpty label="No posts yet" hint="Write your first article." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Template</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {p.featured && <Star className="size-3.5 shrink-0 fill-accent text-accent" />}
                      <span className="font-medium text-foreground">{p.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{POST_TEMPLATES.find((t) => t.value === p.template)?.label ?? p.template}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{p.category?.name ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "PUBLISHED" ? "success" : p.status === "DRAFT" ? "muted" : "warning"}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{formatDate(p.publishedAt ?? p.createdAt)}</TableCell>
                  <TableCell><Button asChild variant="ghost" size="icon-sm"><Link href={`/admin/blog/${p.id}`} aria-label="Edit"><ArrowUpRight className="size-4" /></Link></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
