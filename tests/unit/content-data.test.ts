import { describe, expect, it } from 'vitest';

import { EDUCATION } from '@/content/education';
import { LANGUAGES_SPOKEN } from '@/content/languages';
import { SKILL_GROUPS } from '@/content/skills';
import { TECH_CATALOG } from '@/content/tech';
import { missingTranslations } from '@/lib/projects';

/**
 * Los archivos TS de contenido no pasan por Zod: estos tests hacen de esquema.
 */
describe('skills.ts', () => {
  const keys = SKILL_GROUPS.flatMap((group) => group.keys);

  it('toda clave existe en el catálogo', () => {
    const catalog = new Set(TECH_CATALOG.map((tech) => tech.key));
    expect(keys.filter((key) => !catalog.has(key))).toEqual([]);
  });

  it('cubre las 25 tecnologías, cada una una sola vez', () => {
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys.length).toBe(TECH_CATALOG.length);
  });

  it('tiene los seis grupos de 10-tech-catalog.md', () => {
    expect(SKILL_GROUPS.map((group) => group.id)).toEqual([
      'languages',
      'frontend',
      'backend',
      'data',
      'infrastructure',
      'tools',
    ]);
  });
});

describe('education.ts y languages.ts', () => {
  it('todo texto traducible existe y no está vacío en ambos idiomas', () => {
    const texts = [
      ...EDUCATION.map((entry) => entry.degree),
      ...LANGUAGES_SPOKEN.flatMap((entry) => [entry.name, entry.level]),
    ];
    for (const text of texts) {
      expect(text.en.trim()).not.toBe('');
      expect(text.es.trim()).not.toBe('');
    }
  });

  it('un año de fin nunca es anterior al de inicio', () => {
    for (const entry of EDUCATION) {
      if (entry.endYear !== null) expect(entry.endYear).toBeGreaterThanOrEqual(entry.startYear);
    }
  });
});

describe('missingTranslations', () => {
  it('detecta la falta en ambos sentidos', () => {
    expect(missingTranslations(['en/a', 'es/a', 'en/b', 'es/c'])).toEqual([
      '"b" existe en inglés pero no en español.',
      '"c" existe en español pero no en inglés.',
    ]);
  });
});
