import { expect, test, type Page } from '@playwright/test';

import { hydrated } from './helpers';

/**
 * 05-pages/projects.md y 05-pages/project-detail.md (APROBADAS).
 */

async function visit(page: Page, path: string, lang: 'en' | 'es' = 'en') {
  await page.addInitScript((l) => {
    window.localStorage.setItem('lang', l);
    window.sessionStorage.setItem('booted', '1');
  }, lang);
  await page.goto(path);
}

test.describe('/projects', () => {
  test('muestra los 6 proyectos en el orden del campo order', async ({ page }) => {
    await visit(page, '/projects');
    const titles = page.getByRole('article').getByRole('heading', { level: 2 });
    await expect(titles).toHaveCount(6);
    await expect(titles).toHaveText([
      'Destinos Únicos',
      'Lorem Ipsum Two',
      'Lorem Ipsum Three',
      'Lorem Ipsum Four',
      'Lorem Ipsum Five',
      'Lorem Ipsum Six',
    ]);
  });

  test('existe en español con sus propios títulos', async ({ page }) => {
    await visit(page, '/es/projects', 'es');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    // El primero es un nombre propio y no se traduce; el segundo sí.
    await expect(page.getByRole('heading', { name: 'Lorem Ipsum Dos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver detalles' }).first()).toHaveAttribute(
      'href',
      '/es/projects/destinos-unicos',
    );
  });

  test('rejilla: 1 columna en móvil, 2 en md, 3 en xl', async ({ page }) => {
    await visit(page, '/projects');
    const columns = async () =>
      page
        .locator('main ul.grid')
        .first()
        .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);

    await page.setViewportSize({ width: 390, height: 800 });
    expect(await columns()).toBe(1);
    await page.setViewportSize({ width: 900, height: 800 });
    expect(await columns()).toBe(2);
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(await columns()).toBe(3);
  });

  test('tabulación dentro de la card: título → View details → Open project', async ({ page }) => {
    await visit(page, '/projects');
    const card = page.getByRole('article').filter({ hasText: 'Destinos Únicos' });

    await card.getByRole('link', { name: 'Destinos Únicos' }).focus();
    await page.keyboard.press('Tab');
    await expect(card.getByRole('link', { name: 'View details' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(card.getByRole('link', { name: 'Open project' })).toBeFocused();
  });

  test('sin liveUrl no aparece "Open project"', async ({ page }) => {
    await visit(page, '/projects');
    // lorem-ipsum-three no tiene liveUrl en su contenido.
    const card = page.getByRole('article').filter({ hasText: 'Lorem Ipsum Three' });
    await expect(card.getByRole('link', { name: 'Open project' })).toHaveCount(0);
  });

  test('las capturas no provocan CLS: dimensiones explícitas', async ({ page }) => {
    await visit(page, '/projects');
    const img = page.getByRole('article').first().locator('img');
    await expect(img).toHaveAttribute('width', /\d+/);
    await expect(img).toHaveAttribute('height', /\d+/);
    await expect(img).toHaveAttribute('alt', /PLACEHOLDER/);
  });
});

test.describe('detalle de proyecto', () => {
  test('el clic en la card lleva al detalle', async ({ page }) => {
    await visit(page, '/projects');
    await page.getByRole('link', { name: 'Lorem Ipsum Two' }).click();
    await expect(page).toHaveURL(/\/projects\/lorem-ipsum-two$/);
    // Nombre accesible, no textContent: el <h1> teclado contiene el texto en un
    // nodo sr-only y además las letras animadas aria-hidden.
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Lorem Ipsum Two');
  });

  test('un solo <h1>, y el cuerpo MDX empieza en <h2>', async ({ page }) => {
    await visit(page, '/projects/destinos-unicos');
    // Acotado a `main` a propósito: la barra de herramientas de desarrollo de
    // Astro monta sus propios <h1> ("Audit", "Settings") en un shadow DOM, y
    // los selectores de Playwright lo atraviesan. No existen en producción.
    // Que el documento servido tenga UN solo <h1> lo comprueba seo.spec.ts
    // sobre el HTML, sin navegador de por medio.
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('.prose h1')).toHaveCount(0);
    await expect(page.locator('.prose h2').first()).toBeVisible();
  });

  test('muestra cada botón solo si existe su URL', async ({ page }) => {
    await visit(page, '/projects/lorem-ipsum-two'); // liveUrl sí, repoUrl no
    await expect(page.getByRole('link', { name: 'Open project' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
    await expect(page.getByRole('link', { name: 'View repository' })).toHaveCount(0);

    await visit(page, '/projects/lorem-ipsum-six'); // ninguna de las dos
    await expect(page.getByRole('link', { name: 'Open project' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'View repository' })).toHaveCount(0);
  });

  test('galería en línea: cada captura enlaza a la imagen completa, sin lightbox', async ({
    page,
  }) => {
    await visit(page, '/projects/destinos-unicos');
    const figures = page.locator('figure');
    await expect(figures).toHaveCount(2);
    await expect(figures.first().locator('a')).toHaveAttribute('href', /\.svg(\?|$)/);
    // El pie se pinta, sea cual sea su texto: el primer proyecto ya es real.
    await expect(figures.first().locator('figcaption')).not.toBeEmpty();
  });

  test('sin galería no se pinta la sección', async ({ page }) => {
    await visit(page, '/projects/lorem-ipsum-five');
    await expect(page.getByRole('heading', { name: 'Gallery' })).toHaveCount(0);
  });

  test('ProjectNav sin vuelta: el primero no tiene "anterior"', async ({ page }) => {
    await visit(page, '/projects/destinos-unicos');
    await expect(page.locator('[data-project-nav="prev"]')).toHaveCount(0);
    await expect(page.locator('[data-project-nav="next"]')).toHaveAttribute(
      'href',
      '/projects/lorem-ipsum-two',
    );
  });

  test('ProjectNav sin vuelta: el último no tiene "siguiente"', async ({ page }) => {
    await visit(page, '/projects/lorem-ipsum-six');
    await expect(page.locator('[data-project-nav="next"]')).toHaveCount(0);
    await expect(page.locator('[data-project-nav="prev"]')).toHaveAttribute(
      'href',
      '/projects/lorem-ipsum-five',
    );
  });

  test('el selector de idioma lleva al MISMO proyecto en el otro idioma', async ({ page }) => {
    await visit(page, '/projects/lorem-ipsum-four');
    await hydrated(page, '[data-lang="es"]');
    await page.getByRole('button', { name: /^es/i }).click();
    await expect(page).toHaveURL(/\/es\/projects\/lorem-ipsum-four$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
      'Lorem Ipsum Cuatro',
    );
  });

  test('un slug inexistente devuelve 404', async ({ page }) => {
    const response = await page.goto('/projects/no-existe');
    expect(response?.status()).toBe(404);
  });
});
