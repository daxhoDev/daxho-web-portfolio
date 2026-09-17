/**
 * Imágenes Open Graph — ADR-0016, fase 8.
 *
 * Rutas ESTÁTICAS: `getStaticPaths` las enumera y el build escribe los PNG. En
 * producción son archivos, no una función; por eso las OG no cuestan nada por
 * visita y no dependen de que el endpoint esté vivo.
 *
 *   /og/default.png        genérica, para todas las rutas que no son proyecto
 *   /og/{lang}/{slug}.png  una por proyecto y por idioma
 */
import type { APIRoute } from 'astro';

import { getProjects } from '@/content/queries';
import { getTechByKey } from '@/content/tech';
import { LANG_CODES } from '@/i18n/utils';
import { renderOgImage, type OgOptions } from '@/lib/og';

export const prerender = true;

/** Subtítulo de la genérica: el mismo que el hero del home en inglés. */
const SITE_SUBTITLE = 'Software Engineer · full-stack web';

export async function getStaticPaths() {
  const host = new URL(import.meta.env.SITE).host;

  const projectPaths = (
    await Promise.all(
      LANG_CODES.map(async (lang) => {
        const projects = await getProjects(lang);
        return projects.map((project) => ({
          params: { path: `${lang}/${project.slug}` },
          props: {
            options: {
              title: project.data.title,
              // Las etiquetas del catálogo, no las claves internas.
              subtitle: project.data.stack
                .map((key) => getTechByKey(key)?.label ?? key)
                .join(' · '),
              note: String(project.data.year),
              host,
            } satisfies OgOptions,
          },
        }));
      }),
    )
  ).flat();

  return [
    { params: { path: 'default' }, props: { options: { subtitle: SITE_SUBTITLE, host } } },
    ...projectPaths,
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage((props as { options: OgOptions }).options);

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      // Se genera en el build y su contenido solo cambia si cambia la ruta.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
