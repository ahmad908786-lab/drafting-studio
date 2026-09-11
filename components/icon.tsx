import * as Lucide from "lucide-react";
import type { LucideProps } from "lucide-react";

/**
 * Render a lucide icon by its string name (as stored in taxonomy/seed data).
 * Falls back to a neutral square if the name is unknown.
 */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp =
    (Lucide as unknown as Record<string, React.ComponentType<LucideProps>>)[name] ??
    Lucide.Square;
  return <Cmp {...props} />;
}
