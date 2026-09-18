import { describe, expect, it } from 'vitest';

import { formatDateRange, formatFileSize } from '@/lib/format';

describe('formatDateRange', () => {
  const start = new Date('2023-01-01');
  const end = new Date('2024-06-01');

  it('mes y año en cada idioma', () => {
    expect(formatDateRange(start, end, 'en', 'Present')).toBe('Jan 2023 – Jun 2024');
    expect(formatDateRange(start, end, 'es', 'actualidad')).toBe('ene 2023 – jun 2024');
  });

  it('sin fecha de fin usa la etiqueta de actualidad', () => {
    expect(formatDateRange(start, null, 'en', 'Present')).toBe('Jan 2023 – Present');
  });

  /**
   * Regresión potencial: formateando en hora local, en una zona al oeste de
   * UTC la fecha "2023-01-01" se mostraría como diciembre de 2022.
   */
  it('no se desplaza de mes por la zona horaria', () => {
    const firstOfMonth = new Date('2023-01-01');
    expect(formatDateRange(firstOfMonth, null, 'en', 'x')).toMatch(/^Jan 2023/);
  });
});

describe('formatFileSize', () => {
  it('KB redondeados por debajo de 1 MB', () => {
    expect(formatFileSize(84_000, 'en')).toBe('82 KB');
  });

  it('nunca muestra 0 KB', () => {
    expect(formatFileSize(300, 'en')).toBe('1 KB');
  });

  it('MB con un decimal y separador del idioma', () => {
    expect(formatFileSize(1_300_000, 'en')).toBe('1.2 MB');
    expect(formatFileSize(1_300_000, 'es')).toBe('1,2 MB');
  });
});
