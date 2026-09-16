import { expect, test } from '@playwright/test';

import { hydrated } from './helpers';

/**
 * ADR-0008 (rutas prefijadas) y ADR-0009 (detección y persistencia).
 *
 * 09-testing.md marca esta detección como "comportamiento sutil y fácil de
 * romper" y obliga a cubrirla, incluyendo el caso crítico del visitante con el
 * navegador en español que eligió inglés a mano.
 */

test.describe('i18n — rutas y hreflang', () => {
  test('el inglés vive en / y el español bajo /es', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await page.goto('/es/about');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  test('cada página declara hreflang de ambos idiomas y x-default', async ({ page }) => {
    await page.goto('/es/projects');

    const hreflangs = await page
      .locator('link[rel="alternate"]')
      .evaluateAll((links) =>
        links.map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')]),
      );

    const map = Object.fromEntries(hreflangs);
    expect(Object.keys(map).sort()).toEqual(['en', 'es', 'x-default']);
    expect(map.en).toContain('/projects');
    expect(map.es).toContain('/es/projects');
    // x-default apunta al inglés (ADR-0008).
    expect(map['x-default']).toBe(map.en);
  });
});

test.describe('i18n — detección de idioma (ADR-0009)', () => {
  test('primera visita con navegador en español redirige a /es', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'es-ES' });
    const page = await context.newPage();
    await page.goto('/about');
    await expect(page).toHaveURL(/\/es\/about$/);
    await context.close();
  });

  test('primera visita con navegador en inglés NO redirige', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'en-US' });
    const page = await context.newPage();
    await page.goto('/about');
    await expect(page).toHaveURL(/\/about$/);
    await expect(page).not.toHaveURL(/\/es\//);
    await context.close();
  });

  /**
   * EL CASO CRÍTICO de 09-testing.md. Regla 1 de ADR-0009: si hay preferencia
   * guardada, no hay redirección, aunque el navegador diga otra cosa.
   */
  test('navegador en español + lang guardado en inglés → NO redirige', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'es-ES' });
    const page = await context.newPage();
    await page.addInitScript(() => window.localStorage.setItem('lang', 'en'));

    await page.goto('/about');
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await context.close();
  });

  /**
   * Regla 4: entrar directo a una URL con prefijo es una intención explícita.
   */
  test('entrar directo a /es respeta el prefijo con navegador en inglés', async ({
    browser,
  }) => {
    const context = await browser.newContext({ locale: 'en-US' });
    const page = await context.newPage();
    await page.goto('/es/about');
    await expect(page).toHaveURL(/\/es\/about$/);
    await context.close();
  });

  /** Regla 3: como mucho una redirección por sesión. Sin bucles. */
  test('no hay bucle de redirección', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'es-ES' });
    const page = await context.newPage();

    let navigations = 0;
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) navigations += 1;
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/es$/);
    // Carga inicial + una redirección. Un bucle dispararía muchas más.
    expect(navigations).toBeLessThanOrEqual(3);
    await context.close();
  });
});

test.describe('LanguageSwitcher', () => {
  test('lleva a la página EQUIVALENTE, no al home (ADR-0008)', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('lang', 'en'));
    await page.goto('/projects');

    await hydrated(page, '[data-lang="es"]');
    await page.getByRole('button', { name: /^es/i }).click();
    await expect(page).toHaveURL(/\/es\/projects$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  /**
   * Regla 2 de ADR-0009: elegir a mano desactiva la detección para siempre.
   * Sin esto, el visitante volvería a ser redirigido en la siguiente visita.
   */
  test('elegir idioma a mano persiste la preferencia', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'es-ES' });
    const page = await context.newPage();

    await page.goto('/es/about');
    await hydrated(page, '[data-lang="en"]');
    await page.getByRole('button', { name: /^en/i }).click();
    await expect(page).toHaveURL(/\/about$/);

    const stored = await page.evaluate(() => localStorage.getItem('lang'));
    expect(stored).toBe('en');

    // Y al recargar sigue en inglés pese al navegador en español.
    await page.goto('/about');
    await expect(page).toHaveURL(/\/about$/);
    await context.close();
  });
});
