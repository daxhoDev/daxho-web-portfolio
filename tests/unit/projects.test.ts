import { describe, expect, it } from 'vitest';

import {
  featuredProjects,
  isPublished,
  neighbors,
  parseProjectId,
  sortProjects,
  validateProjectSet,
  type ProjectEntryLike,
} from '@/lib/projects';

/**
 * 04-content-model.md y las decisiones del 2026-09-14 (DEVIATIONS.md): filtro de
 * drafts, ambos idiomas obligatorios y navegación sin vuelta.
 */

function entry(
  id: string,
  data: Partial<ProjectEntryLike['data']> = {},
): ProjectEntryLike {
  return { id, data: { featured: false, order: 1, draft: true, ...data } };
}

/** Un juego válido: 6 proyectos por idioma, 3 destacados, orden único. */
function validSet(): ProjectEntryLike[] {
  return (['en', 'es'] as const).flatMap((lang) =>
    [1, 2, 3, 4, 5, 6].map((n) =>
      entry(`${lang}/project-${n}`, {
        order: n,
        featured: n <= 3,
        featuredOrder: n <= 3 ? n : undefined,
      }),
    ),
  );
}

describe('parseProjectId', () => {
  it('separa idioma y slug de la ruta del archivo', () => {
    expect(parseProjectId('en/task-manager')).toEqual({ lang: 'en', slug: 'task-manager' });
    expect(parseProjectId('es/task-manager')).toEqual({ lang: 'es', slug: 'task-manager' });
  });

  it('rechaza un archivo fuera de una carpeta de idioma', () => {
    expect(() => parseProjectId('task-manager')).toThrow(/projects\/\{en\|es\}/);
    expect(() => parseProjectId('fr/task-manager')).toThrow();
  });
});

describe('isPublished — filtro de drafts (DEVIATIONS.md)', () => {
  it('excluye un draft SOLO en el despliegue a producción', () => {
    expect(isPublished(true, 'production')).toBe(false);
  });

  it('muestra los drafts en local y en las previews de Vercel', () => {
    // Si las previews los filtraran, la galería de las fases 4 a 9 saldría vacía.
    expect(isPublished(true, undefined)).toBe(true);
    expect(isPublished(true, 'preview')).toBe(true);
    expect(isPublished(true, 'development')).toBe(true);
  });

  it('publica siempre lo que no es draft', () => {
    expect(isPublished(false, 'production')).toBe(true);
    expect(isPublished(false, undefined)).toBe(true);
  });
});

describe('sortProjects', () => {
  it('ordena por order y desempata por slug de forma estable', () => {
    const sorted = sortProjects([
      entry('en/zeta', { order: 2 }),
      entry('en/beta', { order: 1 }),
      entry('en/alpha', { order: 2 }),
    ]);
    expect(sorted.map((e) => e.id)).toEqual(['en/beta', 'en/alpha', 'en/zeta']);
  });

  it('no muta la lista original', () => {
    const list = [entry('en/b', { order: 2 }), entry('en/a', { order: 1 })];
    sortProjects(list);
    expect(list.map((e) => e.id)).toEqual(['en/b', 'en/a']);
  });
});

describe('featuredProjects', () => {
  it('devuelve solo los destacados, ordenados por featuredOrder y no por order', () => {
    const result = featuredProjects([
      entry('en/a', { order: 1, featured: true, featuredOrder: 3 }),
      entry('en/b', { order: 2, featured: false }),
      entry('en/c', { order: 3, featured: true, featuredOrder: 1 }),
      entry('en/d', { order: 4, featured: true, featuredOrder: 2 }),
    ]);
    expect(result.map((e) => e.id)).toEqual(['en/c', 'en/d', 'en/a']);
  });
});

describe('neighbors — sin vuelta circular', () => {
  const list = ['uno', 'dos', 'tres'];

  it('el primero no tiene anterior', () => {
    expect(neighbors(list, 0)).toEqual({ prev: undefined, next: 'dos' });
  });

  it('el último no tiene siguiente', () => {
    expect(neighbors(list, 2)).toEqual({ prev: 'dos', next: undefined });
  });

  it('uno intermedio tiene ambos', () => {
    expect(neighbors(list, 1)).toEqual({ prev: 'uno', next: 'tres' });
  });

  it('un proyecto único no tiene ninguno', () => {
    expect(neighbors(['solo'], 0)).toEqual({ prev: undefined, next: undefined });
  });
});

describe('validateProjectSet', () => {
  it('acepta un juego válido', () => {
    expect(validateProjectSet(validSet())).toEqual([]);
  });

  it('exige exactamente 3 destacados por idioma', () => {
    const set = validSet().map((e) =>
      e.id === 'en/project-4' ? { ...e, data: { ...e.data, featured: true, featuredOrder: 4 } } : e,
    );
    expect(validateProjectSet(set)).toContainEqual(expect.stringContaining('[en]'));
    expect(validateProjectSet(set).join()).toMatch(/exactamente 3.*hay 4/);
  });

  it('detecta un featuredOrder repetido', () => {
    const set = validSet().map((e) =>
      e.id === 'es/project-2' ? { ...e, data: { ...e.data, featuredOrder: 1 } } : e,
    );
    expect(validateProjectSet(set).join()).toMatch(/\[es\] featuredOrder repetido/);
  });

  it('detecta un order repetido', () => {
    const set = validSet().map((e) =>
      e.id === 'en/project-6' ? { ...e, data: { ...e.data, order: 5 } } : e,
    );
    expect(validateProjectSet(set).join()).toMatch(/\[en\] valor de order repetido/);
  });

  it('exige que cada proyecto exista en ambos idiomas, en los dos sentidos', () => {
    const sinEspanol = validSet().filter((e) => e.id !== 'es/project-5');
    expect(validateProjectSet(sinEspanol)).toContain(
      '"project-5" existe en inglés pero no en español.',
    );

    const sinIngles = validSet().filter((e) => e.id !== 'en/project-5');
    expect(validateProjectSet(sinIngles)).toContain(
      '"project-5" existe en español pero no en inglés.',
    );
  });

  /**
   * Regresión: un idioma sin proyectos publicados se saltaba la validación, y
   * un despliegue a producción con todo en draft generaba una galería vacía en
   * vez de fallar. "Exactamente 3" no admite excepción para cero.
   */
  it('un conjunto vacío falla: producción con todo en draft no publica una galería vacía', () => {
    const errors = validateProjectSet([]);
    expect(errors).toContain('[en] debe haber exactamente 3 proyectos con featured: true; hay 0.');
    expect(errors).toContain('[es] debe haber exactamente 3 proyectos con featured: true; hay 0.');
  });

  it('informa de todos los errores a la vez, no solo del primero', () => {
    const roto = validSet()
      .filter((e) => e.id !== 'es/project-6')
      .map((e) => (e.id.startsWith('en/') ? { ...e, data: { ...e.data, featured: false } } : e));
    expect(validateProjectSet(roto).length).toBeGreaterThanOrEqual(2);
  });
});
