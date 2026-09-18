/**
 * Formación — 04-content-model.md, 05-pages/about.md.
 *
 * Archivo TS tipado: son pocas líneas sin cuerpo largo. Los textos traducibles
 * van en los dos idiomas en la misma entrada.
 *
 * `endYear: null` significa EN CURSO, que es la verdad: la titulación está
 * prevista para enero de 2027. Aquí no se adelanta un título que aún no existe.
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
    id: 'universidad-de-holguin',
    institution: 'Universidad de Holguín',
    degree: {
      en: 'Computer Engineering — expected January 2027',
      es: 'Ingeniería Informática — titulación prevista en enero de 2027',
    },
    startYear: 2022,
    endYear: null,
    draft: false,
  },
];
