import { expect, test, type Page } from '@playwright/test';

import { hydrated } from './helpers';

/**
 * 05-pages/contact.md (APROBADA). Ningún test envía un correo real: la ruta con
 * JavaScript se simula con `page.route`, y la ruta sin JavaScript solo ejercita
 * casos que el endpoint resuelve sin llamar a Resend (validación y honeypot).
 */

async function visit(page: Page, path = '/contact', lang: 'en' | 'es' = 'en') {
  await page.addInitScript((l) => {
    window.localStorage.setItem('lang', l);
    window.sessionStorage.setItem('booted', '1');
  }, lang);
  await page.goto(path);
  await hydrated(page, '[data-contact-form]');
}

async function fillValid(page: Page) {
  await page.getByLabel('Name').fill('Ana');
  await page.getByLabel('Email').fill('ana@example.com');
  await page.getByLabel('Message').fill('Hola, tengo un proyecto para ti.');
}

test.describe('/contact — página', () => {
  test('h1, frase en voz de terminal y sin correo publicado', async ({ page }) => {
    await visit(page, '/es/contact', 'es');
    // Acotado a <main>: en local la barra de desarrollo de Astro añade sus
    // propios <h1> en un shadow DOM, y Playwright los atraviesa.
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.getByText('listo cuando tú lo estés. Cuéntame tu proyecto.')).toBeVisible();
    const html = await page.content();
    expect(html).not.toContain('mailto:');
    expect(html).not.toContain('developer.daxho@gmail.com');
    await expect(page.locator('[data-contact-elsewhere]').getByRole('link')).toHaveText([
      'GitHub',
      'LinkedIn',
    ]);
  });

  test('cada campo tiene su <label> y es un <form> HTML real', async ({ page }) => {
    await visit(page);
    const form = page.locator('[data-contact-form]');
    await expect(form).toHaveAttribute('method', 'post');
    await expect(form).toHaveAttribute('action', '/api/contact');
    for (const label of ['Name', 'Email', 'Message']) {
      await expect(page.getByLabel(label)).toHaveAttribute('required', '');
    }
    await expect(page.getByLabel('Name')).not.toHaveAttribute('placeholder', /.*/);
  });
});

test.describe('/contact — honeypot', () => {
  test('fuera de pantalla, fuera del teclado y del árbol de accesibilidad', async ({ page }) => {
    await visit(page);
    const trap = page.locator('input[name="website"]');
    await expect(trap).toHaveAttribute('tabindex', '-1');
    await expect(trap).toHaveAttribute('autocomplete', 'off');
    await expect(page.locator('.honeypot')).toHaveAttribute('aria-hidden', 'true');

    const box = await trap.boundingBox();
    expect(box!.x + box!.width).toBeLessThan(0);

    // Tabulando desde el nombre, el foco nunca cae en la trampa.
    await page.getByLabel('Name').focus();
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => document.activeElement?.getAttribute('name'))).not.toBe(
        'website',
      );
    }
  });
});

test.describe('/contact — con JavaScript (API simulada)', () => {
  test('validación en cliente: errores enlazados, foco al primero y sin petición', async ({
    page,
  }) => {
    let requests = 0;
    await page.route('**/api/contact', (route) => {
      requests += 1;
      return route.fulfill({ json: { ok: true } });
    });
    await visit(page);

    await page.getByLabel('Email').fill('no-es-un-correo');
    await page.getByRole('button', { name: 'Send message' }).click();

    const name = page.getByLabel('Name');
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(name).toBeFocused();
    await expect(name).toHaveAccessibleDescription('This field is required.');
    await expect(page.getByLabel('Email')).toHaveAccessibleDescription(
      'Enter a valid email address.',
    );
    await expect(page.getByLabel('Message')).toHaveAccessibleDescription(
      'This field is required.',
    );
    await expect(page.locator('[data-contact-feedback]')).toHaveText(
      'Please check the highlighted fields.',
    );
    expect(requests).toBe(0);
  });

  test('envío correcto: botón deshabilitado mientras envía, confirmación y formulario limpio', async ({
    page,
  }) => {
    let body: Record<string, unknown> = {};
    await page.route('**/api/contact', async (route) => {
      body = route.request().postDataJSON();
      await new Promise((resolve) => setTimeout(resolve, 400));
      await route.fulfill({ json: { ok: true } });
    });
    await visit(page);
    await fillValid(page);

    const button = page.getByRole('form').or(page.locator('[data-contact-form]')).locator('button[type="submit"]');
    await button.click();
    await expect(button).toBeDisabled();
    await expect(button).toHaveText('Sending…');

    await expect(page.locator('[data-contact-feedback]')).toHaveText(
      'Message sent. I will get back to you soon.',
    );
    await expect(page.getByLabel('Name')).toHaveValue('');
    await expect(button).toBeEnabled();
    expect(body).toMatchObject({ name: 'Ana', email: 'ana@example.com', lang: 'en', website: '' });
  });

  test('errores de campo devueltos por el servidor', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 400, json: { ok: false, error: 'invalid', fields: { email: 'invalidEmail' } } }),
    );
    await visit(page);
    await fillValid(page);
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByLabel('Email')).toBeFocused();
  });

  test('429 del firewall: mensaje específico aunque el cuerpo no sea JSON', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 429, contentType: 'text/html', body: '<h1>Too Many Requests</h1>' }),
    );
    await visit(page, '/es/contact', 'es');
    await page.getByLabel('Nombre').fill('Ana');
    await page.getByLabel('Correo').fill('ana@example.com');
    await page.getByLabel('Mensaje').fill('Hola, tengo un proyecto para ti.');
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(page.locator('[data-contact-feedback]')).toHaveText(
      'Demasiados mensajes en poco tiempo. Inténtalo de nuevo en 10 minutos.',
    );
  });

  test('fallo del servidor: mensaje genérico sin detalles internos', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 502, json: { ok: false, error: 'failed' } }),
    );
    await visit(page);
    await fillValid(page);
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('[data-contact-feedback]')).toHaveText(
      'The message could not be sent. Please try again in a few minutes.',
    );
    await expect(page.getByLabel('Name')).toHaveValue('Ana');
  });
});

test.describe('/api/contact — endpoint real, sin enviar correo', () => {
  test('JSON inválido → 400 con los campos', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: { name: 'A', email: 'mal', message: '' },
    });
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: 'invalid',
      fields: { name: 'tooShort', email: 'invalidEmail', message: 'required' },
    });
  });

  test('honeypot relleno → éxito para el bot, sin enviar nada', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: { website: 'http://spam.example', name: '', email: '', message: '' },
    });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  test('sin JavaScript: formulario inválido → 303 a la página de error del idioma', async ({
    request,
  }) => {
    const response = await request.post('/api/contact', {
      form: { lang: 'es', name: 'A', email: 'mal', message: '' },
      headers: { Origin: 'http://localhost:4321' },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(303);
    expect(response.headers().location).toBe('/es/contact/error');
  });

  test('sin JavaScript: honeypot relleno → 303 a la página de éxito', async ({ request }) => {
    const response = await request.post('/api/contact', {
      form: { lang: 'en', website: 'x', name: '', email: '', message: '' },
      headers: { Origin: 'http://localhost:4321' },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(303);
    expect(response.headers().location).toBe('/contact/sent');
  });
});

test.describe('/api/contact — protección CSRF de Astro', () => {
  /**
   * `security.checkOrigin` (activo por defecto) rechaza un POST de formulario
   * cuyo Origin no es el del sitio. Un formulario ajeno no puede usar el
   * endpoint para mandarte correo a través del navegador de un tercero.
   */
  test('un formulario desde otro origen → 403', async ({ request }) => {
    const response = await request.post('/api/contact', {
      form: { lang: 'en', name: 'Ana', email: 'ana@example.com', message: 'Hola desde fuera.' },
      headers: { Origin: 'https://evil.example' },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(403);
  });
});

test.describe('/contact — navegador sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('el <form> HTML envía y llega a la página de resultado', async ({ page }) => {
    await page.goto('/es/contact');
    // Rellenar la trampa es lo único que resuelve el endpoint sin llamar a
    // Resend: así se comprueba el cableado del formulario sin enviar un correo.
    await page.locator('input[name="website"]').fill('bot');
    await page.getByLabel('Nombre').fill('Ana');
    await page.getByLabel('Correo').fill('ana@example.com');
    await page.getByLabel('Mensaje').fill('Hola, tengo un proyecto para ti.');
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();

    await expect(page).toHaveURL(/\/es\/contact\/sent$/);
    await expect(page.locator('[data-contact-result="sent"]')).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
});
