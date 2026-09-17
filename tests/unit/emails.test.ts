/**
 * Plantillas de correo — 14-email.md (APROBADA), fase 11.
 *
 * Lo que se prueba aquí es lo que no se puede ver en Gmail: que el contenido
 * llega entero, que el texto del visitante nunca se interpreta como HTML, que
 * un fallo de plantilla no deja a Daxho sin aviso, y que los colores literales
 * no se han desincronizado de `tokens.css`.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { renderContactNotification } from '@/emails/render';
import { cls, fonts, palette, styles } from '@/emails/theme';
import { buildEmail, processContact, type OutgoingEmail } from '@/lib/contact';
import { createResendSender } from '@/lib/resend';

const SITE = 'https://daxho.dev';

const BASE = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Hola, quiero hablar de un proyecto.',
  lang: 'es',
  siteUrl: SITE,
} as const;

function readRepoFile(relative: string): string {
  return readFileSync(fileURLToPath(new URL(`../../${relative}`, import.meta.url)), 'utf8');
}

describe('ContactNotification — contenido', () => {
  it('lleva nombre, correo y mensaje', async () => {
    const html = await renderContactNotification({ ...BASE });

    expect(html).toContain('Ada Lovelace');
    expect(html).toContain('ada@example.com');
    expect(html).toContain('Hola, quiero hablar de un proyecto.');
  });

  it('el correo del visitante es un enlace mailto, y el botón de responder también', async () => {
    const html = await renderContactNotification({ ...BASE });
    const mailtos = html.match(/mailto:ada@example\.com/g) ?? [];

    expect(mailtos.length).toBeGreaterThanOrEqual(2); // el dato y el botón
    expect(html).toContain('Responder');
  });

  it('identifica la marca y el idioma de la página del visitante', async () => {
    const es = await renderContactNotification({ ...BASE });
    expect(es).toContain('daxho');
    expect(es).toContain('▮');
    expect(es).toContain('Español (ES)');

    const en = await renderContactNotification({ ...BASE, lang: 'en' });
    expect(en).toContain('Inglés (EN)');
  });

  it('el pie dice de dónde viene el aviso', async () => {
    const html = await renderContactNotification({ ...BASE });
    expect(html).toContain(`Enviado desde el formulario de contacto de ${SITE}`);
  });

  it('es un documento completo, con doctype', async () => {
    const html = await renderContactNotification({ ...BASE });
    expect(html.toLowerCase()).toContain('<!doctype html');
    expect(html).toContain('<html');
  });
});

describe('ContactNotification — seguridad', () => {
  it('escapa el HTML que escriba el visitante, en el mensaje y en el nombre', async () => {
    const html = await renderContactNotification({
      ...BASE,
      name: '<b>Ada</b>',
      message: '<script>alert(1)</script> y <b>negrita</b>',
    });

    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).not.toContain('<b>Ada</b>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;b&gt;');
  });

  it('no hay ni un `dangerouslySetInnerHTML` en src/emails/', () => {
    const sources = [
      'src/emails/theme.ts',
      'src/emails/render.ts',
      'src/emails/ContactNotification.tsx',
      'src/emails/components/EmailLayout.tsx',
    ];

    for (const file of sources) {
      // Se busca el USO (`prop={...}` o `prop: ...`), no la palabra: los
      // comentarios de estos archivos la citan justamente para prohibirla.
      expect(readRepoFile(file)).not.toMatch(/dangerouslySetInnerHTML\s*[=:]/);
    }
  });
});

describe('ContactNotification — formato', () => {
  it('conserva los saltos de línea del visitante', async () => {
    const html = await renderContactNotification({
      ...BASE,
      message: 'Primera línea\nSegunda línea\n\nCuarta línea',
    });

    // El texto viaja íntegro y el bloque lo respeta con `pre-wrap`: sin eso,
    // el navegador colapsaría los tres saltos en un espacio.
    expect(html).toContain('Primera línea\nSegunda línea\n\nCuarta línea');
    expect(styles.message.whiteSpace).toBe('pre-wrap');
  });

  it('la variante oscura viaja en un <style>, porque @media no cabe en un atributo', async () => {
    const html = await renderContactNotification({ ...BASE });

    expect(html).toContain('@media (prefers-color-scheme: dark)');
    expect(html).toContain(`.${cls.base}`);
    // Sin `!important` el estilo en línea gana y el modo oscuro no se vería.
    expect(html).toContain(`background-color: ${palette.dark.base} !important`);
    expect(html).toContain('name="color-scheme"');
  });

  it('no usa `rem` en ninguna medida: hay clientes que no lo soportan', () => {
    for (const [name, rule] of Object.entries(styles)) {
      for (const [property, value] of Object.entries(rule)) {
        if (typeof value === 'string') {
          expect(`${name}.${property} = ${value}`).not.toMatch(/\d\s*rem\b/);
        }
      }
    }
  });
});

describe('theme.ts frente a tokens.css', () => {
  const css = readRepoFile('src/styles/tokens.css');

  /** Variables de un bloque, empezando en la primera línea que lo abre. */
  function varsAfter(marker: string): Record<string, string> {
    const start = css.indexOf(marker);
    expect(start, `no se encontró el bloque ${marker}`).toBeGreaterThan(-1);
    const chunk = css.slice(start, css.indexOf('\n}', start));
    const vars: Record<string, string> = {};
    for (const [, name, value] of chunk.matchAll(/--([\w-]+):\s*(#[0-9a-f]{3,8});/gi)) {
      vars[name] ??= value.toLowerCase();
    }
    return vars;
  }

  const light = varsAfter('\n:root {\n  color-scheme: light;');
  const dark = varsAfter(
    "@media (prefers-color-scheme: dark) {\n  :root:not([data-theme='light']) {",
  );

  const MAP: Record<keyof typeof palette.light, string> = {
    base: 'bg-base',
    surface: 'bg-surface',
    inset: 'bg-inset',
    text: 'fg-primary',
    textMuted: 'fg-secondary',
    accent: 'accent-text',
    buttonBg: 'accent-surface',
    buttonText: 'accent-on-surface',
  };

  for (const [key, token] of Object.entries(MAP)) {
    it(`claro: ${key} === --${token}`, () => {
      expect(palette.light[key as keyof typeof palette.light]).toBe(light[token]);
    });

    it(`oscuro: ${key} === --${token}`, () => {
      expect(palette.dark[key as keyof typeof palette.dark]).toBe(dark[token]);
    });
  }

  it('las pilas de fuentes son las del sitio sin las fuentes web', () => {
    const stack = (name: string) =>
      css
        .slice(css.indexOf(`--font-${name}:`))
        .split(';')[0]
        .replace(`--font-${name}:`, '')
        .replace(/\s+/g, ' ')
        .trim();

    expect(stack('mono')).toContain(fonts.mono);
    expect(stack('sans')).toContain(fonts.sans);
    // Y las autoalojadas se quedan fuera: Gmail no las carga.
    expect(fonts.mono).not.toContain('JetBrains');
    expect(fonts.sans).not.toContain('Inter');
  });
});

describe('envío: HTML y texto plano juntos', () => {
  const input = { name: BASE.name, email: BASE.email, message: BASE.message };

  it('el texto plano no cambia por tener HTML', () => {
    const email = buildEmail({ name: BASE.name, email: BASE.email, message: BASE.message });
    expect(email.text).toBe(`Nombre: ${BASE.name}\nCorreo: ${BASE.email}\n\n${BASE.message}\n`);
    expect(email.html).toBeUndefined();
  });

  it('adjunta el HTML renderizado al aviso', async () => {
    let sent: OutgoingEmail | undefined;
    const outcome = await processContact(
      input,
      async (email) => {
        sent = email;
      },
      async () => '<html>hola</html>',
    );

    expect(outcome).toEqual({ kind: 'sent' });
    expect(sent?.html).toBe('<html>hola</html>');
    expect(sent?.text).toContain(BASE.message);
  });

  it('si el render falla, el aviso sale igual con solo texto plano', async () => {
    let sent: OutgoingEmail | undefined;
    const outcome = await processContact(
      input,
      async (email) => {
        sent = email;
      },
      async () => {
        throw new Error('plantilla rota');
      },
    );

    expect(outcome).toEqual({ kind: 'sent' });
    expect(sent?.html).toBeUndefined();
    expect(sent?.text).toContain(BASE.message);
  });

  it('Resend recibe `html` y `text` en la misma petición', async () => {
    let body: Record<string, unknown> = {};
    const send = createResendSender(
      { apiKey: 'k', from: 'a@b.c', to: 'd@e.f' },
      async (_url, init) => {
        body = JSON.parse(String(init?.body));
        return new Response('{}', { status: 200 });
      },
    );

    await send({ subject: 's', text: 'plano', replyTo: 'ada@example.com', html: '<html></html>' });

    expect(body.text).toBe('plano');
    expect(body.html).toBe('<html></html>');
  });

  it('sin HTML, la petición no lleva el campo: no se envía un `html` vacío', async () => {
    let body: Record<string, unknown> = {};
    const send = createResendSender(
      { apiKey: 'k', from: 'a@b.c', to: 'd@e.f' },
      async (_url, init) => {
        body = JSON.parse(String(init?.body));
        return new Response('{}', { status: 200 });
      },
    );

    await send({ subject: 's', text: 'plano', replyTo: 'ada@example.com' });

    expect(body.text).toBe('plano');
    expect('html' in body).toBe(false);
  });
});
