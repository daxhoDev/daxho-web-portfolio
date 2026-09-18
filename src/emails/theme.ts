/**
 * Tokens del correo — 14-email.md (APROBADA).
 *
 * Los clientes de correo NO soportan variables CSS: Gmail descarta `var()` y
 * deja la propiedad sin valor. Por eso los colores viven aquí en literales, y
 * por eso `tests/unit/emails.test.ts` los compara uno a uno con
 * `src/styles/tokens.css`: el literal solo es aceptable si algo impide que se
 * desincronice del sitio.
 *
 * Solo servidor: este archivo nunca llega al navegador.
 */
import type { CSSProperties } from 'react';

/** Los dos temas del sitio, con los pares exactos de `tokens.css`. */
export const palette = {
  light: {
    base: '#fafbfc', // --bg-base
    surface: '#ffffff', // --bg-surface
    inset: '#dfe3e8', // --bg-inset
    text: '#0e1013', // --fg-primary
    textMuted: '#333841', // --fg-secondary
    accent: '#8a0303', // --accent-text
    buttonBg: '#8a0303', // --accent-surface
    buttonText: '#ffffff', // --accent-on-surface
  },
  dark: {
    base: '#08090b',
    surface: '#0e1013',
    inset: '#1a1d22',
    text: '#f0f2f5',
    textMuted: '#949ba6',
    accent: '#f04747',
    buttonBg: '#6e0404',
    buttonText: '#f0f2f5',
  },
} as const;

export type ThemeColors = (typeof palette)['light'];

/**
 * Las mismas pilas de `tokens.css` SIN las fuentes autoalojadas: Gmail no carga
 * fuentes web, así que declararlas solo alarga la cadena.
 */
export const fonts = {
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
  sans: "-apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
} as const;

/**
 * Clases que usa la variante oscura. Un atributo `style` no admite `@media`,
 * así que el único camino hasta estos nodos desde el `<style>` del `<Head>` es
 * una clase, y la regla necesita `!important` para ganarle al estilo en línea.
 */
export const cls = {
  base: 'e-base',
  surface: 'e-surface',
  inset: 'e-inset',
  text: 'e-text',
  muted: 'e-muted',
  accent: 'e-accent',
  button: 'e-button',
  separator: 'e-sep',
} as const;

/** `px` en todo: algunos clientes no soportan `rem` (14-email.md). */
export const styles = {
  body: {
    backgroundColor: palette.light.base,
    color: palette.light.text,
    fontFamily: fonts.sans,
    margin: '0',
    padding: '24px 12px',
  },
  container: {
    backgroundColor: palette.light.surface,
    border: `1px solid ${palette.light.inset}`,
    borderRadius: '6px',
    margin: '0 auto',
    maxWidth: '600px',
    padding: '24px',
  },
  brand: {
    color: palette.light.text,
    fontFamily: fonts.mono,
    fontSize: '18px',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    margin: '0',
  },
  brandAccent: {
    color: palette.light.accent,
  },
  title: {
    color: palette.light.text,
    fontFamily: fonts.mono,
    fontSize: '20px',
    fontWeight: 700,
    margin: '24px 0 16px',
  },
  label: {
    color: palette.light.textMuted,
    fontFamily: fonts.mono,
    fontSize: '12px',
    letterSpacing: '0.08em',
    margin: '0 0 2px',
    textTransform: 'uppercase',
  },
  value: {
    color: palette.light.text,
    fontFamily: fonts.sans,
    fontSize: '15px',
    margin: '0 0 16px',
  },
  link: {
    color: palette.light.accent,
    textDecoration: 'underline',
  },
  message: {
    backgroundColor: palette.light.inset,
    borderRadius: '4px',
    color: palette.light.text,
    fontFamily: fonts.sans,
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '0 0 24px',
    padding: '16px',
    // Conserva los saltos de línea del visitante (14-email.md) y parte las
    // palabras largas: un enlace pegado no puede ensanchar el correo.
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  button: {
    backgroundColor: palette.light.buttonBg,
    borderRadius: '4px',
    color: palette.light.buttonText,
    display: 'inline-block',
    fontFamily: fonts.mono,
    fontSize: '14px',
    fontWeight: 700,
    padding: '12px 20px',
    textDecoration: 'none',
  },
  separator: {
    border: 'none',
    borderTop: `1px solid ${palette.light.inset}`,
    margin: '24px 0 16px',
  },
  footer: {
    color: palette.light.textMuted,
    fontFamily: fonts.mono,
    fontSize: '12px',
    margin: '0',
  },
} satisfies Record<string, CSSProperties>;

/**
 * Variante oscura (Q-Q). Los clientes que no la soportan se quedan en la base
 * clara, que es la que espera su algoritmo de inversión.
 */
export const darkModeCss = `
@media (prefers-color-scheme: dark) {
  .${cls.base} { background-color: ${palette.dark.base} !important; }
  .${cls.surface} {
    background-color: ${palette.dark.surface} !important;
    border-color: ${palette.dark.inset} !important;
  }
  .${cls.inset} {
    background-color: ${palette.dark.inset} !important;
    color: ${palette.dark.text} !important;
  }
  .${cls.text} { color: ${palette.dark.text} !important; }
  .${cls.muted} { color: ${palette.dark.textMuted} !important; }
  .${cls.accent} { color: ${palette.dark.accent} !important; }
  .${cls.button} {
    background-color: ${palette.dark.buttonBg} !important;
    color: ${palette.dark.buttonText} !important;
  }
  .${cls.separator} { border-top-color: ${palette.dark.inset} !important; }
}
`.trim();
