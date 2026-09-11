import { PageHero } from "@/components/shared/page-hero";
import { brand } from "@/lib/theme";

/** Shared shell for legal pages. Content is placeholder — have counsel review. */
export function LegalPage({
  title,
  sections,
}: {
  title: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={title}
        description={`Last updated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: title }]}
        size="compact"
      />
      <section className="py-14">
        <div className="container-page max-w-3xl">
          <p className="mb-8 rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm text-muted-foreground">
            This is placeholder legal text for {brand.legalName}. Replace it with language reviewed by your own counsel before launch.
          </p>
          <div className="space-y-8">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-sans text-xl font-bold text-foreground">{s.heading}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{p}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
