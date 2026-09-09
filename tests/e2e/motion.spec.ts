import { expect, test } from '@playwright/test';

/**
 * Regla transversal e innegociable de ADR-0014: prefers-reduced-motion
 * desactiva todo el movimiento no esencial.
 */

test.describe('movimiento', () => {
  test('con reduced-motion el texto del typing es visible de inmediato', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/styleguide');

    const firstChar = page.locator('.typing-char').first();
    const opacity = await firstChar.evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });

  test('con reduced-motion el carrusel no se anima', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/styleguide');

    const track = page.locator('.carousel-track').first();
    const animationName = await track.evaluate(
      (el) => getComputedStyle(el).animationName,
    );
    expect(animationName).toBe('none');
  });

  test('con reduced-motion PowerGlitch ni se inicializa', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/styleguide');
    await page.waitForLoadState('networkidle');

    // Ni siquiera se paga el coste de reorganizar el DOM.
    await expect(page.locator('.glitch-container')).toHaveCount(0);
    await expect(page.locator('.glitch').first()).toBeVisible();
  });

  test('sin reduced-motion PowerGlitch envuelve los elementos y los clona', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/styleguide');
    await page.waitForLoadState('networkidle');

    const container = page.locator('.glitch-container').first();
    await expect(container).toBeVisible();

    // Los clones no deben duplicar el texto para un lector de pantalla.
    const hiddenLayers = await container.evaluate((el) => {
      const layers = el.firstElementChild?.children ?? [];
      return Array.from(layers)
        .slice(1)
        .every((layer) => layer.getAttribute('aria-hidden') === 'true');
    });
    expect(hiddenLayers).toBe(true);
  });

  test('sin reduced-motion el carrusel sí se anima', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/styleguide');

    const track = page.locator('.carousel-track').first();
    const animationName = await track.evaluate(
      (el) => getComputedStyle(el).animationName,
    );
    expect(animationName).toBe('carousel-scroll');
  });

  test('el simulador de la styleguide desactiva el movimiento', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/styleguide');

    await page.getByRole('button', { name: /Simular reduced-motion/ }).click();
    await expect(page.locator('html')).toHaveAttribute('data-reduce-motion', 'true');

    const track = page.locator('.carousel-track').first();
    const animationName = await track.evaluate(
      (el) => getComputedStyle(el).animationName,
    );
    expect(animationName).toBe('none');
  });

  test('el texto animado existe completo en el HTML (SEO y lectores de pantalla)', async ({
    page,
  }) => {
    await page.goto('/styleguide');
    const srText = page.locator('.sr-only', {
      hasText: "welcome to daxho's corner, what should we build?",
    });
    await expect(srText).toHaveCount(1);
  });
});
