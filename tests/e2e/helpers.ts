import type { Page } from '@playwright/test';

/**
 * Espera a que hidrate la isla que contiene `selector`.
 *
 * El botón de una isla existe en el HTML servido desde el primer momento, pero
 * React puede no haber enganchado aún el manejador: un clic en ese intervalo
 * no hace nada y el test falla de forma intermitente. Astro quita el atributo
 * `ssr` de <astro-island> al hidratar.
 */
export async function hydrated(page: Page, selector: string) {
  await page.waitForFunction((sel) => {
    const island = document.querySelector(sel)?.closest('astro-island');
    return Boolean(island) && !island!.hasAttribute('ssr');
  }, selector);
}
