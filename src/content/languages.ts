/**
 * Idiomas — 04-content-model.md, 05-pages/about.md.
 *
 * TODO(fase 10): idiomas y niveles reales. Relleno marcado con `draft: true`.
 */
import type { Lang } from '@/i18n/utils';

export interface LanguageEntry {
  id: string;
  name: Record<Lang, string>;
  level: Record<Lang, string>;
  draft: boolean;
}

export const LANGUAGES_SPOKEN: readonly LanguageEntry[] = [
  {
    id: 'lorem',
    name: { en: 'Lorem', es: 'Lorem' },
    level: { en: 'Lorem ipsum', es: 'Lorem ipsum' },
    draft: true,
  },
  {
    id: 'ipsum',
    name: { en: 'Ipsum', es: 'Ipsum' },
    level: { en: 'Dolor sit amet', es: 'Dolor sit amet' },
    draft: true,
  },
];
