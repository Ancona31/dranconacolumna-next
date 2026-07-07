import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { WHATSAPP_DEFAULT_MESSAGE } from "@/lib/nav";

export default function MobileActionBar() {
  const whatsappLink = buildWhatsAppLink(WHATSAPP_DEFAULT_MESSAGE);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink/10 md:hidden">
      <Link
        href="/evaluacion"
        className="flex-1 bg-primary py-4 text-center font-body text-sm font-semibold text-white transition duration-150 active:scale-[0.985]"
      >
        Hacer mi evaluación
      </Link>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-whatsapp py-4 text-center font-body text-sm font-semibold text-white transition duration-150 active:scale-[0.985]"
      >
        WhatsApp
      </a>
    </div>
  );
}
