import { describe, expect, it, vi } from 'vitest';

import {
  buildEmail,
  isHoneypotFilled,
  processContact,
  validateContact,
  type OutgoingEmail,
} from '@/lib/contact';
import { createResendSender } from '@/lib/resend';

/** 05-pages/contact.md, ADR-0020, Q38. */

const valid = { name: 'Ana', email: 'ana@example.com', message: 'Hola, tengo un proyecto.' };

describe('validateContact', () => {
  it('acepta un mensaje válido y recorta espacios', () => {
    const result = validateContact({ ...valid, name: '  Ana  ' });
    expect(result).toEqual({ ok: true, data: { ...valid, name: 'Ana' } });
  });

  it('respeta acentos y cuenta caracteres, no bytes', () => {
    expect(validateContact({ ...valid, name: 'Íñ' }).ok).toBe(true);
  });

  it('campos vacíos o ausentes son "required", aunque tengan espacios', () => {
    const result = validateContact({ name: '   ', message: '' });
    expect(result).toEqual({
      ok: false,
      fields: { name: 'required', email: 'required', message: 'required' },
    });
  });

  it('límites de longitud', () => {
    expect(validateContact({ ...valid, name: 'A' })).toMatchObject({ fields: { name: 'tooShort' } });
    expect(validateContact({ ...valid, name: 'A'.repeat(81) })).toMatchObject({
      fields: { name: 'tooLong' },
    });
    expect(validateContact({ ...valid, message: 'corto' })).toMatchObject({
      fields: { message: 'tooShort' },
    });
    expect(validateContact({ ...valid, message: 'x'.repeat(2001) })).toMatchObject({
      fields: { message: 'tooLong' },
    });
  });

  it('correo con formato inválido o demasiado largo', () => {
    expect(validateContact({ ...valid, email: 'no-es-un-correo' })).toMatchObject({
      fields: { email: 'invalidEmail' },
    });
    expect(validateContact({ ...valid, email: `${'a'.repeat(250)}@x.io` })).toMatchObject({
      fields: { email: 'tooLong' },
    });
  });

  it('ignora tipos que no son texto', () => {
    expect(validateContact({ ...valid, name: 42 })).toMatchObject({ fields: { name: 'required' } });
  });
});

describe('honeypot', () => {
  it('vacío o ausente no es un bot', () => {
    expect(isHoneypotFilled(valid)).toBe(false);
    expect(isHoneypotFilled({ ...valid, website: '  ' })).toBe(false);
  });

  it('relleno es un bot', () => {
    expect(isHoneypotFilled({ ...valid, website: 'http://spam.example' })).toBe(true);
  });
});

describe('buildEmail — ADR-0020', () => {
  it('asunto con el origen, texto plano y Reply-To del visitante', () => {
    expect(buildEmail(valid)).toEqual({
      subject: '[Portfolio] Mensaje de Ana',
      text: 'Nombre: Ana\nCorreo: ana@example.com\n\nHola, tengo un proyecto.\n',
      replyTo: 'ana@example.com',
    });
  });
});

describe('processContact', () => {
  it('envía un mensaje válido', async () => {
    const send = vi.fn(async (_: OutgoingEmail) => {});
    expect(await processContact(valid, send)).toEqual({ kind: 'sent' });
    expect(send).toHaveBeenCalledOnce();
  });

  it('un bot recibe "ignored" SIN enviar, aunque el resto sea basura', async () => {
    const send = vi.fn(async (_: OutgoingEmail) => {});
    expect(await processContact({ website: 'x', name: '' }, send)).toEqual({ kind: 'ignored' });
    expect(send).not.toHaveBeenCalled();
  });

  it('no envía un mensaje inválido', async () => {
    const send = vi.fn(async (_: OutgoingEmail) => {});
    const outcome = await processContact({ ...valid, email: 'mal' }, send);
    expect(outcome).toEqual({ kind: 'invalid', fields: { email: 'invalidEmail' } });
    expect(send).not.toHaveBeenCalled();
  });

  it('un fallo del envío es "failed", nunca una excepción', async () => {
    const outcome = await processContact(valid, async () => {
      throw new Error('red caída');
    });
    expect(outcome).toEqual({ kind: 'failed' });
  });
});

describe('createResendSender', () => {
  const config = { apiKey: 're_test', from: 'onboarding@resend.dev', to: 'dev@example.com' };
  const email = buildEmail(valid);

  it('llama a la API REST con los nombres de campo de Resend', async () => {
    const fetchImpl = vi.fn(async () => new Response('{"id":"1"}', { status: 200 }));
    await createResendSender(config, fetchImpl as unknown as typeof fetch)(email);

    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer re_test');
    expect(JSON.parse(init.body as string)).toEqual({
      from: 'onboarding@resend.dev',
      to: ['dev@example.com'],
      subject: '[Portfolio] Mensaje de Ana',
      text: email.text,
      reply_to: 'ana@example.com',
    });
  });

  it('una respuesta de error lanza, sin incluir el contenido del mensaje', async () => {
    const fetchImpl = vi.fn(async () => new Response(email.text, { status: 403 }));
    const send = createResendSender(config, fetchImpl as unknown as typeof fetch);
    await expect(send(email)).rejects.toThrow('Resend respondió 403');
    await expect(send(email)).rejects.not.toThrow(/Hola/);
  });
});
