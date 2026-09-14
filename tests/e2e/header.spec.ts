import { expect, test, type Page } from '@playwright/test';

/**
 * El esqueleto de la fase 2 son páginas vacías, demasiado cortas para hacer
 * scroll. Se añade altura para poder ejercitar la ocultación del header.
 */
async function hydrated(page: Page, selector: string) {
  // Las islas de navegación son `client:idle`: el botón existe en el HTML
  // servido desde el primer momento, pero React puede no haber enganchado aún
  // el manejador. Astro quita el atributo `ssr` de <astro-island> al hidratar.
  await page.waitForFunction((sel) => {
    const island = document.querySelector(sel)?.closest('astro-island');
    return Boolean(island) && !island!.hasAttribute('ssr');
  }, selector);
}

async function addHeight(page: Page) {
  await page.evaluate(() => {
    const spacer = document.createElement('div');
    spacer.style.height = '3000px';
    document.querySelector('main')?.appendChild(spacer);
  });
}

/**
 * Header ocultable (Q28) y navegación de tres modos (Q-N), 06-components.md.
 * 09-testing.md exige cubrir la ocultación y la navegación por teclado.
 */

test.describe('header ocultable', () => {
  test('se esconde al bajar y reaparece al subir', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('lang', 'en');
      window.sessionStorage.setItem('booted', '1');
    });
    await page.goto('/');
    await addHeight(page);

    const header = page.locator('.site-header');
    await expect(header).toHaveAttribute('data-hidden', 'false');

    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(header).toHaveAttribute('data-hidden', 'true');

    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(header).toHaveAttribute('data-hidden', 'false');
  });

  test('reaparece siempre al llegar arriba', async ({ page }) => {
    await page.addInitScript(() => window.sessionStorage.setItem('booted', '1'));
    await page.goto('/');
    await addHeight(page);

    await page.evaluate(() => window.scrollTo(0, 1500));
    await expect(page.locator('.site-header')).toHaveAttribute('data-hidden', 'true');

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator('.site-header')).toHaveAttribute('data-hidden', 'false');
  });

  /**
   * Sin esto, un usuario de teclado podría tabular hasta un header fuera de
   * pantalla y perder el foco visible.
   */
  test('el foco por teclado lo devuelve a la vista aunque esté oculto', async ({ page }) => {
    await page.addInitScript(() => window.sessionStorage.setItem('booted', '1'));
    await page.goto('/');
    await addHeight(page);

    await page.evaluate(() => window.scrollTo(0, 1500));
    await expect(page.locator('.site-header')).toHaveAttribute('data-hidden', 'true');

    await page.evaluate(() => {
      document.querySelector<HTMLElement>('.site-nav-link')?.focus();
    });

    // Se sondea en vez de leer una vez: la transición dura 220 ms y una
    // lectura inmediata devuelve una matriz intermedia.
    await expect
      .poll(() =>
        page.locator('.site-header').evaluate((el) => getComputedStyle(el).transform),
      )
      .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  });
});

test.describe('navegación', () => {
  test('los 5 enlaces están en el HTML, no inyectados', async ({ page }) => {
    await page.addInitScript(() => window.sessionStorage.setItem('booted', '1'));
    await page.goto('/');

    // Se leen del HTML servido, sin ejecutar JavaScript.
    const response = await page.request.get('/');
    const html = await response.text();
    for (const label of ['Home', 'About', 'Projects', 'Resume', 'Contact']) {
      expect(html).toContain(`>${label}<`);
    }
  });

  test('sin el marcador de JS la navegación queda como lista normal', async ({ page }) => {
    await page.addInitScript(() => window.sessionStorage.setItem('booted', '1'));
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/');

    // Reproduce el caso sin JavaScript: sin data-nav-js no aplica ninguna
    // regla de colapso y los enlaces quedan visibles y tabulables.
    const visible = await page.evaluate(() => {
      document.documentElement.removeAttribute('data-nav-js');
      const link = document.querySelector<HTMLElement>('.site-nav-link');
      if (!link) return null;
      const style = getComputedStyle(link);
      return style.visibility !== 'hidden' && link.offsetParent !== null;
    });
    expect(visible).toBe(true);
  });

  test('marca el enlace de la página actual con aria-current', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('lang', 'en'));
    await page.goto('/projects');
    await expect(page.getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('el skip link es el primer elemento tabulable', async ({ page }) => {
    await page.addInitScript(() => window.sessionStorage.setItem('booted', '1'));
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator('a.skip-link')).toBeFocused();
  });

  test('en móvil el sidebar abre, atrapa el foco y cierra con Esc', async ({ page }) => {
    await page.addInitScript(() => window.sessionStorage.setItem('booted', '1'));
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/');

    const trigger = page.locator('.nav-trigger--mobile');
    await expect(trigger).toBeVisible();
    await hydrated(page, '.nav-trigger--mobile');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveAttribute('aria-controls', 'site-nav');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#site-nav')).toHaveAttribute('data-open', 'true');

    // El resto de la página queda inerte mientras está abierto.
    await expect(page.locator('main')).toHaveAttribute('inert', '');

    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    // El foco vuelve al disparador.
    await expect(trigger).toBeFocused();
    await expect(page.locator('main')).not.toHaveAttribute('inert', '');
  });
});

test.describe('boot sequence (ADR-0019)', () => {
  test('aparece en la primera visita de la sesión y se salta con una tecla', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');

    const boot = page.locator('#boot');
    await expect(boot).toBeAttached();

    await page.keyboard.press('Escape');
    await expect(boot).toHaveCount(0);
  });

  test('no se repite en la segunda navegación de la sesión', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.locator('#boot').waitFor({ state: 'attached' });

    await page.goto('/about');
    await expect(page.locator('#boot')).toHaveCount(0);
  });

  test('no se muestra con prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('#boot')).toHaveCount(0);
  });
});
