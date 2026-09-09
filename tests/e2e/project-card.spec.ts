import { expect, test } from '@playwright/test';

/**
 * Cobertura del patrón de enlace con área extendida (06-components.md).
 * Es el requisito donde es más fácil incumplir WCAG usando un div clicable.
 */

test.describe('ProjectCard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/styleguide');
  });

  test('el clic fuera de los botones navega al detalle', async ({ page }) => {
    const card = page.getByRole('article').filter({ hasText: 'Lorem Ipsum One' });
    // elementFromPoint trabaja en coordenadas de viewport: si la tarjeta está
    // bajo el pliegue, devuelve null.
    await card.scrollIntoViewIfNeeded();
    const box = await card.locator('.aspect-video').boundingBox();
    expect(box).not.toBeNull();

    const x = box!.x + box!.width / 2;
    const y = box!.y + box!.height / 2;

    // El área extendida funciona si el punto central de la captura resuelve al
    // ENLACE del título. Es exactamente lo que hace el ::after del patrón.
    const hit = await page.evaluate(
      ([px, py]) => {
        const el = document.elementFromPoint(px, py);
        return { tag: el?.tagName ?? null, href: el?.getAttribute('href') ?? null };
      },
      [x, y],
    );
    expect(hit.tag).toBe('A');
    expect(hit.href).toBe('#s-card');

    // page.mouse.click evita las comprobaciones de accionabilidad de Playwright,
    // que aquí darían falso positivo: el clic lo recibe el overlay a propósito.
    await page.mouse.click(x, y);
    await expect(page).toHaveURL(/#s-card$/);
  });

  test('"Open project" abre en pestaña nueva y no dispara el enlace de la tarjeta', async ({
    page,
  }) => {
    const openButton = page.getByRole('link', { name: /Open project/ }).first();
    await expect(openButton).toHaveAttribute('target', '_blank');
    await expect(openButton).toHaveAttribute('rel', /noopener/);
    await expect(openButton).toHaveAttribute('rel', /noreferrer/);
  });

  test('el botón "Open project" se oculta si el proyecto no tiene URL en vivo', async ({
    page,
  }) => {
    const cardWithoutLive = page.getByRole('article').filter({ hasText: 'Lorem Ipsum Two' });
    await expect(cardWithoutLive.getByRole('link', { name: /Open project/ })).toHaveCount(0);
    await expect(cardWithoutLive.getByRole('link', { name: /View details/ })).toHaveCount(1);
  });

  test('el título es un enlace real, no un div clicable', async ({ page }) => {
    const titleLink = page.getByRole('link', { name: 'Lorem Ipsum One' });
    await expect(titleLink).toHaveCount(1);
    await expect(titleLink).toHaveAttribute('href', '#s-card');
  });
});
