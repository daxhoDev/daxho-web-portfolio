import { expect, test } from '@playwright/test';

import { hydrated } from './helpers';

/**
 * Cobertura de ADR-0011. El tema es de los comportamientos más frágiles del
 * sitio y solo se puede verificar de verdad en un navegador real.
 */

test.describe('tema', () => {
  test('sin preferencia guardada sigue al sistema (oscuro)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/styleguide');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('sin preferencia guardada sigue al sistema (claro)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/styleguide');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('la preferencia guardada gana sobre el sistema', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.addInitScript(() => window.localStorage.setItem('theme', 'light'));
    await page.goto('/styleguide');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('el toggle recorre los tres estados y persiste', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/styleguide');

    const toggle = page.getByRole('button', { name: /^Theme:/ });
    // Estado inicial: system (sin nada en localStorage)
    await expect(toggle).toHaveAttribute('data-theme-preference', 'system');

    await toggle.click(); // system -> light
    await expect(toggle).toHaveAttribute('data-theme-preference', 'light');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await toggle.click(); // light -> dark
    await expect(toggle).toHaveAttribute('data-theme-preference', 'dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Persiste tras recargar
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('button', { name: /^Theme:/ })).toHaveAttribute(
      'data-theme-preference',
      'dark',
    );
  });

  test('el toggle refleja el estado REAL al hidratarse, no un valor por defecto', async ({
    page,
  }) => {
    await page.addInitScript(() => window.localStorage.setItem('theme', 'dark'));
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/styleguide');

    const toggle = page.getByRole('button', { name: /^Theme:/ });
    await expect(toggle).toHaveAttribute('data-theme-preference', 'dark');
  });

  /**
   * El test que justifica el script inline de ADR-0011: el atributo data-theme
   * debe existir ya en el HTML servido, ANTES de que corra ningún JS de la
   * aplicación. Si el script se difiriera, aquí habría un fogonazo.
   */
  test('no hay flash: data-theme está puesto antes del primer pintado', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });

    await page.goto('/styleguide', { waitUntil: 'commit' });
    const themeDuringLoad = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme'),
    );
    expect(themeDuringLoad).toBe('dark');
  });

  test('el script sobrevive a un localStorage que lanza', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('almacenamiento bloqueado');
        },
      });
    });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/styleguide');

    // No debe romper la página: cae al media query del sistema.
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

test.describe('tema — idioma', () => {
  test('en español el toggle dice "Sistema", no "System"', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('lang', 'es');
      window.sessionStorage.setItem('booted', '1');
    });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/es');

    const toggle = page.getByRole('button', { name: /^Tema:/ });
    await expect(toggle).toHaveAccessibleName('Tema: Sistema. Pulsa para cambiar.');
    await expect(toggle.locator('span')).toHaveText('Sistema');

    await hydrated(page, '[data-theme-preference]');
    await toggle.click(); // system -> light
    await expect(toggle.locator('span')).toHaveText('Claro');
    await toggle.click(); // light -> dark
    await expect(toggle.locator('span')).toHaveText('Oscuro');
  });

  test('en inglés sigue diciendo "System"', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('lang', 'en');
      window.sessionStorage.setItem('booted', '1');
    });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.getByRole('button', { name: /^Theme:/ }).locator('span')).toHaveText(
      'System',
    );
  });
});
