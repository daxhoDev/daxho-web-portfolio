import { expect, test, type Page } from '@playwright/test';

/**
 * 05-pages/about.md y 05-pages/resume.md (APROBADAS).
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
  test('un solo <h1> y las secciones de la spec', async ({ page }) => {
    await visit(page, '/about');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle('About — Daxho');
    await expect(page.getByRole('heading', { level: 2, name: 'Skills' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Experience' })).toBeVisible();
    await expect(page.locator('main img')).toHaveAttribute('alt', /PLACEHOLDER/);
    await expect(page.locator('main img')).toHaveAttribute('width', /\d+/);
  });

  test('skills: seis grupos con las 25 tecnologías y sin niveles', async ({ page }) => {
    await visit(page, '/es/about', 'es');
    const groups = page.getByRole('heading', { level: 3 });
    await expect(groups).toHaveText([
      'Lenguajes',
      'Frontend',
      'Backend',
      'Datos',
      'Infraestructura',
      'Herramientas y calidad',
      // Los <h3> siguientes son los puestos de la experiencia.
      /Lorem ipsum dolor/,
      /Lorem ipsum dolor/,
      /Lorem ipsum dolor/,
    ]);
    const chips = page.locator('section:has(> h3) li');
    await expect(chips).toHaveCount(25);
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
    // Espacio a ambos lados del separador entre rol y empresa.
    await expect(items.first().getByRole('heading')).toHaveText(
      'Lorem ipsum dolor · Lorem Ipsum Studio',
    );
  });

  test('CTA a /resume y /contact del idioma', async ({ page }) => {
    await visit(page, '/es/about', 'es');
    await expect(page.getByRole('link', { name: 'Currículum' }).last()).toHaveAttribute(
      'href',
      '/es/resume',
    );
    await expect(page.locator('main').getByRole('link', { name: 'Contacto' })).toHaveAttribute(
      'href',
      '/es/contact',
    );
  });
});

test.describe('/resume', () => {
  test('el botón de descarga es lo primero tras el <h1>', async ({ page }) => {
    await visit(page, '/resume');
    const next = await page.evaluate(() => {
      const h1 = document.querySelector('main h1')!;
      const all = Array.from(document.querySelectorAll('main *'));
      const after = all.slice(all.indexOf(h1) + 1);
      const firstInteractive = after.find((el) => el.matches('a, button'));
      return firstInteractive?.hasAttribute('data-resume-download') ?? false;
    });
    expect(next).toBe(true);
  });

  test('descarga el PDF del idioma, con formato, idioma y peso real', async ({ page }) => {
    await visit(page, '/es/resume', 'es');
    const link = page.locator('[data-resume-download]');
    await expect(link).toHaveAttribute('href', '/resume/daxho-resume-es.pdf');
    await expect(link).toHaveAttribute('download', 'daxho-resume-es.pdf');
    await expect(link).toHaveText(/Descargar PDF\s*\(español · \d+ KB\)/);

    const response = await page.request.get('/resume/daxho-resume-es.pdf');
    expect(response.status()).toBe(200);
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
  });

  test('contacto: GitHub, LinkedIn y formulario, sin correo publicado', async ({ page }) => {
    await visit(page, '/resume');
    const contact = page.locator('[data-resume-contact]');
    await expect(contact.getByRole('link')).toHaveText(['GitHub', 'LinkedIn', 'Contact form']);
    await expect(contact.getByRole('link', { name: 'Contact form' })).toHaveAttribute(
      'href',
      '/contact',
    );
    const html = await page.content();
    expect(html).not.toContain('mailto:');
    expect(html).not.toContain('developer.daxho@gmail.com');
  });

  test('la experiencia es la misma que en /about', async ({ page }) => {
    await visit(page, '/resume');
    const items = page.locator('ol.timeline > li');
    await expect(items).toHaveCount(3);
    for (const [index, company] of EXPECTED_ORDER.entries()) {
      await expect(items.nth(index).getByRole('heading')).toContainText(company);
    }
  });

  test('formación e idiomas en ambos idiomas', async ({ page }) => {
    await visit(page, '/es/resume', 'es');
    await expect(page.getByRole('heading', { level: 2, name: 'Formación' })).toBeVisible();
    await expect(page.locator('[data-resume-education] li')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 2, name: 'Idiomas' })).toBeVisible();
    await expect(page.locator('[data-resume-languages] dt')).toHaveCount(2);
  });
});

test.describe('/resume — impresión', () => {
  test('sin cromo, negro sobre blanco y con los encabezados tecleados visibles', async ({
    page,
  }) => {
    // Sin reduced-motion: es el caso en que los encabezados de abajo siguen en
    // pausa, invisibles, y saldrían en blanco si la hoja de impresión fallara.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await visit(page, '/resume');
    await expect(page.locator('html')).toHaveAttribute('data-typing-js', '');
    await page.emulateMedia({ media: 'print' });

    await expect(page.locator('.site-header')).toBeHidden();
    await expect(page.locator('body > footer')).toBeHidden();
    await expect(page.locator('[data-resume-download]')).toBeHidden();

    const lastHeadingChar = page.getByRole('heading', { name: 'Languages' }).locator('.typing-char').first();
    expect(await lastHeadingChar.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');

    const colors = await page.evaluate(() => ({
      text: getComputedStyle(document.querySelector('main h2')!).color,
      background: getComputedStyle(document.body).backgroundColor,
      node: getComputedStyle(document.querySelector('.timeline-item')!, '::before').backgroundColor,
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
