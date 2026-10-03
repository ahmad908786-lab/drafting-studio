import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";

/** Floating WhatsApp chat button, shown on all public site pages. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl("Hi Drafting Studio! I need a quote for 2D CAD drafting.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
