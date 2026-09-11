import Link from "next/link";
import { Info, Lightbulb, AlertTriangle, Check } from "lucide-react";
import { cn, slugify } from "@/lib/utils";

function headingId(children: React.ReactNode): string {
  const text = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
  return slugify(text);
}

/** Callout — <Callout type="tip|note|warning">text</Callout> */
function Callout({ type = "note", children }: { type?: "note" | "tip" | "warning"; children: React.ReactNode }) {
  const map = {
    note: { icon: Info, cls: "border-info/30 bg-info/5 text-foreground", ic: "text-info" },
    tip: { icon: Lightbulb, cls: "border-success/30 bg-success/5 text-foreground", ic: "text-success" },
    warning: { icon: AlertTriangle, cls: "border-warning/40 bg-warning/5 text-foreground", ic: "text-warning" },
  } as const;
  const { icon: I, cls, ic } = map[type];
  return (
    <div className={cn("my-6 flex gap-3 rounded-xl border p-4", cls)}>
      <I className={cn("mt-0.5 size-5 shrink-0", ic)} />
      <div className="text-[15px] leading-relaxed [&>p]:m-0">{children}</div>
    </div>
  );
}

/** Checklist — <Checklist items="a;b;c" /> */
function Checklist({ items }: { items: string }) {
  const list = items.split(";").map((s) => s.trim()).filter(Boolean);
  return (
    <ul className="my-6 grid gap-2 not-prose">
      {list.map((item) => (
        <li key={item} className="flex items-start gap-2.5 rounded-lg border border-border bg-card px-3.5 py-2.5 text-[15px]">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export const mdxComponents = {
  Callout,
  Checklist,
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 id={headingId(children)} className="mt-10 scroll-mt-28 font-sans text-2xl font-extrabold tracking-tight text-foreground" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 id={headingId(children)} className="mt-8 scroll-mt-28 font-sans text-xl font-bold tracking-tight text-foreground" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mt-6 font-sans text-lg font-bold text-foreground" {...props}>{children}</h4>
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-4 text-[16px] leading-relaxed text-foreground/90" {...props} />
  ),
  a: ({ href = "#", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <Link href={href} className="font-medium text-primary underline underline-offset-2 hover:text-primary/80" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-4 ml-5 list-disc space-y-1.5 text-[16px] text-foreground/90 marker:text-muted-foreground" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mt-4 ml-5 list-decimal space-y-1.5 text-[16px] text-foreground/90 marker:text-muted-foreground" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="pl-1" {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-6 border-l-4 border-accent bg-secondary/50 py-2 pl-5 pr-3 text-lg font-medium italic text-foreground" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="font-bold text-foreground" {...props} />,
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[13px] text-foreground" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="my-5 overflow-x-auto rounded-xl border border-border bg-primary p-4 font-mono text-[13px] text-primary-foreground" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className="bg-secondary" {...props} />,
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="border-b border-border px-4 py-2.5 text-left font-bold text-foreground" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-border px-4 py-2.5 text-foreground/85" {...props} />
  ),
  hr: () => <hr className="my-8 border-border" />,
};
