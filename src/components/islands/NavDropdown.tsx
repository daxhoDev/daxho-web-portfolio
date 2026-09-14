/**
 * Disparador del modo DROPDOWN (md - lg) — 06-components.md.
 *
 * La isla NO contiene los enlaces: son HTML servido por Nav.astro. Aquí solo
 * vive el botón y el estado abierto/cerrado, que se escribe como `data-open`
 * sobre `#site-nav`. Por eso, si esta isla no hidrata, la navegación sigue
 * siendo una lista normal y usable.
 *
 * Requisitos de accesibilidad de la spec: `aria-expanded`, `aria-controls`,
 * cierre con Esc y con clic fuera, el foco vuelve al disparador, y **tabular
 * fuera lo cierra** (a diferencia del sidebar, no atrapa el foco).
 */
import { useEffect, useRef, useState } from 'react';

import { useNavPanel } from './useNavPanel';

interface Props {
  labelOpen: string;
  labelClose: string;
}

export default function NavDropdown({ labelOpen, labelClose }: Props) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panel = useNavPanel(open);

  useEffect(() => {
    if (!open) return;

    const close = (returnFocus: boolean) => {
      setOpen(false);
      if (returnFocus) buttonRef.current?.focus();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true);
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (panel?.contains(target)) return;
      close(false);
    };

    // Tabular fuera lo cierra. `focusin` en el documento cubre tanto el tabulado
    // como cualquier foco programático.
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (panel?.contains(target)) return;
      close(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [open, panel]);

  return (
    <button
      ref={buttonRef}
      type="button"
      className="nav-trigger nav-trigger--dropdown border-interactive text-fg-secondary hover:text-accent-text hover:border-accent-border h-11 items-center rounded-sm border px-3 font-mono text-xs transition-colors"
      aria-expanded={open}
      aria-controls="site-nav"
      onClick={() => setOpen((value) => !value)}
    >
      {open ? labelClose : labelOpen}
    </button>
  );
}
