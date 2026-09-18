/**
 * Formulario de contacto — 05-pages/contact.md (APROBADA).
 *
 * MEJORA PROGRESIVA. Lo que Astro renderiza en el servidor es un <form> HTML
 * normal con `method="post"` y `action="/api/contact"`: sin JavaScript, el
 * navegador valida con los atributos (`required`, `minLength`...), envía, y el
 * endpoint redirige a la página de resultado. Al hidratar, la isla intercepta
 * el envío: valida con el mismo esquema que el servidor, envía por `fetch` y
 * muestra los estados sin recargar.
 *
 * `noValidate` solo se activa DESPUÉS de hidratar: antes, la validación nativa
 * del navegador es la única que hay y no se puede apagar.
 *
 * Accesibilidad: cada error va enlazado a su campo con `aria-describedby`, el
 * campo lleva `aria-invalid`, y el resultado se anuncia en una región viva. Al
 * fallar la validación, el foco va al primer campo con error.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react';

import {
  HONEYPOT_FIELD,
  LIMITS,
  validateContact,
  type ContactField,
  type FieldError,
  type FieldErrors,
} from '@/lib/contact';

type Status = 'idle' | 'validating' | 'sending' | 'success' | 'error';

export interface ContactFormLabels {
  name: string;
  email: string;
  message: string;
  submit: string;
  sending: string;
  success: string;
  errorGeneric: string;
  errorRateLimited: string;
  errorFields: string;
  required: string;
  tooShort: string;
  tooLong: string;
  invalidEmail: string;
  honeypot: string;
}

interface Props {
  lang: string;
  labels: ContactFormLabels;
}

const FIELDS: readonly ContactField[] = ['name', 'email', 'message'];

export default function ContactForm({ lang, labels }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [feedback, setFeedback] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => setHydrated(true), []);

  const message = (field: ContactField, error: FieldError): string => {
    if (error === 'required') return labels.required;
    if (error === 'invalidEmail') return labels.invalidEmail;
    const limits: Record<string, number | undefined> = LIMITS[field];
    const n = error === 'tooShort' ? limits.min : limits.max;
    return (error === 'tooShort' ? labels.tooShort : labels.tooLong).replace('{n}', String(n));
  };

  const focusFirstError = (fields: FieldErrors) => {
    const first = FIELDS.find((field) => fields[field]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = Object.fromEntries(new FormData(form).entries());

    setStatus('validating');
    const validation = validateContact(input);
    if (!validation.ok) {
      setErrors(validation.fields);
      setStatus('error');
      setFeedback(labels.errorFields);
      focusFirstError(validation.fields);
      return;
    }

    setErrors({});
    setStatus('sending');
    setFeedback('');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(input),
      });

      // El 429 lo emite el firewall de Vercel, no el endpoint: su cuerpo no es
      // el JSON del sitio, así que se mira el estado antes de leerlo.
      if (response.status === 429) {
        setStatus('error');
        setFeedback(labels.errorRateLimited);
        return;
      }

      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        fields?: FieldErrors;
      } | null;

      if (response.ok && result?.ok) {
        form.reset();
        setStatus('success');
        setFeedback(labels.success);
        return;
      }

      if (result?.fields) {
        setErrors(result.fields);
        setStatus('error');
        setFeedback(labels.errorFields);
        focusFirstError(result.fields);
        return;
      }

      throw new Error('respuesta inesperada');
    } catch {
      setStatus('error');
      setFeedback(labels.errorGeneric);
    }
  }

  const sending = status === 'sending';

  const field = (name: ContactField, label: string, control: 'input' | 'textarea') => {
    const error = errors[name];
    const errorId = `contact-${name}-error`;
    const limits: Record<string, number | undefined> = LIMITS[name];
    const common = {
      id: `contact-${name}`,
      name,
      required: true,
      minLength: limits.min,
      maxLength: limits.max,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? errorId : undefined,
      className: [
        'bg-surface text-fg-primary w-full rounded-sm border px-3 py-2 font-sans',
        error ? 'border-accent-border' : 'border-interactive',
      ].join(' '),
    };

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={common.id} className="text-fg-primary font-mono text-sm">
          {label}
        </label>
        {control === 'textarea' ? (
          <textarea {...common} rows={6} />
        ) : (
          <input
            {...common}
            type={name === 'email' ? 'email' : 'text'}
            autoComplete={name === 'email' ? 'email' : 'name'}
          />
        )}
        {error && (
          <p id={errorId} className="text-accent-text text-sm">
            {message(name, error)}
          </p>
        )}
      </div>
    );
  };

  return (
    <form
      ref={formRef}
      method="post"
      action="/api/contact"
      noValidate={hydrated}
      onSubmit={onSubmit}
      className="flex max-w-(--container-reading) flex-col gap-6"
      data-contact-form
      data-status={status}
    >
      {/* El idioma decide a qué página de resultado redirige el endpoint. */}
      <input type="hidden" name="lang" value={lang} />

      {/* Honeypot (Q38): fuera de pantalla, fuera del orden de tabulación y
          fuera del árbol de accesibilidad. Una persona nunca lo rellena. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="contact-website">{labels.honeypot}</label>
        <input id="contact-website" name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {field('name', labels.name, 'input')}
      {field('email', labels.email, 'input')}
      {field('message', labels.message, 'textarea')}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={sending}
          className="bg-accent-surface text-accent-on-surface border-accent-border hover:bg-blood-600 inline-flex h-11 items-center rounded-sm border px-5 font-mono text-sm font-medium transition-colors disabled:opacity-60"
        >
          {sending ? labels.sending : labels.submit}
        </button>

        <p
          role="status"
          aria-live="polite"
          className={status === 'success' ? 'text-fg-primary text-sm' : 'text-accent-text text-sm'}
          data-contact-feedback
        >
          {feedback}
        </p>
      </div>
    </form>
  );
}
