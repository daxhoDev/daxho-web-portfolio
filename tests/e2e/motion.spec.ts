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

  test('con reduced-motion el disparo por viewport ni se instala', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/styleguide');
    await page.waitForLoadState('networkidle');

    // TypingObserver se sale antes de marcar el documento: no hay nada que
    // pausar porque el CSS ya deja el texto completo y estático.
    await expect(page.locator('html')).not.toHaveAttribute('data-typing-js', /.*/);
    await expect(page.getByRole('heading', { name: '08 · ProjectCard' })).toBeVisible();
  });

  test('sin reduced-motion los encabezados se teclean al entrar en pantalla', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/styleguide');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('html')).toHaveAttribute('data-typing-js', '');

    // Un encabezado del final de la página: todavía no se ha tecleado.
    const heading = page.getByRole('heading', { name: '08 · ProjectCard' });
    const typing = heading.locator('.typing');
    await expect(typing).not.toHaveClass(/is-typing/);

    const pausedState = await typing
      .locator('.typing-char')
      .first()
      .evaluate((el) => getComputedStyle(el).animationPlayState);
    expect(pausedState).toBe('paused');

    await heading.scrollIntoViewIfNeeded();
    await expect(typing).toHaveClass(/is-typing/);
  });

  test('el encabezado se teclea UNA sola vez: el hover no lo repite', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/styleguide');
    await page.waitForLoadState('networkidle');

    const heading = page.getByRole('heading', { name: '08 · ProjectCard' });
    const typing = heading.locator('.typing');

    await heading.scrollIntoViewIfNeeded();
    await expect(typing).toHaveClass(/is-typing/);

    // El observador deja de observar tras el primer disparo, y no hay ningún
    // listener de hover ni de foco: la clase se queda puesta y nada reinicia
    // la animación.
    await heading.hover();
    await expect(typing).toHaveClass(/is-typing/);
  });

  test('sin el marcador de JavaScript el tecleo arranca con la carga (mejora progresiva)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/styleguide');
    await page.waitForLoadState('networkidle');

    // Reproduce el caso sin JavaScript: sin `data-typing-js` la pausa no
    // aplica y la animación corre desde la carga. El texto nunca queda
    // invisible por no haberse ejecutado el script.
    const state = await page.evaluate(() => {
      document.documentElement.removeAttribute('data-typing-js');
      const char = document.querySelector<HTMLElement>(
        '.typing[data-typing-trigger="viewport"]:not(.is-typing) .typing-char',
      );
      return char ? getComputedStyle(char).animationPlayState : null;
    });
    expect(state).toBe('running');
  });

  test('el cursor de los encabezados se apaga al terminar', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/styleguide');

    const caret = page
      .getByRole('heading', { name: '01 · Color' })
      .locator('.caret--transient');

    // Dos animaciones: el parpadeo y el apagado que lo remata. La segunda es
    // la que gana al vencer su retardo (ver effects.css).
    const names = await caret.evaluate((el) => getComputedStyle(el).animationName);
    expect(names).toContain('caret-blink');
    expect(names).toContain('caret-off');
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
