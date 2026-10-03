import { brand } from "@/lib/theme";

/** WhatsApp number in international format without "+" (for wa.me links). */
export const whatsappNumber: string = brand.contact.whatsapp;

/** Human-readable display, e.g. +92 303 0143281. */
export function whatsappDisplay(): string {
  const n = whatsappNumber;
  return `+${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5)}`;
}

/** wa.me deep link with an optional prefilled message. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
