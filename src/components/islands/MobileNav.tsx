/**
 * Disparador del modo SIDEBAR (< md) — 06-components.md.
 *
 * Igual que NavDropdown, la isla no contiene los enlaces: solo el botón y el
 * estado. La diferencia está en los requisitos de accesibilidad del panel a
 * pantalla completa:
 *   - ATRAPA el foco mientras está abierto,
 *   - el resto de la página queda `inert`,
 *   - cierra con Esc y devuelve el foco al disparador.
 *
 * `inert` se aplica al <main> y al <footer>, no al header: el botón de cerrar
 * vive en el header y quedaría inalcanzable.
 */
import { useEffect, useRef, useState } from 'react';

import { focusables, useNavPanel } from './useNavPanel';

interface Props {
  labelOpen: string;
  labelClose: string;
}

export default function MobileNav({ labelOpen, labelClose }: Props) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panel = useNavPanel(open);

  useEffect(() => {
    const outside = Array.from(
      document.querySelectorAll<HTMLElement>('main, footer'),
    );

    if (!open || !panel) {
      outside.forEach((el) => el.removeAttribute('inert'));
      return;
    }

    outside.forEach((el) => el.setAttribute('inert', ''));
    focusables(panel)[0]?.focus();

    const close = () => {
      setOpen(false);
      buttonRef.current?.focus();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      // Trampa de foco: el tabulado nunca sale del panel mientras está abierto.
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
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      outside.forEach((el) => el.removeAttribute('inert'));
    };
  }, [open, panel]);

  return (
    <button
      ref={buttonRef}
      type="button"
      className="nav-trigger nav-trigger--mobile border-interactive text-fg-secondary hover:text-accent-text hover:border-accent-border h-11 min-w-11 items-center justify-center rounded-sm border px-3 font-mono text-xs transition-colors"
      aria-expanded={open}
      aria-controls="site-nav"
      onClick={() => setOpen((value) => !value)}
    >
      {open ? labelClose : labelOpen}
    </button>
  );
}
