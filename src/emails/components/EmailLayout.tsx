/**
 * Marco común de los correos — 14-email.md (APROBADA).
 *
 * Cabecera con la marca (`>daxho▮`, 12-brand.md) y pie con el origen del envío.
 * Todo el estilo entra en línea desde `theme.ts`; lo único que va en un
 * `<style>` es la variante oscura, porque `@media` no cabe en un atributo.
 */
import type { ReactNode } from 'react';
import { Body, Container, Head, Hr, Html, Preview, Text } from 'react-email';

import { cls, darkModeCss, styles } from '@/emails/theme';

interface Props {
  /** Línea que el cliente enseña junto al asunto en la bandeja. */
  preview: string;
  /** Origen del aviso, en el pie. Sale de `SITE_URL` (ADR-0016). */
  siteUrl: string;
  children: ReactNode;
}

export function EmailLayout({ preview, siteUrl, children }: Props) {
  return (
    <Html lang="es">
      <Head>
        {/* Sin estas dos, varios clientes ignoran `prefers-color-scheme` y
            aplican su propia inversión sobre el correo entero. */}
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{darkModeCss}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body className={cls.base} style={styles.body}>
        <Container className={cls.surface} style={styles.container}>
          {/* La marca es texto, no imagen: Gmail bloquea las imágenes por
              defecto y la identidad no puede depender de que se carguen. */}
          <Text className={cls.text} style={styles.brand}>
            <span className={cls.accent} style={styles.brandAccent}>
              {'>'}
            </span>
            daxho
            <span className={cls.accent} style={styles.brandAccent}>
              ▮
            </span>
          </Text>

          {children}

          <Hr className={cls.separator} style={styles.separator} />
          {/* La frase se compone en JS a propósito: dos hijos de texto seguidos
              hacen que React intercale un `<!-- -->` en medio del HTML. */}
          <Text className={cls.muted} style={styles.footer}>
            {`Enviado desde el formulario de contacto de ${siteUrl}`}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
