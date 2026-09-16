/**
 * Disparador y cierre del modo SIDEBAR (< md) — 06-components.md.
 *
 * La isla NO contiene los enlaces: son HTML servido por Nav.astro. Aquí viven
 * el botón de hamburguesa, el backdrop, el botón de cerrar y el estado.
 *
 * Requisitos:
 *   - El disparador es solo un icono; el nombre accesible va en `aria-label`.
 *   - Backdrop con blur detrás del panel; tocarlo cierra.
 *   - Botón X arriba a la derecha del panel. Se renderiza con un portal DENTRO
 *     de `#site-nav` para que caiga dentro de la trampa de foco; si viviera
 *     fuera, el tabulado se escaparía por él.
 *   - El fondo no hace scroll mientras está abierto.
 *   - Atrapa el foco, `inert` en el resto de la página, Esc cierra y el foco
 *     vuelve al disparador.
 *
 * DÓNDE VA EL BACKDROP, y no es arbitrario: el header es sticky con z-index y
 * crea su propio contexto de apilamiento. Un backdrop en <body> quedaría por
 * encima del header ENTERO, sidebar incluido, y el blur taparía el menú. Por
 * eso se renderiza aquí, dentro del header, un nivel por debajo del panel.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { focusables, useNavPanel } from './useNavPanel';

interface Props {
  labelOpen: string;
  labelClose: string;
}

const CLOSE_SLOT_ID = 'site-nav-close';
const MOBILE_QUERY = '(max-width: 767.98px)';

const ICON_MENU = 'M4 6h16M4 12h16M4 18h16';
const ICON_CLOSE = 'M6 6l12 12M18 6L6 18';

function Glyph({ path }: { path: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

export default function MobileNav({ labelOpen, labelClose }: Props) {
  const [open, setOpen] = useState(false);
  const [closeSlot, setCloseSlot] = useState<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panel = useNavPanel(open);

  useEffect(() => {
    setCloseSlot(document.getElementById(CLOSE_SLOT_ID));
  }, []);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  // Bloqueo de scroll del fondo e inert del resto de la página.
  useEffect(() => {
    const root = document.documentElement;
    const outside = Array.from(document.querySelectorAll<HTMLElement>('main, footer'));

    if (!open) return;

    // Al ocultar la barra de scroll el contenido se ensancharía y daría un
    // salto lateral. Se compensa con su ancho exacto.
    const gap = window.innerWidth - root.clientWidth;
    root.style.setProperty('--scrollbar-gap', `${gap}px`);
    root.setAttribute('data-nav-open', '');
    outside.forEach((el) => el.setAttribute('inert', ''));

    return () => {
      root.removeAttribute('data-nav-open');
      root.style.removeProperty('--scrollbar-gap');
      outside.forEach((el) => el.removeAttribute('inert'));
    };
  }, [open]);

  // Foco inicial, trampa de foco y Esc.
  useEffect(() => {
    if (!open || !panel) return;

    focusables(panel)[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close(true);
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusables(panel);
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, panel, close]);

  // Si la ventana crece hasta salir del modo sidebar con el panel abierto, se
  // cierra: si no, quedarían el scroll bloqueado y la página inerte sin ningún
  // panel visible que lo explique.
  useEffect(() => {
    if (!open) return;
    const media = window.matchMedia(MOBILE_QUERY);
    const onChange = () => {
      if (!media.matches) close(false);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [open, close]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="nav-trigger nav-trigger--mobile border-interactive text-fg-secondary hover:text-accent-text hover:border-accent-border h-11 w-11 items-center justify-center rounded-sm border transition-colors"
        aria-label={labelOpen}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen(true)}
      >
        <Glyph path={ICON_MENU} />
      </button>

      {/* Backdrop y botón X están SIEMPRE montados y se muestran por CSS según
          `data-open`. Si se desmontaran al cerrar, desaparecerían de golpe en
          lugar de acompañar la salida del panel. */}
      <div
        className="nav-backdrop"
        data-nav-backdrop
        data-open={open ? 'true' : 'false'}
        aria-hidden="true"
        onClick={() => close(true)}
      />

      {closeSlot &&
        createPortal(
          <button
            type="button"
            className="nav-close border-interactive text-fg-secondary hover:text-accent-text hover:border-accent-border inline-flex h-11 w-11 items-center justify-center rounded-sm border transition-colors"
            aria-label={labelClose}
            onClick={() => close(true)}
          >
            <Glyph path={ICON_CLOSE} />
          </button>,
          closeSlot,
        )}
    </>
  );
}
