import { Icon } from "@/components/icon";

type Pillar = { title: string; desc: string; icon: string };

export function ValuePillars({ pillars }: { pillars: Pillar[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {pillars.map((p) => (
        <div key={p.title} className="rounded-xl border border-border bg-card p-5 text-center shadow-[var(--shadow-card)]">
          <div className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-accent/15 text-accent">
            <Icon name={p.icon} className="size-6" />
          </div>
          <h3 className="font-sans text-base font-bold text-foreground">{p.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
        </div>
      ))}
    </div>
  );
}
