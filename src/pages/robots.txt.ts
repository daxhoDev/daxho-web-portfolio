/**
 * robots.txt — ADR-0016, fase 8.
 *
 * Se genera en el build en vez de vivir en `public/` porque la línea `Sitemap:`
 * necesita la URL absoluta, y esa sale de `SITE_URL`: hardcodearla obligaría a
 * tocar el archivo el día que haya dominio propio (ADR-0004).
 *
 * NO se prohíbe nada con `Disallow`. Las rutas que no deben indexarse llevan
 * `noindex`, y un rastreador solo puede leer esa etiqueta si se le deja entrar:
 * bloquearlas aquí conseguiría lo contrario de lo que se busca.
 */
import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site, url }) => {
  const base = site ?? new URL('/', url);
  const sitemap = new URL('sitemap-index.xml', base).toString();

  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
