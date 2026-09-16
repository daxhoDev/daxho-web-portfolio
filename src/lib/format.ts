/**
 * Formato de fechas y tamaños según idioma. Funciones puras, objetivo de Vitest.
 */
import type { Lang } from '@/i18n/utils';

const LOCALES: Record<Lang, string> = { en: 'en-US', es: 'es-ES' };

/**
 * "Jan 2023 – Present" / "ene 2023 – actualidad".
 *
 * Mes y año, sin día: en una trayectoria profesional el día no aporta nada y
 * alarga la línea. Se formatea en UTC porque las fechas del frontmatter son
 * fechas sin hora; en otra zona horaria "2023-01-01" podría mostrarse como
 * diciembre de 2022.
 */
export function formatDateRange(
  start: Date,
  end: Date | null,
  lang: Lang,
  presentLabel: string,
): string {
  const format = new Intl.DateTimeFormat(LOCALES[lang], {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return `${format.format(start)} – ${end ? format.format(end) : presentLabel}`;
}

/** "84 KB" / "1,2 MB". Nunca "0 KB": un archivo existente pesa al menos 1 KB. */
export function formatFileSize(bytes: number, lang: Lang): string {
  const number = (value: number, digits: number) =>
    new Intl.NumberFormat(LOCALES[lang], { maximumFractionDigits: digits }).format(value);

  if (bytes < 1024 * 1024) return `${number(Math.max(1, Math.round(bytes / 1024)), 0)} KB`;
  return `${number(bytes / (1024 * 1024), 1)} MB`;
}
