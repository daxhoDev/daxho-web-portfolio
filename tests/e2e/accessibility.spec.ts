import { expect, test } from '@playwright/test';

test.describe('accesibilidad', () => {
  test('hay exactamente un <h1>', async ({ page }) => {
    await page.goto('/styleguide');
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('el skip link es el primer elemento tabulable', async ({ page }) => {
    await page.goto('/styleguide');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveText('Skip to content');
  });

  test('los controles interactivos muestran anillo de foco', async ({ page }) => {
    await page.goto('/styleguide');
    const button = page.getByRole('button', { name: /^Theme:/ });
    await button.focus();
    const outlineWidth = await button.evaluate(
      (el) => getComputedStyle(el).outlineWidth,
    );
    expect(outlineWidth).not.toBe('0px');
  });

  test('los botones cumplen el área táctil mínima de 44px', async ({ page }) => {
    await page.goto('/styleguide');
    const buttons = page.getByRole('link', { name: /View details/ });
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });

  test('la página no provoca scroll horizontal', async ({ page }) => {
    await page.goto('/styleguide');
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflows).toBe(false);
  });
});
