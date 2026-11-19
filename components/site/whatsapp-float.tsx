import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { WhatsAppButton } from "@/components/site/whatsapp-button";

/** Floating WhatsApp chat button, shown on all public site pages. */
export function WhatsAppFloat() {
  return (
    <WhatsAppButton
      ariaLabel="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 cursor-pointer items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
    >
      <WhatsAppIcon className="size-7" />
    </WhatsAppButton>
  );
}
