/**
 * Aviso del formulario de contacto — 14-email.md (APROBADA).
 *
 * Único correo del sistema y único destinatario: Daxho. Por eso está en
 * español, el suyo, aunque el visitante escriba desde la versión inglesa.
 *
 * TODO el texto del visitante pasa por React como hijo de un nodo, que lo
 * escapa. `dangerouslySetInnerHTML` está PROHIBIDO en este directorio.
 */
import { Button, Link, Section, Text } from 'react-email';

import { EmailLayout } from '@/emails/components/EmailLayout';
import { cls, styles } from '@/emails/theme';
import type { Lang } from '@/i18n/utils';

export interface ContactNotificationProps {
  name: string;
  email: string;
  message: string;
  /** Idioma de la página desde la que escribió el visitante. */
  lang: Lang;
  siteUrl: string;
}

const LANG_LABEL: Record<Lang, string> = {
  en: 'Inglés (EN)',
  es: 'Español (ES)',
};

export function ContactNotification({
  name,
  email,
  message,
  lang,
  siteUrl,
}: ContactNotificationProps) {
  return (
    <EmailLayout preview={`Nuevo mensaje de ${name}`} siteUrl={siteUrl}>
      <Text className={cls.text} style={styles.title}>
        {'> '}nuevo mensaje
      </Text>

      <Section>
        <Text className={cls.muted} style={styles.label}>
          Nombre
        </Text>
        <Text className={cls.text} style={styles.value}>
          {name}
        </Text>

        <Text className={cls.muted} style={styles.label}>
          Correo
        </Text>
        <Text className={cls.text} style={styles.value}>
          <Link className={cls.accent} style={styles.link} href={`mailto:${email}`}>
            {email}
          </Link>
        </Text>

        <Text className={cls.muted} style={styles.label}>
          Idioma
        </Text>
        <Text className={cls.text} style={styles.value}>
          {LANG_LABEL[lang]}
        </Text>

        <Text className={cls.muted} style={styles.label}>
          Mensaje
        </Text>
        {/* `white-space: pre-wrap` en `styles.message`: los saltos de línea del
            visitante se conservan tal cual los escribió. */}
        <Text className={cls.inset} style={styles.message}>
          {message}
        </Text>
      </Section>

      {/* Responder ya funciona con el `Reply-To` de la cabecera; el botón es un
          atajo visible para quien lee en el móvil. */}
      <Button className={cls.button} style={styles.button} href={`mailto:${email}`}>
        Responder
      </Button>
    </EmailLayout>
  );
}
