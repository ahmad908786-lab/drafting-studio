import Link from "next/link";
import { FileText, Download } from "lucide-react";
import { PageHeader, EmptyState, Panel } from "@/components/dashboard/ui";
import { requireUser } from "@/lib/auth/guards";
import { getPortalFiles } from "@/lib/portal";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "My Files" };

function fileSize(bytes: number): string {
  if (bytes <= 0) return "—";
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

export default async function PortalFilesPage() {
  const user = await requireUser();
  const files = await getPortalFiles(user);

  const groups = new Map<string, { id: string; title: string; files: typeof files }>();
  for (const f of files) {
    const g = groups.get(f.project.id) ?? { id: f.project.id, title: f.project.title, files: [] };
    g.files.push(f);
    groups.set(f.project.id, g);
  }

  return (
    <div>
      <PageHeader title="Files" description="Every deliverable and shared file across your projects." />
      {files.length === 0 ? (
        <EmptyState
          icon="FolderOpen"
          title="No files yet"
          hint="Deliverables appear here as your projects progress."
        />
      ) : (
        <div className="space-y-5">
          {[...groups.values()].map((g) => (
            <Panel
              key={g.id}
              title={
                <Link href={`/portal/projects/${g.id}`} className="transition-colors hover:text-primary">
                  {g.title}
                </Link>
              }
              action={<span className="text-xs text-muted-foreground">{g.files.length} files</span>}
            >
              <ul className="space-y-2">
                {g.files.map((f) => (
                  <li key={f.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm">
                    <FileText className="size-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-foreground">{f.name}</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                        <span className="rounded bg-secondary px-1.5 py-0.5 font-mono tabular-nums">
                          Rev {f.revision}
                        </span>
                        <span>{fileSize(f.sizeBytes)}</span>
                        <span>{formatDate(f.createdAt)}</span>
                      </div>
                    </div>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      <Download className="size-4" /> Download
                    </a>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
