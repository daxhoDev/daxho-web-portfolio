import { expect, test, type Page } from '@playwright/test';

/**
 * 05-pages/home.md (APROBADA).
 */

async function visit(page: Page, path = '/', { booted = true, lang = 'en' } = {}) {
  await page.addInitScript(
    ({ booted, lang }) => {
      window.localStorage.setItem('lang', lang);
      if (booted) window.sessionStorage.setItem('booted', '1');
    },
    { booted, lang },
  );
  await page.goto(path);
}

const heroChar = (page: Page) =>
  page.locator('.hero .typing[data-typing-trigger="boot"] .typing-char').first();

const playState = (page: Page) =>
  heroChar(page).evaluate((el) => getComputedStyle(el).animationPlayState);

test.describe('home — estructura', () => {
  test('un solo <h1>, con el titular como nombre accesible', async ({ page }) => {
    await visit(page);
    // Acotado a `main`: la barra de desarrollo de Astro monta sus propios
    // <h1> en un shadow DOM que Playwright atraviesa, y que no existen en
    // producción. El <h1> del documento servido lo cuenta seo.spec.ts.
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
      "welcome to daxho's corner, what should we build?",
    );
    await expect(page).toHaveTitle('Daxho — Software Engineer');
  });

  test('el subtítulo contiene "Software Engineer" en ambos idiomas', async ({ page }) => {
    await visit(page);
    await expect(page.getByText('Software Engineer · full-stack web')).toBeVisible();

    await visit(page, '/es', { lang: 'es' });
    await expect(page.getByText('Software Engineer · desarrollo web full-stack')).toBeVisible();
  });

  test('CTAs del hero: primario a /projects, secundario a /contact', async ({ page }) => {
    await visit(page, '/es', { lang: 'es' });
    const hero = page.locator('.hero');
    await expect(hero.getByRole('link', { name: 'Proyectos' })).toHaveAttribute(
      'href',
      '/es/projects',
    );
    await expect(hero.getByRole('link', { name: 'Contacto' })).toHaveAttribute(
      'href',
      '/es/contact',
    );
  });

  test('el hero ocupa la pantalla bajo el header', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await visit(page);
    const header = await page.locator('.site-header').boundingBox();
    const hero = await page.locator('.hero').boundingBox();
    expect(Math.abs(header!.height + hero!.height - 800)).toBeLessThanOrEqual(2);
  });

  test('el indicador de scroll es un enlace estático a "about"', async ({ page }) => {
    await visit(page);
    const indicator = page.locator('[data-scroll-indicator]');
    await expect(indicator).toHaveAttribute('href', '#about');
    const animation = await indicator.evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toBe('none');

    await indicator.click();
    await expect(page).toHaveURL(/#about$/);
    // No queda tapado por el header sticky.
    const header = await page.locator('.site-header').boundingBox();
    const about = await page.locator('#about').boundingBox();
    expect(about!.y).toBeGreaterThanOrEqual(header!.height - 2);
  });

  test('about breve: "Read more" lleva a /about del idioma', async ({ page }) => {
    await visit(page, '/es', { lang: 'es' });
    await expect(page.locator('#about').getByRole('link', { name: 'Leer más' })).toHaveAttribute(
      'href',
      '/es/about',
    );
    await expect(page.locator('#about img')).toHaveAttribute('alt', /PLACEHOLDER/);
  });

  test('carrusel: 25 tecnologías con nombre y lista traducida', async ({ page }) => {
    await visit(page, '/es', { lang: 'es' });
    // Acotado al carrusel: en español las filas de stack de las cards también se
    // llaman "Tecnologías".
    const list = page.locator('.carousel').getByRole('list', { name: 'Tecnologías' });
    await expect(list).toHaveCount(1);
    await expect(list.getByRole('img')).toHaveCount(25);
  });

  test('el carrusel no provoca scroll horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await visit(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('exactamente 3 destacados, en orden de featuredOrder', async ({ page }) => {
    await visit(page);
    const featured = page.locator('[data-featured]');
    await expect(featured.getByRole('heading', { level: 3 })).toHaveText([
      'Lorem Ipsum One',
      'Lorem Ipsum Two',
      'Lorem Ipsum Three',
    ]);
    await expect(featured.getByRole('link', { name: 'View more projects' })).toHaveAttribute(
      'href',
      '/projects',
    );
  });

  test('banda CTA en voz de terminal, con el ">" decorativo', async ({ page }) => {
    await visit(page, '/es', { lang: 'es' });
    const band = page.locator('[data-cta-band]');
    await expect(band.getByRole('heading', { level: 2 })).toHaveAccessibleName(
      'listo cuando tú lo estés',
    );
    await expect(band.getByRole('link', { name: 'contacto' })).toHaveAttribute(
      'href',
      '/es/contact',
    );
  });
});

test.describe('home — encadenado con la boot sequence', () => {
  test('primera visita: el hero espera a la secuencia y teclea al terminar', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await visit(page, '/', { booted: false });

    await expect(page.locator('html')).toHaveAttribute('data-booting', '');
    expect(await playState(page)).toBe('paused');

    // Se libera sola al terminar la secuencia (820 ms).
    await expect(page.locator('html')).not.toHaveAttribute('data-booting', /.*/, {
      timeout: 3000,
    });
    expect(await playState(page)).toBe('running');
  });

  test('saltar la secuencia libera el hero en ese instante', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await visit(page, '/', { booted: false });
    await expect(page.locator('html')).toHaveAttribute('data-booting', '');

    await page.keyboard.press('Escape');
    await expect(page.locator('html')).not.toHaveAttribute('data-booting', /.*/);
    expect(await playState(page)).toBe('running');
  });

  test('segunda visita de la sesión: sin secuencia, el hero teclea de inmediato', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await visit(page, '/', { booted: true });
    await expect(page.locator('#boot')).toHaveCount(0);
    await expect(page.locator('html')).not.toHaveAttribute('data-booting', /.*/);
    expect(await playState(page)).toBe('running');
  });

  test('con reduced-motion el titular aparece entero de inmediato', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await visit(page, '/', { booted: false });
    await expect(page.locator('html')).not.toHaveAttribute('data-booting', /.*/);
    const opacity = await heroChar(page).evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });
});
