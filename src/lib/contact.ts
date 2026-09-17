/**
 * Formulario de contacto — 05-pages/contact.md (APROBADA).
 *
 * UNA SOLA DEFINICIÓN para cliente y servidor: la isla valida con esto antes de
 * enviar (comodidad) y el endpoint vuelve a validar con esto (lo que cuenta).
 *
 * Funciones puras, sin red ni entorno: objetivo de Vitest. El envío real se
 * inyecta en `processContact`.
 */
import { z } from 'astro/zod';

/** Campo trampa (Q38). Fuera de pantalla: una persona nunca lo rellena. */
export const HONEYPOT_FIELD = 'website';

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  message: { min: 10, max: 2000 },
} as const;

export const contactSchema = z.object({
  name: z.string().trim().min(LIMITS.name.min).max(LIMITS.name.max),
  email: z.string().trim().max(LIMITS.email.max).pipe(z.email()),
  message: z.string().trim().min(LIMITS.message.min).max(LIMITS.message.max),
});

export type ContactData = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactData;
export type FieldError = 'required' | 'tooShort' | 'tooLong' | 'invalidEmail';
export type FieldErrors = Partial<Record<ContactField, FieldError>>;

const FIELDS: readonly ContactField[] = ['name', 'email', 'message'];

export type Validation = { ok: true; data: ContactData } | { ok: false; fields: FieldErrors };

/**
 * Valida y traduce los errores de Zod a códigos estables. Los textos no viven
 * aquí: cada idioma los pone a partir del código.
 */
export function validateContact(input: Record<string, unknown>): Validation {
  const values = Object.fromEntries(
    FIELDS.map((field) => [field, typeof input[field] === 'string' ? input[field] : '']),
  );
  const result = contactSchema.safeParse(values);
  if (result.success) return { ok: true, data: result.data };

  const fields: FieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField;
    if (fields[field]) continue; // el primer error de cada campo basta

    if (String(values[field] ?? '').trim() === '') fields[field] = 'required';
    else if (issue.code === 'too_big') fields[field] = 'tooLong';
    else if (issue.code === 'too_small') fields[field] = 'tooShort';
    else fields[field] = 'invalidEmail';
  }
  return { ok: false, fields };
}

/** ¿Ha caído un bot en la trampa? */
export function isHoneypotFilled(input: Record<string, unknown>): boolean {
  const value = input[HONEYPOT_FIELD];
  return typeof value === 'string' && value.trim() !== '';
}

export interface OutgoingEmail {
  subject: string;
  text: string;
  replyTo: string;
  /** Versión HTML (fase 11, `14-email.md`). Ausente si el render falló. */
  html?: string;
}

/**
 * Render de la plantilla. Se inyecta, como el envío: `contact.ts` no importa
 * React ni conoce el idioma de la página, que el llamante ya captura.
 */
export type HtmlRenderer = (data: ContactData) => Promise<string>;

/**
 * ADR-0020: asunto que identifica el origen, cuerpo en texto plano legible, y el
 * correo del visitante en `Reply-To` (nunca en `From`), para poder responder
 * directamente desde Gmail.
 */
export function buildEmail(data: ContactData): OutgoingEmail {
  return {
    subject: `[Portfolio] Mensaje de ${data.name}`,
    text: `Nombre: ${data.name}\nCorreo: ${data.email}\n\n${data.message}\n`,
    replyTo: data.email,
  };
}

export type ContactOutcome =
  | { kind: 'sent' }
  | { kind: 'ignored' }
  | { kind: 'invalid'; fields: FieldErrors }
  | { kind: 'failed' };

/**
 * Orden deliberado: el honeypot se comprueba ANTES de validar. Un bot recibe
 * éxito aunque el resto de campos sea basura: cualquier otra respuesta le diría
 * que hay una trampa.
 *
 * El render del HTML va en su propio `try`: un fallo de plantilla NO puede
 * impedir que el aviso llegue (`14-email.md`), así que se envía el texto plano
 * y el resultado sigue siendo `sent`.
 */
export async function processContact(
  input: Record<string, unknown>,
  send: (email: OutgoingEmail) => Promise<void>,
  renderHtml?: HtmlRenderer,
): Promise<ContactOutcome> {
  if (isHoneypotFilled(input)) return { kind: 'ignored' };

  const validation = validateContact(input);
  if (!validation.ok) return { kind: 'invalid', fields: validation.fields };

  const email = buildEmail(validation.data);
  if (renderHtml) {
    try {
      email.html = await renderHtml(validation.data);
    } catch {
      // Sin HTML, pero con aviso: el texto plano es el mínimo garantizado.
    }
  }

  try {
    await send(email);
    return { kind: 'sent' };
  } catch {
    return { kind: 'failed' };
  }
}
