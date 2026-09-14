/**
 * Lógica pura de la colección `projects` — 04-content-model.md.
 *
 * Sin dependencias de `astro:content`: es objetivo de Vitest (09-testing.md).
 * La carga real vive en `src/content/queries.ts`, que llama a estas funciones.
 */
import { isLang, type Lang } from '@/i18n/utils';

/** Lo mínimo de una entrada que necesitan las validaciones. */
export interface ProjectEntryLike {
  id: string;
  data: {
    featured: boolean;
    featuredOrder?: number | undefined;
    order: number;
    draft: boolean;
  };
}

/**
 * `en/task-manager` → `{ lang: 'en', slug: 'task-manager' }`.
 *
 * El id lo genera el loader `glob` a partir de la ruta del archivo, que es
 * `src/content/projects/{lang}/{slug}.mdx`.
 */
export function parseProjectId(id: string): { lang: Lang; slug: string } {
  const [lang, ...rest] = id.split('/');
  const slug = rest.join('/');
  if (!isLang(lang) || !slug) {
    throw new Error(
      `Proyecto "${id}": la ruta debe ser projects/{en|es}/{slug}.mdx (04-content-model.md).`,
    );
  }
  return { lang, slug };
}

/**
 * ¿Se publica esta entrada en este entorno?
 *
 * Decisión del usuario (DEVIATIONS.md, 2026-09-14): los drafts se excluyen SOLO
 * en el despliegue a producción. En local y en las previews de Vercel se ven,
 * porque es donde se revisan las fases que trabajan con contenido de relleno.
 * La garantía de que ningún draft llega a `master` es la guarda de CI.
 */
export function isPublished(draft: boolean, vercelEnv: string | undefined): boolean {
  return !(draft && vercelEnv === 'production');
}

/** Orden de la galería: campo `order`, y el slug como desempate estable. */
export function sortProjects<T extends ProjectEntryLike>(entries: readonly T[]): T[] {
  return [...entries].sort(
    (a, b) =>
      a.data.order - b.data.order ||
      parseProjectId(a.id).slug.localeCompare(parseProjectId(b.id).slug),
  );
}

/**
 * Proyecto anterior y siguiente. **Sin vuelta circular** (decisión del usuario,
 * 2026-09-14): el primero no tiene anterior y el último no tiene siguiente.
 */
export function neighbors<T>(sorted: readonly T[], index: number): { prev?: T; next?: T } {
  return {
    prev: index > 0 ? sorted[index - 1] : undefined,
    next: index < sorted.length - 1 ? sorted[index + 1] : undefined,
  };
}

export const FEATURED_COUNT = 3;

/**
 * Validaciones que exige 04-content-model.md en el build. Devuelve la lista de
 * errores en vez de lanzar, para poder informar de TODOS a la vez: arreglar
 * contenido de uno en uno, rebuild tras rebuild, es desesperante.
 *
 * Recibe solo las entradas publicadas en el entorno: "exactamente 3 destacados"
 * se cuenta sobre lo que se publica (04-content-model.md).
 */
export function validateProjectSet(entries: readonly ProjectEntryLike[]): string[] {
  const errors: string[] = [];
  const byLang = new Map<Lang, ProjectEntryLike[]>();
  const slugsByLang = new Map<Lang, Set<string>>();

  for (const entry of entries) {
    const { lang, slug } = parseProjectId(entry.id);
    byLang.set(lang, [...(byLang.get(lang) ?? []), entry]);
    slugsByLang.set(lang, (slugsByLang.get(lang) ?? new Set()).add(slug));
  }

  const langs: Lang[] = ['en', 'es'];

  for (const lang of langs) {
    // Sin excepción para un idioma vacío: "exactamente 3" también falla con
    // cero. Si no, un despliegue a producción con todo en draft publicaría una
    // galería vacía en lugar de romper el build.
    const list = byLang.get(lang) ?? [];

    const featured = list.filter((entry) => entry.data.featured);
    if (featured.length !== FEATURED_COUNT) {
      errors.push(
        `[${lang}] debe haber exactamente ${FEATURED_COUNT} proyectos con featured: true; hay ${featured.length}.`,
      );
    }

    const featuredOrders = featured
      .map((entry) => entry.data.featuredOrder)
      .filter((value): value is number => value !== undefined);
    if (new Set(featuredOrders).size !== featuredOrders.length) {
      errors.push(`[${lang}] featuredOrder repetido entre los destacados.`);
    }

    const orders = list.map((entry) => entry.data.order);
    if (new Set(orders).size !== orders.length) {
      errors.push(`[${lang}] valor de order repetido: el orden de la galería sería ambiguo.`);
    }
  }

  // Ambos idiomas siempre, sin escapatoria (DEVIATIONS.md, 2026-09-14): sin
  // versión en español el selector de idioma llevaría a una 404.
  const [en, es] = langs.map((lang) => slugsByLang.get(lang) ?? new Set<string>());
  for (const slug of en!) {
    if (!es!.has(slug)) errors.push(`"${slug}" existe en inglés pero no en español.`);
  }
  for (const slug of es!) {
    if (!en!.has(slug)) errors.push(`"${slug}" existe en español pero no en inglés.`);
  }

  return errors;
}
