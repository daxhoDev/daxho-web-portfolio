/**
 * Formación — 04-content-model.md, 05-pages/resume.md.
 *
 * Archivo TS tipado: son pocas líneas sin cuerpo largo. Los textos traducibles
 * van en los dos idiomas en la misma entrada.
 *
 * TODO(fase 10): formación real. Relleno marcado con `draft: true`.
 */
import type { Lang } from '@/i18n/utils';

export interface EducationEntry {
  id: string;
  institution: string;
  degree: Record<Lang, string>;
  startYear: number;
  /** `null` = en curso. */
  endYear: number | null;
  draft: boolean;
}

export const EDUCATION: readonly EducationEntry[] = [
  {
    id: 'lorem-university',
    institution: 'Lorem Ipsum University',
    degree: { en: 'Lorem ipsum dolor sit amet', es: 'Lorem ipsum dolor sit amet' },
    startYear: 2016,
    endYear: 2020,
    draft: true,
  },
];
