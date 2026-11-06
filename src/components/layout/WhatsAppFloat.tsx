import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { UiStrings } from "@/lib/i18n/types";
import WhatsAppLink from "@/components/analytics/WhatsAppLink";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function WhatsAppFloat({ strings }: { strings: UiStrings }) {
  const whatsappLink = buildWhatsAppLink(strings.whatsappDefaultMessage);

  return (
    <WhatsAppLink
      href={whatsappLink}
      section="flotante"
      ariaLabel={strings.whatsappFloat.ariaLabel}
      className="wa-float fixed rounded-full bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-40 hidden md:flex"
    >
      {/* El ancla se desplaza (.wa-float, cuando aparece la StickyCtaBar) y el
          círculo interior responde al hover/pulsación: transforms separados
          para que no se pisen. */}
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-overlay transition-transform duration-150 ease-out hover:scale-105 active:scale-[0.97]">
        <WhatsAppIcon className="h-7 w-7" />
      </span>
    </WhatsAppLink>
  );
}
