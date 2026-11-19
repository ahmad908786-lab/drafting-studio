"use client";

import type { ReactNode } from "react";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Opens the WhatsApp chat in a new tab via JavaScript instead of a plain
 * <a href="https://wa.me/..."> link.
 *
 * Why: wa.me rate-limits automated crawlers (HTTP 429), so Semrush flagged
 * the same link as "broken" on all 92 pages that carry the floating button.
 * Real visitors were never affected, but a button keeps crawlers from
 * treating it as an external link at all. The chat itself is unchanged:
 * same number, same prefilled message.
 */
export function WhatsAppButton({
  message = "Hi Drafting Studio! I need a quote for 2D CAD drafting.",
  className,
  ariaLabel,
  title,
  children,
}: {
  message?: string;
  className?: string;
  ariaLabel?: string;
  title?: string;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => window.open(whatsappUrl(message), "_blank", "noopener,noreferrer")}
      aria-label={ariaLabel}
      title={title}
      className={className}
    >
      {children}
    </button>
  );
}
