/**
 * Envío por la API REST de Resend — ADR-0020, 08-integrations.md.
 *
 * Con `fetch` y sin el SDK: una sola petición no justifica una dependencia.
 * Solo servidor: recibe la clave, que jamás llega al cliente (ADR-0004).
 */
import type { OutgoingEmail } from '@/lib/contact';

export interface ResendConfig {
  apiKey: string;
  from: string;
  to: string;
}

export function createResendSender(config: ResendConfig, fetchImpl: typeof fetch = fetch) {
  return async function send(email: OutgoingEmail): Promise<void> {
    const response = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        subject: email.subject,
        text: email.text,
        reply_to: email.replyTo,
      }),
    });

    if (!response.ok) {
      // Solo el estado: el cuerpo de Resend puede repetir datos del mensaje, y
      // el contenido nunca se escribe en los logs (08-integrations.md).
      throw new Error(`Resend respondió ${response.status}`);
    }
  };
}
