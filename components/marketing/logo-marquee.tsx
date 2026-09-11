import Image from "next/image";

export function LogoMarquee({ logos }: { logos: { name: string; logo: string }[] }) {
  if (!logos.length) return null;
  const doubled = [...logos, ...logos];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max marquee gap-12">
        {doubled.map((l, i) => (
          <div key={`${l.name}-${i}`} className="flex h-12 w-40 shrink-0 items-center justify-center text-muted-foreground opacity-70">
            <Image src={l.logo} alt={l.name} width={160} height={56} className="h-11 w-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
