/**
 * Toggle de tema de tres estados — ADR-0011.
 *
 * REGLA CRÍTICA: al hidratarse lee el estado REAL de localStorage, nunca asume
 * un valor por defecto. Si asumiera 'light', el botón mostraría un estado que
 * no coincide con lo que se está viendo en pantalla.
 */
import { useEffect, useState } from 'react';
import {
  DARK_MEDIA_QUERY,
  applyResolvedTheme,
  nextPreference,
  readStoredPreference,
  resolveTheme,
  writeStoredPreference,
  type ThemePreference,
} from '@/lib/theme';

/**
 * Textos por defecto en inglés. El header pasa los del idioma activo: la isla
 * no importa los diccionarios para no meter todas las traducciones en el JS del
 * cliente.
 */
const DEFAULT_LABELS: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

interface Props {
  labels?: Record<ThemePreference, string>;
  /** Plantilla del nombre accesible; `{state}` se sustituye por el estado activo. */
  ariaTemplate?: string;
}

const ICONS: Record<ThemePreference, string> = {
  light: 'M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4l1.4-1.4M17 7l1.4-1.4',
  dark: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z',
  system: 'M4 5h16v10H4zM9 19h6M12 15v4',
};

export default function ThemeToggle({
  labels = DEFAULT_LABELS,
  ariaTemplate = 'Theme: {state}. Click to change.',
}: Props) {
  // `null` hasta hidratar: evita renderizar un estado inventado.
  const [preference, setPreference] = useState<ThemePreference | null>(null);

  useEffect(() => {
    setPreference(readStoredPreference() ?? 'system');
  }, []);

  // Cuando la preferencia es 'system', el tema debe seguir al sistema operativo
  // EN VIVO: si el usuario cambia el tema del SO, la página lo refleja sin
  // recargar.
  useEffect(() => {
    if (preference !== 'system') return;
    const media = window.matchMedia(DARK_MEDIA_QUERY);
    const sync = () => applyResolvedTheme(resolveTheme('system', media.matches));
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [preference]);

  function cycle() {
    const current = preference ?? 'system';
    const next = nextPreference(current);
    setPreference(next);
    writeStoredPreference(next);
    applyResolvedTheme(resolveTheme(next, window.matchMedia(DARK_MEDIA_QUERY).matches));
  }

  const active = preference ?? 'system';

  return (
    <button
      type="button"
      onClick={cycle}
      className="border-interactive text-fg-secondary hover:text-accent-text hover:border-accent-border inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-sm border px-3 font-mono text-xs transition-colors"
      // El área táctil mínima de 44x44 (h-11) es requisito de 07-conventions.md
      aria-label={ariaTemplate.replace('{state}', labels[active])}
      data-theme-preference={preference ?? undefined}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={ICONS[active]} />
      </svg>
      {/* aria-hidden porque el estado ya lo anuncia el aria-label del botón.
          En móvil solo se ve el icono: el header no tiene sitio para el texto
          junto a la marca, el selector de idioma y la hamburguesa. */}
      <span className="hidden md:inline" aria-hidden="true">
        {labels[active]}
      </span>
    </button>
  );
}
