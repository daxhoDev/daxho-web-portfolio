/**
 * Render del correo a HTML — 14-email.md (APROBADA).
 *
 * `render()` de React Email es asíncrono y devuelve el documento completo, con
 * doctype. Solo servidor: ni React Email ni estas plantillas entran en el
 * presupuesto de JS del sitio (ADR-0022).
 */
import { createElement } from 'react';
import { render } from 'react-email';

import { ContactNotification, type ContactNotificationProps } from '@/emails/ContactNotification';

export async function renderContactNotification(props: ContactNotificationProps): Promise<string> {
  return render(createElement(ContactNotification, props));
}
