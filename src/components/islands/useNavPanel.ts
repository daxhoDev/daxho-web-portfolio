/**
 * Puente entre las islas de navegación y el <nav> que sirve Astro.
 *
 * Los enlaces NO viven en React (06-components.md: "los enlaces deben existir
 * en el HTML, no inyectarse"). Las islas solo escriben `data-open` sobre
 * `#site-nav`, y este hook centraliza ese contacto con el DOM externo.
 */
import { useEffect, useRef, useState } from 'react';

export const NAV_ID = 'site-nav';

export function useNavPanel(open: boolean): HTMLElement | null {
  const [panel, setPanel] = useState<HTMLElement | null>(null);
  const touched = useRef(false);

  useEffect(() => {
    setPanel(document.getElementById(NAV_ID));
  }, []);

  useEffect(() => {
    if (!panel) return;

    // NO SE ESCRIBE AL MONTAR, y esto no es una optimización.
    //
    // Los dos disparadores (NavDropdown y MobileNav) apuntan al mismo
    // `#site-nav`, y con `client:idle` no hay garantía de cuál hidrata antes.
    // Si cada uno escribiera su estado inicial al montar, el que llegara
    // segundo pisaría al primero: abrir el sidebar y verlo cerrarse solo en
    // cuanto hidratara el otro.
    //
    // Escribiendo solo tras un cambio real, el estado inicial lo fija el HTML
    // servido (`data-open="false"`) y cada isla solo toca el atributo cuando
    // el usuario ha actuado sobre ella.
    if (!touched.current) {
      if (!open) return;
      touched.current = true;
    }

    panel.setAttribute('data-open', open ? 'true' : 'false');
  }, [panel, open]);

  return panel;
}

/** Elementos tabulables dentro de un contenedor, en orden de documento. */
export function focusables(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => el.offsetParent !== null || el === document.activeElement);
}
