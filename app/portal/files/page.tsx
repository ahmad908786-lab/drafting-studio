import Link from "next/link";
import { FileText, Download } from "lucide-react";
import { DashHeader, DashEmpty } from "@/components/dashboard/ui";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { requireUser } from "@/lib/auth/guards";
import { getPortalFiles } from "@/lib/portal";
import { formatDate } from "@/lib/utils";

export default async function PortalFilesPage() {
  const user = await requireUser();
  const files = await getPortalFiles(user);

  return (
    <div>
      <DashHeader title="Files" description="Every deliverable and shared file across your projects." />
      {files.length === 0 ? (
        <DashEmpty label="No files yet" hint="Deliverables appear here as your projects progress." />
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead className="hidden sm:table-cell">Project</TableHead>
                <TableHead className="hidden md:table-cell">Rev</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>
                    <span className="flex items-center gap-2"><FileText className="size-4 text-primary" /> <span className="font-medium text-foreground">{f.name}</span></span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">
                    <Link href={`/portal/projects/${f.project.id}`} className="text-muted-foreground hover:text-primary">{f.project.title}</Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell"><span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{f.revision}</span></TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(f.createdAt)}</TableCell>
                  <TableCell><a href={f.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"><Download className="size-4" /> Get</a></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
