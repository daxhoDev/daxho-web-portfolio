/**
 * Idiomas hablados — 04-content-model.md, 05-pages/about.md.
 *
 * El nivel de inglés es una autoevaluación declarada como tal: no hay
 * certificado detrás, y decirlo es más barato que sostenerlo en una entrevista.
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
    id: 'spanish',
    name: { en: 'Spanish', es: 'Español' },
    level: { en: 'Native', es: 'Nativo' },
    draft: false,
  },
  {
    id: 'english',
    name: { en: 'English', es: 'Inglés' },
    level: {
      en: 'Upper-intermediate (B2/C1, self-assessed)',
      es: 'Intermedio alto (B2/C1 autoevaluado)',
    },
    draft: false,
  },
];
