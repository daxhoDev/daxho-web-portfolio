import { readFileSync } from 'node:fs';

import { expect, test } from '@playwright/test';

/**
 * ADR-0016 (SEO) y ADR-0015 (analítica sin cookies), fase 8.
 *
 * Nada de esto se ve en pantalla, y por eso se rompe sin que nadie lo note: un
 * `og:image` mal escrito solo aparece el día que alguien comparte el enlace.
 */

/** Devuelve el JSON-LD de la página, ya parseado. */
async function structuredData(page: import('@playwright/test').Page) {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.map((block) => JSON.parse(block) as Record<string, unknown>);
}

const content = (page: import('@playwright/test').Page, selector: string) =>
  page.locator(selector).getAttribute('content');

test.describe('metadatos por página', () => {
  test('el home lleva description, Open Graph y Twitter Card', async ({ page }) => {
    await page.goto('/');

    expect(await content(page, 'meta[name="description"]')).toContain('Software Engineer');
    expect(await content(page, 'meta[property="og:type"]')).toBe('website');
    expect(await content(page, 'meta[property="og:title"]')).toBe('Daxho — Software Engineer');
    expect(await content(page, 'meta[property="og:image"]')).toContain('/og/default.png');
    expect(await content(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');
  });

  test('la description del home está en el idioma de la página', async ({ page }) => {
    await page.goto('/es');
    expect(await content(page, 'meta[name="description"]')).toContain('desarrollo web full-stack');
  });

  test('cada página tiene su propia description, no una de plantilla', async ({ page }) => {
    const descriptions = new Set<string>();

    for (const path of ['/', '/about', '/projects', '/contact']) {
      await page.goto(path);
      const description = await content(page, 'meta[name="description"]');
      expect(description, path).toBeTruthy();
      descriptions.add(description!);
    }

    expect(descriptions.size).toBe(4);
  });

  test('la canónica y og:url apuntan a la misma URL', async ({ page }) => {
    await page.goto('/projects');

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(await content(page, 'meta[property="og:url"]')).toBe(canonical);
  });

  test('og:locale distingue los dos idiomas', async ({ page }) => {
    await page.goto('/contact');
    expect(await content(page, 'meta[property="og:locale"]')).toBe('en_US');

    await page.goto('/es/contact');
    expect(await content(page, 'meta[property="og:locale"]')).toBe('es_ES');
  });
});

test.describe('JSON-LD', () => {
  test('el home publica un Person con el catálogo de tecnologías', async ({ page }) => {
    await page.goto('/');
    const [person] = await structuredData(page);

    expect(person['@type']).toBe('Person');
    expect(person.jobTitle).toBe('Software Engineer');
    expect(person.knowsAbout).toContain('Astro');
  });

  test('/about amplía el MISMO Person, con el mismo @id', async ({ page }) => {
    await page.goto('/');
    const [home] = await structuredData(page);

    await page.goto('/about');
    const [about] = await structuredData(page);

    expect(about['@type']).toBe('Person');
    expect(about['@id']).toBe(home['@id']);
  });

  test('las redes de relleno NO se publican como perfiles reales', async ({ page }) => {
    await page.goto('/');
    const [person] = await structuredData(page);

    // Mientras `social.ts` esté en placeholder (fase 10), no hay `sameAs`.
    expect(person.sameAs ?? []).not.toContain('#');
  });

  test('/projects publica sus migas', async ({ page }) => {
    await page.goto('/projects');
    const [breadcrumbs] = await structuredData(page);

    expect(breadcrumbs['@type']).toBe('BreadcrumbList');
    expect((breadcrumbs.itemListElement as unknown[]).length).toBe(2);
  });

  test('el detalle publica CreativeWork + migas, y el autor es el Person del sitio', async ({
    page,
  }) => {
    await page.goto('/projects/lorem-ipsum-one');
    const [work, breadcrumbs] = await structuredData(page);

    expect(work['@type']).toBe('CreativeWork');
    expect(work.inLanguage).toBe('en');
    expect((work.author as Record<string, string>)['@id']).toContain('#person');
    expect(breadcrumbs['@type']).toBe('BreadcrumbList');
    expect((breadcrumbs.itemListElement as unknown[]).length).toBe(3);
  });

  test('el JSON-LD es JSON válido en todas las páginas', async ({ page }) => {
    for (const path of ['/', '/es', '/about', '/es/about', '/projects', '/es/projects']) {
      await page.goto(path);
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();

      expect(blocks.length, path).toBeGreaterThan(0);
      for (const block of blocks)
        expect(() => JSON.parse(block), `${path}: ${block}`).not.toThrow();
    }
  });
});

test.describe('imágenes OG', () => {
  test('cada proyecto tiene la suya, y existe', async ({ page, request }) => {
    await page.goto('/es/projects/lorem-ipsum-one');

    const url = await content(page, 'meta[property="og:image"]');
    expect(url).toContain('/og/es/lorem-ipsum-one.png');

    const response = await request.get(url!);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
  });

  test('el detalle es `article`; el resto, `website`', async ({ page }) => {
    await page.goto('/projects/lorem-ipsum-one');
    expect(await content(page, 'meta[property="og:type"]')).toBe('article');

    await page.goto('/projects');
    expect(await content(page, 'meta[property="og:type"]')).toBe('website');
  });

  test('la genérica se sirve para las rutas que no son proyecto', async ({ request }) => {
    const response = await request.get('/og/default.png');

    expect(response.status()).toBe(200);
    expect(Number(response.headers()['content-length'] ?? 1)).toBeGreaterThan(0);
  });
});

test.describe('robots y sitemap', () => {
  test('robots.txt deja entrar y anuncia el sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt');
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Allow: /');
    expect(body).toMatch(/Sitemap: https?:\/\/[^\s]+\/sitemap-index\.xml/);
    // Nada de `Disallow`: las páginas con `noindex` deben poder rastrearse
    // para que esa etiqueta se llegue a leer.
    expect(body).not.toContain('Disallow');
  });

  test('el sitemap del build lista las páginas públicas y solo esas', () => {
    // El sitemap lo genera `astro build`, no el servidor de desarrollo.
    let xml: string;
    try {
      xml = readFileSync('.vercel/output/static/sitemap-0.xml', 'utf8');
    } catch {
      throw new Error('Falta el sitemap: ejecuta `pnpm build` antes de los E2E, como hace el CI.');
    }

    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

    expect(urls.some((url) => url.endsWith('/projects/'))).toBe(true);
    expect(urls.some((url) => url.includes('/es/'))).toBe(true);
    for (const forbidden of ['styleguide', 'contact/sent', 'contact/error', '/og/', '404']) {
      expect(
        urls.filter((url) => url.includes(forbidden)),
        forbidden,
      ).toEqual([]);
    }
  });

  test('las páginas que no deben indexarse lo dicen', async ({ request }) => {
    // Sobre el HTML servido, sin navegador: es lo que lee un rastreador, y no
    // depende de cuánto tarde en hidratar nada.
    for (const path of ['/styleguide', '/contact/sent', '/contact/error']) {
      const html = await (await request.get(path)).text();
      expect(html, path).toMatch(/<meta name="robots" content="noindex/);
    }

    const notFound = await request.get('/esta-ruta-no-existe');
    expect(notFound.status()).toBe(404);
    expect(await notFound.text()).toMatch(/<meta name="robots" content="noindex/);
  });
});

test.describe('semántica', () => {
  test('cada página servida tiene exactamente un <h1>', async ({ request }) => {
    for (const path of [
      '/',
      '/es',
      '/about',
      '/projects',
      '/contact',
      '/projects/lorem-ipsum-one',
    ]) {
      const html = await (await request.get(path)).text();
      const headings = html.match(/<h1[\s>]/g) ?? [];

      expect(headings.length, path).toBe(1);
    }
  });
});

test.describe('analítica sin cookies (ADR-0015)', () => {
  test('el footer lo dice en los dos idiomas', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toContainText('This website does not use cookies');

    await page.goto('/es');
    await expect(page.locator('footer')).toContainText('Este sitio web no utiliza cookies');
  });

  test('la analítica se monta en el build de producción, no en desarrollo', async ({ page }) => {
    // En desarrollo NO se monta a propósito (BaseLayout): su script de depuración
    // no mide nada y su espera desestabilizaba los tests de tiempos.
    await page.goto('/');
    await expect(page.locator('vercel-analytics')).toHaveCount(0);

    let html: string;
    try {
      html = readFileSync('.vercel/output/static/index.html', 'utf8');
    } catch {
      throw new Error('Falta el build: ejecuta `pnpm build` antes de los E2E, como hace el CI.');
    }
    expect(html).toContain('vercel-analytics');
  });

  test('no hay banner de cookies que tapar', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('[class*="cookie-banner"], #cookie-banner')).toHaveCount(0);
  });
});
