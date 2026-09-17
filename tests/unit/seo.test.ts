/**
 * SEO y OG — ADR-0016, fase 8 (13-roadmap.md).
 *
 * Lo que se prueba aquí es lo que un navegador no enseña: que las URL del
 * JSON-LD coinciden con las canónicas, que el contenido de relleno no se cuela
 * en los datos estructurados, que un título hostil no puede cerrar el
 * `<script>`, y que la imagen OG sale con el tamaño y los colores del sitio.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import { OG_COLORS, OG_SIZE, renderOgImage } from '@/lib/og';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  personJsonLd,
  projectJsonLd,
  serializeJsonLd,
  PERSON_ID,
} from '@/lib/seo';
import { sitemapFilter } from '@/lib/sitemap';

const SITE = 'https://daxho.dev';

function readRepoFile(relative: string): string {
  return readFileSync(fileURLToPath(new URL(`../../${relative}`, import.meta.url)), 'utf8');
}

describe('absoluteUrl', () => {
  it('cierra con barra las rutas de página, como la canónica y el sitemap', () => {
    expect(absoluteUrl(SITE, '/projects')).toBe('https://daxho.dev/projects/');
    expect(absoluteUrl(SITE, '/es/projects/uno')).toBe('https://daxho.dev/es/projects/uno/');
    expect(absoluteUrl(SITE, '/')).toBe('https://daxho.dev/');
  });

  it('no toca los archivos: una barra ahí rompe el enlace', () => {
    expect(absoluteUrl(SITE, '/og/en/uno.png')).toBe('https://daxho.dev/og/en/uno.png');
    expect(absoluteUrl(SITE, '/robots.txt')).toBe('https://daxho.dev/robots.txt');
  });

  it('funciona con o sin barra final en la URL del sitio', () => {
    expect(absoluteUrl('https://daxho.dev/', '/about')).toBe('https://daxho.dev/about/');
    expect(absoluteUrl('https://daxho.dev', '/about')).toBe('https://daxho.dev/about/');
  });

  it('conserva el ancla del Person', () => {
    expect(absoluteUrl(SITE, PERSON_ID)).toBe('https://daxho.dev/#person');
  });
});

describe('Person', () => {
  it('el home y /about hablan de la MISMA persona: mismo @id', () => {
    const home = personJsonLd({ siteUrl: SITE, lang: 'en' });
    const about = personJsonLd({ siteUrl: SITE, lang: 'en', alumniOf: ['Real University'] });

    expect(home['@id']).toBe('https://daxho.dev/#person');
    expect(about['@id']).toBe(home['@id']);
  });

  it('apunta al home del idioma', () => {
    expect(personJsonLd({ siteUrl: SITE, lang: 'en' }).url).toBe('https://daxho.dev/');
    expect(personJsonLd({ siteUrl: SITE, lang: 'es' }).url).toBe('https://daxho.dev/es/');
  });

  it('omite los campos vacíos en vez de emitirlos a medias', () => {
    const node = personJsonLd({ siteUrl: SITE, lang: 'en', sameAs: [], knowsAbout: [] });

    expect(node).not.toHaveProperty('sameAs');
    expect(node).not.toHaveProperty('knowsAbout');
    expect(node).not.toHaveProperty('alumniOf');
    expect(node).not.toHaveProperty('worksFor');
  });

  it('tipa formación y empresas con su schema', () => {
    const node = personJsonLd({
      siteUrl: SITE,
      lang: 'en',
      alumniOf: ['Real University'],
      worksFor: ['Real Company'],
    });

    expect(node.alumniOf).toEqual([
      { '@type': 'EducationalOrganization', name: 'Real University' },
    ]);
    expect(node.worksFor).toEqual([{ '@type': 'Organization', name: 'Real Company' }]);
  });
});

describe('CreativeWork del proyecto', () => {
  const base = {
    siteUrl: SITE,
    lang: 'en' as const,
    path: '/projects/uno',
    title: 'Proyecto Uno',
    summary: 'Resumen corto.',
    image: '/og/en/uno.png',
    year: 2025,
    keywords: ['Astro', 'TypeScript'],
  };

  it('enlaza con el Person del sitio, no con un autor suelto', () => {
    expect(projectJsonLd(base).author).toEqual({ '@id': 'https://daxho.dev/#person' });
  });

  it('la url coincide con la canónica y la imagen con la OG generada', () => {
    const node = projectJsonLd(base);

    expect(node.url).toBe('https://daxho.dev/projects/uno/');
    expect(node.image).toBe('https://daxho.dev/og/en/uno.png');
    expect(node.inLanguage).toBe('en');
  });

  it('`sameAs` recoge solo las URL que existen', () => {
    expect(projectJsonLd(base)).not.toHaveProperty('sameAs');
    expect(projectJsonLd({ ...base, repoUrl: 'https://github.com/x/y' }).sameAs).toEqual([
      'https://github.com/x/y',
    ]);
    expect(
      projectJsonLd({ ...base, liveUrl: 'https://uno.dev', repoUrl: 'https://github.com/x/y' })
        .sameAs,
    ).toEqual(['https://uno.dev', 'https://github.com/x/y']);
  });
});

describe('BreadcrumbList', () => {
  it('numera desde 1 y absolutiza cada nivel', () => {
    const node = breadcrumbJsonLd(SITE, [
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
      { name: 'Uno', path: '/projects/uno' },
    ]);

    expect(node.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://daxho.dev/' },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://daxho.dev/projects/' },
      { '@type': 'ListItem', position: 3, name: 'Uno', item: 'https://daxho.dev/projects/uno/' },
    ]);
  });
});

describe('serialización', () => {
  it('un título con `</script>` no puede cerrar la etiqueta', () => {
    const html = serializeJsonLd(
      projectJsonLd({
        siteUrl: SITE,
        lang: 'en',
        path: '/projects/uno',
        title: '</script><img src=x onerror=alert(1)>',
        summary: 'x',
        image: '/og/en/uno.png',
        year: 2025,
        keywords: [],
      }),
    );

    expect(html).not.toContain('</script>');
    expect(html).not.toContain('<img');
    expect(html).toContain('\\u003c/script');
    // Y sigue siendo JSON válido, que es lo que lee el buscador.
    expect(JSON.parse(html).name).toBe('</script><img src=x onerror=alert(1)>');
  });
});

describe('imagen OG', () => {
  it('sale en PNG y con el tamaño que esperan las redes', async () => {
    const png = await renderOgImage({
      title: 'Proyecto Uno',
      subtitle: 'Astro · TypeScript',
      note: '2025',
      host: 'daxho.dev',
    });
    const meta = await sharp(png).metadata();

    expect(meta.format).toBe('png');
    expect(meta.width).toBe(OG_SIZE.width);
    expect(meta.height).toBe(OG_SIZE.height);
  }, 30_000);

  it('la genérica se dibuja sin título y tampoco falla', async () => {
    const png = await renderOgImage({ subtitle: 'Software Engineer', host: 'daxho.dev' });

    expect((await sharp(png).metadata()).width).toBe(OG_SIZE.width);
  }, 30_000);

  it('un título larguísimo no revienta el render', async () => {
    const png = await renderOgImage({
      title: 'Un título absurdamente largo para comprobar que el cuerpo baja y la tarjeta aguanta',
      subtitle: 'Astro',
      host: 'daxho.dev',
    });

    expect((await sharp(png).metadata()).height).toBe(OG_SIZE.height);
  }, 30_000);

  it('sus colores son los de la rampa oscura de tokens.css', () => {
    const css = readRepoFile('src/styles/tokens.css');
    const start = css.indexOf(
      "@media (prefers-color-scheme: dark) {\n  :root:not([data-theme='light']) {",
    );
    const dark = css.slice(start, css.indexOf('\n}', start));

    const token = (name: string) =>
      dark.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{3,8});`, 'i'))?.[1].toLowerCase();

    expect(OG_COLORS.base).toBe(token('bg-base'));
    expect(OG_COLORS.text).toBe(token('fg-primary'));
    expect(OG_COLORS.muted).toBe(token('fg-secondary'));
    expect(OG_COLORS.accent).toBe(token('accent-text'));

    // La barra inferior usa el sangre profundo de la rampa, no un rojo suelto.
    expect(OG_COLORS.accentSurface).toBe(
      css.match(/--color-blood-800:\s*(#[0-9a-f]{6});/i)?.[1].toLowerCase(),
    );
  });
});

describe('qué entra en el sitemap', () => {
  it('las páginas públicas de los dos idiomas entran', () => {
    for (const page of [
      'https://daxho.dev/',
      'https://daxho.dev/about/',
      'https://daxho.dev/projects/',
      'https://daxho.dev/projects/uno/',
      'https://daxho.dev/es/contact/',
    ]) {
      expect(sitemapFilter(page), page).toBe(true);
    }
  });

  it('lo que lleva `noindex` y lo que no es una página se queda fuera', () => {
    for (const page of [
      'https://daxho.dev/styleguide/',
      'https://daxho.dev/contact/sent/',
      'https://daxho.dev/contact/error/',
      'https://daxho.dev/es/contact/sent/',
      'https://daxho.dev/og/default.png',
      'https://daxho.dev/og/en/uno.png',
    ]) {
      expect(sitemapFilter(page), page).toBe(false);
    }
  });
});
