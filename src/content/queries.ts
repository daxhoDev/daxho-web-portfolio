/**
 * Consultas a la colección `projects`.
 *
 * Aquí se aplican, en el build, las reglas del conjunto de 04-content-model.md
 * (la lógica pura está en `src/lib/projects.ts` y tiene sus tests). Cualquier
 * incumplimiento LANZA: el build falla y la página no se genera con contenido
 * inconsistente.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

import type { Lang } from '@/i18n/utils';
import {
  isPublished,
  neighbors,
  parseProjectId,
  sortProjects,
  validateProjectSet,
} from '@/lib/projects';

export type Project = CollectionEntry<'projects'> & { lang: Lang; slug: string };

let cache: Promise<Project[]> | undefined;

/** Todas las entradas publicadas en este entorno, ya validadas. */
function loadPublished(): Promise<Project[]> {
  // Se valida una sola vez por build, no una vez por página generada.
  cache ??= (async () => {
    const entries = await getCollection('projects', (entry) =>
      isPublished(entry.data.draft, process.env.VERCEL_ENV),
    );

    const errors = validateProjectSet(entries);
    if (errors.length > 0) {
      throw new Error(
        `Contenido de projects inválido (04-content-model.md):\n  - ${errors.join('\n  - ')}`,
      );
    }

    return entries.map((entry) => ({ ...entry, ...parseProjectId(entry.id) }));
  })();
  return cache;
}

/** Proyectos de un idioma, en el orden de la galería. */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const all = await loadPublished();
  return sortProjects(all.filter((project) => project.lang === lang));
}

/** Rutas estáticas del detalle para un idioma, con sus vecinos ya resueltos. */
export async function getProjectPaths(lang: Lang) {
  const list = await getProjects(lang);
  return list.map((project, index) => ({
    params: { slug: project.slug },
    props: { project, ...neighbors(list, index) },
  }));
}
