import Link from "next/link";
import * as React from "react";
import { Children, isValidElement } from "react";
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

/** Flatten any React subtree to plain text. */
function flattenText(n: React.ReactNode): string {
  if (n === null || n === undefined || typeof n === "boolean") return "";
  if (typeof n === "string" || typeof n === "number") return String(n);
  if (Array.isArray(n)) return n.map(flattenText).join("");
  if (React.isValidElement(n)) {
    const props = n.props as { children?: React.ReactNode };
    return flattenText(props.children);
  }
  return "";
}

/** Drop a leading bullet and task-list marker: "- [ ] Do the thing" -> "Do the thing". */
const stripMarker = (s: string) => s.replace(/^\s*[-*+]?\s*\[[ xX]?\]\s*/, "").replace(/^\s*[-*+]\s+/, "").trim();

/**
 * Pull checklist entries out of children, whichever shape MDX produced.
 *
 * With a blank line after the opening tag the content is parsed as markdown and
 * arrives as <li> elements; without one it stays a single text node holding the
 * raw lines. Both appear in the posts, so handle each.
 */
function listItemText(node: React.ReactNode): string[] {
  const out: string[] = [];
  const walk = (n: React.ReactNode): void => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (!React.isValidElement(n)) return;
    const props = n.props as { children?: React.ReactNode };
    if (n.type === "li") {
      const t = stripMarker(flattenText(props.children));
      if (t) out.push(t);
      return;
    }
    walk(props.children);
  };
  walk(node);
  if (out.length > 0) return out;

  return flattenText(node)
    .split("\n")
    .map(stripMarker)
    .filter(Boolean);
}

/**
 * Checklist — either <Checklist items="a;b;c" /> or a wrapped task list:
 *
 *   <Checklist>
 *   - [ ] First item
 *   - [ ] Second item
 *   </Checklist>
 *
 * The wrapped form arrives as a rendered <ul>, so pull the text back out of it.
 */
function Checklist({ items, children }: { items?: string; children?: React.ReactNode }) {
  const list = items
    ? items.split(";").map((s) => s.trim()).filter(Boolean)
    : listItemText(children);
  if (list.length === 0) return null;
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

/** Inline content image — ![caption](src) renders as a figure with caption. */
function FigureImage({ src = "", alt = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <figure className="my-8">
      <span className="block overflow-hidden rounded-2xl border border-border bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="h-auto w-full object-cover" {...props} />
      </span>
      {alt ? (
        <figcaption className="mt-2.5 text-center text-sm text-muted-foreground">{alt}</figcaption>
      ) : null}
    </figure>
  );
}

export const mdxComponents = {
  Callout,
  Checklist,
  img: FigureImage,
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
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
    // A paragraph that only wraps images becomes a plain wrapper — <figure>
    // inside <p> is invalid HTML and breaks React hydration.
    const kids = Children.toArray(children);
    const hasFigure = kids.some((c) => isValidElement(c) && c.type === FigureImage);
    if (hasFigure) {
      return <div {...props}>{children}</div>;
    }
    return (
      <p className="mt-4 text-[16px] leading-relaxed text-foreground/90" {...props}>{children}</p>
    );
  },
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
