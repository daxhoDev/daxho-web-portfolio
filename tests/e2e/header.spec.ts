import { expect, test, type Page } from '@playwright/test';

import { hydrated } from './helpers';

/**
 * El esqueleto de la fase 2 son páginas vacías, demasiado cortas para hacer
 * scroll. Se añade altura para poder ejercitar la ocultación del header.
 */
async function openMobile(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem('lang', 'en');
    window.sessionStorage.setItem('booted', '1');
  });
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  await expect(page.locator('.nav-trigger--mobile')).toBeVisible();
  await hydrated(page, '.nav-trigger--mobile');
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
    await openMobile(page);
    const trigger = page.locator('.nav-trigger--mobile');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#site-nav')).toHaveAttribute('data-open', 'true');
    await expect(page.locator('main')).toHaveAttribute('inert', '');

    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
    await expect(page.locator('main')).not.toHaveAttribute('inert', '');
  });
});

test.describe('sidebar móvil', () => {
  test('el disparador es solo un icono, con nombre accesible', async ({ page }) => {
    await openMobile(page);
    const trigger = page.locator('.nav-trigger--mobile');

    await expect(trigger).toHaveText('');
    await expect(trigger.locator('svg')).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-label', 'Open menu');
  });

  test('el botón X está arriba a la derecha del panel y lo cierra', async ({ page }) => {
    await openMobile(page);
    const trigger = page.locator('.nav-trigger--mobile');
    await trigger.click();

    const close = page.getByRole('button', { name: 'Close menu' });
    await expect(close).toBeVisible();
    // Vive dentro del panel: queda dentro de la trampa de foco.
    await expect(page.locator('#site-nav').getByRole('button', { name: 'Close menu' })).toHaveCount(1);
    // Es lo primero que recibe foco al abrir.
    await expect(close).toBeFocused();

    // El panel entra deslizándose (220 ms). Medir durante la transición daría
    // dos cajas tomadas en instantes distintos: se espera a que se asiente.
    await expect
      .poll(() => page.locator('#site-nav').evaluate((el) => getComputedStyle(el).transform))
      .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);

    const panel = await page.locator('#site-nav').boundingBox();
    const box = await close.boundingBox();
    expect(panel && box).toBeTruthy();
    // Esquina superior derecha: a menos de 32 px del borde superior y derecho.
    expect(box!.y - panel!.y).toBeLessThan(32);
    expect(panel!.x + panel!.width - (box!.x + box!.width)).toBeLessThan(32);

    await close.click();
    await expect(page.locator('#site-nav')).toHaveAttribute('data-open', 'false');
    await expect(trigger).toBeFocused();
  });

  test('el backdrop difumina el fondo y tocarlo cierra', async ({ page }) => {
    await openMobile(page);
    await page.locator('.nav-trigger--mobile').click();

    const backdrop = page.locator('[data-nav-backdrop]');
    await expect(backdrop).toBeVisible();
    const filter = await backdrop.evaluate((el) => getComputedStyle(el).backdropFilter);
    expect(filter).toContain('blur');

    // Se toca la franja izquierda, que el panel (anclado a la derecha) no cubre.
    await page.mouse.click(12, 400);
    await expect(page.locator('#site-nav')).toHaveAttribute('data-open', 'false');
    await expect(backdrop).toBeHidden();
  });

  /**
   * Regresión: al cerrar, el panel pasaba a `visibility: hidden` en el mismo
   * instante y el backdrop se desmontaba, así que la salida no se veía.
   *
   * Se captura el estado JUSTO cuando cambia `data-open`, con un
   * MutationObserver, en vez de leerlo desde Playwright: un viaje de ida y
   * vuelta al navegador puede superar los 220 ms de la transición y el test
   * pasaría por casualidad.
   */
  test('al cerrar, panel y backdrop siguen visibles mientras salen', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await openMobile(page);
    await page.locator('.nav-trigger--mobile').click();
    await expect(page.locator('#site-nav')).toHaveAttribute('data-open', 'true');

    const atClose = page.evaluate(
      () =>
        new Promise<{ panel: string; backdrop: string | null }>((resolve) => {
          const nav = document.getElementById('site-nav')!;
          new MutationObserver(() => {
            if (nav.getAttribute('data-open') !== 'false') return;
            const backdrop = document.querySelector<HTMLElement>('[data-nav-backdrop]');
            resolve({
              panel: getComputedStyle(nav).visibility,
              backdrop: backdrop ? getComputedStyle(backdrop).visibility : null,
            });
          }).observe(nav, { attributes: true, attributeFilter: ['data-open'] });
        }),
    );

    await page.getByRole('button', { name: 'Close menu' }).click();
    expect(await atClose).toEqual({ panel: 'visible', backdrop: 'visible' });

    // Y al terminar la transición, ambos quedan ocultos.
    await expect
      .poll(() => page.locator('#site-nav').evaluate((el) => getComputedStyle(el).visibility))
      .toBe('hidden');
    await expect(page.locator('[data-nav-backdrop]')).toBeHidden();
  });

  test('con el panel abierto el fondo no hace scroll', async ({ page }) => {
    await openMobile(page);
    await addHeight(page);
    await page.locator('.nav-trigger--mobile').click();

    await expect(page.locator('html')).toHaveAttribute('data-nav-open', '');
    const overflow = await page.evaluate(() => getComputedStyle(document.documentElement).overflow);
    expect(overflow).toBe('hidden');

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.move(12, 400);
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => window.scrollY)).toBe(before);

    // Al cerrar se libera.
    await page.keyboard.press('Escape');
    await expect(page.locator('html')).not.toHaveAttribute('data-nav-open', '');
  });

  test('el toggle de tema muestra solo el icono en móvil y el texto en escritorio', async ({
    page,
  }) => {
    await openMobile(page);
    const label = page.locator('[data-theme-preference] span');
    await expect(label).toBeHidden();

    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(label).toBeVisible();
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
