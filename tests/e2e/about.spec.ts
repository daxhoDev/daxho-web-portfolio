import { expect, test, type Page } from '@playwright/test';

/**
 * 05-pages/about.md (APROBADA). Es también la página del CV: /resume se eliminó
 * el 2026-09-16 (DEVIATIONS.md).
 */

async function visit(page: Page, path: string, lang: 'en' | 'es' = 'en') {
  await page.addInitScript((l) => {
    window.localStorage.setItem('lang', l);
    window.sessionStorage.setItem('booted', '1');
  }, lang);
  await page.goto(path);
}

const EXPECTED_ORDER = ['Lorem Ipsum Studio', 'Dolor Sit Labs', 'Amet Consectetur'];

test.describe('/about', () => {
  test('un solo <h1> y las secciones de la spec, en orden', async ({ page }) => {
    await visit(page, '/es/about', 'es');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle('Sobre mí — Daxho');
    // Nombre accesible y no texto: un encabezado tecleado contiene la frase en
    // un nodo sr-only y además las letras animadas.
    const sections = page.locator('main').getByRole('heading', { level: 2 });
    const expected = ['Habilidades', 'Experiencia', 'Formación', 'Idiomas'];
    await expect(sections).toHaveCount(expected.length);
    for (const [index, name] of expected.entries()) {
      await expect(sections.nth(index)).toHaveAccessibleName(name);
    }
    await expect(page.locator('main img')).toHaveAttribute('alt', /PLACEHOLDER/);
    await expect(page.locator('main img')).toHaveAttribute('width', /\d+/);
  });

  test('skills: seis grupos con las 25 tecnologías y sin niveles', async ({ page }) => {
    await visit(page, '/es/about', 'es');
    const groups = page.locator('section:has(> h3)');
    await expect(groups.getByRole('heading', { level: 3 })).toHaveText([
      'Lenguajes',
      'Frontend',
      'Backend',
      'Datos',
      'Infraestructura',
      'Herramientas y calidad',
    ]);
    await expect(groups.locator('li')).toHaveCount(25);
    await expect(page.locator('progress, meter, [role="progressbar"]')).toHaveCount(0);
  });

  test('experiencia: <ol> de más reciente a más antigua', async ({ page }) => {
    await visit(page, '/about');
    const items = page.locator('ol.timeline > li');
    await expect(items).toHaveCount(3);
    for (const [index, company] of EXPECTED_ORDER.entries()) {
      await expect(items.nth(index).getByRole('heading')).toContainText(company);
    }
    await expect(items.first()).toContainText('Mar 2023 – Present');
    await expect(items.first().getByRole('heading')).toHaveText(
      'Lorem ipsum dolor · Lorem Ipsum Studio',
    );
  });

  test('formación e idiomas', async ({ page }) => {
    await visit(page, '/about');
    await expect(page.locator('[data-about-education] li')).toHaveCount(1);
    await expect(page.locator('[data-about-languages] dt')).toHaveCount(2);
  });

  test('el CTA final lleva solo a /contact', async ({ page }) => {
    await visit(page, '/es/about', 'es');
    const main = page.locator('main');
    await expect(main.getByRole('link', { name: 'Contacto' })).toHaveAttribute('href', '/es/contact');
    await expect(main.locator('a[href*="/resume"]:not([data-cv-download])')).toHaveCount(0);
  });
});

test.describe('/about — CV', () => {
  test('el botón de descarga es lo primero interactivo tras el <h1>', async ({ page }) => {
    await visit(page, '/about');
    const first = await page.evaluate(() => {
      const h1 = document.querySelector('main h1')!;
      const all = Array.from(document.querySelectorAll('main *'));
      const after = all.slice(all.indexOf(h1) + 1);
      return after.find((el) => el.matches('a, button'))?.hasAttribute('data-cv-download') ?? false;
    });
    expect(first).toBe(true);
  });

  test('descarga el PDF del idioma, con formato, idioma y peso real', async ({ page }) => {
    await visit(page, '/es/about', 'es');
    const link = page.locator('[data-cv-download]');
    await expect(link).toHaveAttribute('href', '/resume/daxho-resume-es.pdf');
    await expect(link).toHaveAttribute('download', 'daxho-resume-es.pdf');
    await expect(link).toHaveText(/Descargar PDF\s*\(español · \d+ KB\)/);

    const response = await page.request.get('/resume/daxho-resume-es.pdf');
    expect(response.status()).toBe(200);
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
  });

  test('no se publica el correo', async ({ page }) => {
    await visit(page, '/about');
    const html = await page.content();
    expect(html).not.toContain('mailto:');
    expect(html).not.toContain('developer.daxho@gmail.com');
  });
});

test.describe('/resume ya no existe', () => {
  test('la ruta devuelve 404 en ambos idiomas', async ({ page }) => {
    expect((await page.goto('/resume'))?.status()).toBe(404);
    expect((await page.goto('/es/resume'))?.status()).toBe(404);
  });

  test('la navegación tiene 4 enlaces, sin Resume', async ({ page }) => {
    await visit(page, '/about');
    await expect(page.locator('#site-nav a')).toHaveText(['Home', 'About', 'Projects', 'Contact']);
  });
});

test.describe('/about — impresión', () => {
  test('sin cromo, negro sobre blanco y con los encabezados tecleados visibles', async ({
    page,
  }) => {
    // Sin reduced-motion: los encabezados de abajo siguen en pausa, invisibles,
    // y saldrían en blanco si la hoja de impresión fallara.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await visit(page, '/about');
    await expect(page.locator('html')).toHaveAttribute('data-typing-js', '');
    await page.emulateMedia({ media: 'print' });

    await expect(page.locator('.site-header')).toBeHidden();
    await expect(page.locator('body > footer')).toBeHidden();
    await expect(page.locator('[data-cv-download]')).toBeHidden();

    const lastHeadingChar = page
      .getByRole('heading', { name: 'Languages' })
      .locator('.typing-char')
      .first();
    expect(await lastHeadingChar.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');

    const colors = await page.evaluate(() => ({
      text: getComputedStyle(document.querySelector('main h2')!).color,
      background: getComputedStyle(document.body).backgroundColor,
      node: getComputedStyle(document.querySelector('.timeline-item')!, '::before')
        .backgroundColor,
    }));
    expect(colors.text).toBe('rgb(0, 0, 0)');
    expect(colors.background).toBe('rgb(255, 255, 255)');
    expect(colors.node).toBe('rgb(0, 0, 0)');
  });
});

test('el footer sigue mostrando las redes desde social.ts', async ({ page }) => {
  await visit(page, '/about');
  await expect(page.locator('body > footer').getByRole('link', { name: 'GitHub' })).toBeVisible();
});
