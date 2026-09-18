/**
 * POST /api/contact — 05-pages/contact.md (APROBADA), ADR-0004, ADR-0020.
 *
 * La ÚNICA ruta con servidor del sitio. Atiende dos clientes:
 * - la isla, con JavaScript: petición JSON → respuesta JSON;
 * - el <form> HTML, sin JavaScript: petición de formulario → redirección 303 a
 *   la página de resultado del idioma.
 *
 * El límite por IP (Q38) NO está aquí: lo aplica una regla del firewall de
 * Vercel antes de que la petición llegue a la función (08-integrations.md).
 */
import type { APIRoute } from 'astro';
import { CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, RESEND_API_KEY } from 'astro:env/server';

import { renderContactNotification } from '@/emails/render';
import { isLang, localizePath, type Lang } from '@/i18n/utils';
import { processContact, type ContactData, type ContactOutcome } from '@/lib/contact';
import { createResendSender } from '@/lib/resend';

export const prerender = false;

async function readInput(
  request: Request,
): Promise<{ json: boolean; input: Record<string, unknown> }> {
  const type = request.headers.get('content-type') ?? '';
  if (type.includes('application/json')) {
    const body: unknown = await request.json();
    return {
      json: true,
      input: body && typeof body === 'object' ? (body as Record<string, unknown>) : {},
    };
  }
  const form = await request.formData();
  return { json: false, input: Object.fromEntries(form.entries()) };
}

const JSON_STATUS: Record<ContactOutcome['kind'], number> = {
  sent: 200,
  ignored: 200, // un bot ve lo mismo que una persona (Q38)
  invalid: 400,
  failed: 502,
};

export const POST: APIRoute = async ({ request, redirect }) => {
  let json: boolean;
  let input: Record<string, unknown>;
  try {
    ({ json, input } = await readInput(request));
  } catch {
    return Response.json({ ok: false, error: 'invalid' }, { status: 400 });
  }

  const lang: Lang = isLang(input.lang) ? input.lang : 'en';

  // El idioma de la página y la URL del sitio los conoce la ruta, no la
  // función pura: por eso el render llega ya cerrado sobre ellos (14-email.md).
  const renderHtml = (data: ContactData) =>
    renderContactNotification({ ...data, lang, siteUrl: import.meta.env.SITE });

  const outcome = RESEND_API_KEY
    ? await processContact(
        input,
        createResendSender({
          apiKey: RESEND_API_KEY,
          from: CONTACT_FROM_EMAIL,
          to: CONTACT_TO_EMAIL,
        }),
        renderHtml,
      )
    : await processContact(input, async () => {
        // Sin clave no se finge un envío: el visitante debe saber que no llegó.
        // Tampoco se renderiza la plantilla: nadie la va a leer.
        throw new Error('RESEND_API_KEY no configurada');
      });

  if (outcome.kind === 'failed') {
    // Nunca el contenido del mensaje: solo que algo falló (08-integrations.md).
    console.error(
      RESEND_API_KEY ? 'contact: fallo al enviar por Resend' : 'contact: falta RESEND_API_KEY',
    );
  }

  if (json) {
    const ok = outcome.kind === 'sent' || outcome.kind === 'ignored';
    return Response.json(
      ok
        ? { ok: true }
        : {
            ok: false,
            error: outcome.kind,
            ...(outcome.kind === 'invalid' && { fields: outcome.fields }),
          },
      { status: JSON_STATUS[outcome.kind] },
    );
  }

  const ok = outcome.kind === 'sent' || outcome.kind === 'ignored';
  return redirect(localizePath(ok ? '/contact/sent' : '/contact/error', lang), 303);
};
