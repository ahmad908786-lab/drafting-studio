type Stat = { value: string; label: string };

export function StatBand({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-card px-6 py-8 text-center">
          <div className="font-sans text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
            {s.value}
          </div>
          <div className="mt-1.5 text-sm font-medium text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
