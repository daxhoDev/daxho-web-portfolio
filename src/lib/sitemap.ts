/**
 * Qué entra en el sitemap — ADR-0016, fase 8.
 *
 * Vive aquí, y no dentro de `astro.config.mjs`, para que sea una función pura
 * que Vitest pueda interrogar: una regla de indexación equivocada no se nota
 * mirando el sitio, solo semanas después en el buscador.
 *
 * La regla: fuera todo lo que lleva `noindex`, y fuera lo que no es una página.
 */

/** Rutas que el sitemap NUNCA debe listar, con el motivo de cada una. */
const EXCLUDED = [
  /\/styleguide\//, // no es parte del sitio público (11-styleguide.md)
  /\/contact\/(sent|error)\//, // final de un envío, no contenido (05-pages/contact.md)
  /\/og\//, // imágenes, no páginas (ADR-0016)
];

export function sitemapFilter(page: string): boolean {
  return !EXCLUDED.some((pattern) => pattern.test(page));
}
