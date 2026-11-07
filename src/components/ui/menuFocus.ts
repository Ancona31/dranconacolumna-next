/**
 * Tab dentro de un menú que vive en un portal (al final del <body>): el foco
 * debe seguir desde el botón que lo abrió, como si el menú estuviera junto a
 * él (patrón ARIA menu button). Devuelve el control siguiente (o anterior con
 * Mayús) al botón en el orden de tabulación de la página, o null.
 */
export function tabbableNextTo(
  anchor: HTMLElement,
  backwards: boolean,
): HTMLElement | null {
  const candidates = document.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]',
  );
  const order = Array.from(candidates).filter(
    (el) =>
      el.tabIndex >= 0 &&
      el.getClientRects().length > 0 &&
      // Fuera de los popups en portal, de las guardas de foco que la
      // librería pone junto al portal y de lo que deja inerte.
      !el.closest("[data-base-ui-portal], [data-base-ui-focus-guard], [inert]"),
  );
  const index = order.indexOf(anchor);
  if (index === -1) return null;
  return order[backwards ? index - 1 : index + 1] ?? null;
}
