import { Upload, FileSearch, PenLine, CheckCircle2, Send } from "lucide-react";

const DEFAULT_STEPS = [
  { icon: Upload, title: "Upload & confirm", desc: "Send your plans and scope; we confirm a fixed price and date." },
  { icon: FileSearch, title: "Document review", desc: "We review inputs and flag anything missing up front." },
  { icon: PenLine, title: "2D drafting", desc: "Your set is drafted in AutoCAD to code and your CAD standard." },
  { icon: CheckCircle2, title: "Quality check", desc: "Internal QC against the code and your requirements." },
  { icon: Send, title: "Delivery", desc: "Layered DWG + plotted PDF, with two free minor revisions." },
];

export function ProcessTimeline({ turnaroundDays }: { turnaroundDays?: number }) {
  return (
    <div>
      {turnaroundDays && (
        <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wide text-accent">
          {turnaroundDays} business days — start to delivery
        </p>
      )}
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {DEFAULT_STEPS.map((s, i) => (
          <li key={s.title} className="relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                <s.icon className="size-4.5" />
              </span>
              <span className="font-mono text-xs font-bold text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="font-sans text-sm font-bold text-foreground">{s.title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
