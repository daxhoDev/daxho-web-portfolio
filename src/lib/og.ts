/**
 * Imágenes Open Graph — ADR-0016, fase 8 (13-roadmap.md).
 *
 * Satori dibuja el SVG y sharp lo pasa a PNG. TODO ocurre en el build: las
 * rutas de `src/pages/og/` son estáticas, así que ningún visitante dispara una
 * generación ni paga una función.
 *
 * Los colores son literales de la rampa oscura de `tokens.css`, como en el
 * correo y por el mismo motivo: aquí no hay CSS ni variables. `seo.test.ts` los
 * compara con los tokens para que no se desincronicen.
 *
 * El cursor de la marca se dibuja como un rectángulo, no con el carácter `▮`:
 * si la fuente no trajera ese glifo, la marca saldría partida o en blanco.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import satori from 'satori';
import sharp from 'sharp';

export const OG_SIZE = { width: 1200, height: 630 } as const;

/** Rampa oscura de `tokens.css`: la OG se dibuja siempre en oscuro (ADR-0016). */
export const OG_COLORS = {
  base: '#08090b', // --bg-base (oscuro)
  text: '#f0f2f5', // --fg-primary
  muted: '#949ba6', // --fg-secondary
  accent: '#f04747', // --accent-text
  accentSurface: '#8a0303', // --accent-surface (claro): la barra inferior
} as const;

const FONT_DIR = 'src/assets/fonts';

/**
 * Los TTF viven en el repo porque Satori no lee `woff2`, que es lo único que
 * sirve el sitio (ADR-0016). Se leen del disco en el build, nunca en ejecución.
 */
function loadFont(file: string): Buffer {
  return readFileSync(join(process.cwd(), FONT_DIR, file));
}

/** Nodo mínimo al estilo de React, que es lo que Satori consume. */
interface Node {
  type: string;
  props: Record<string, unknown> & { children?: unknown };
}

const el = (type: string, props: Node['props']): Node => ({ type, props });

const FONT_FAMILY = 'JetBrains Mono';

function brand(fontSize: number): Node {
  return el('div', {
    style: { display: 'flex', alignItems: 'center', fontSize, fontWeight: 700 },
    children: [
      el('span', { style: { color: OG_COLORS.accent }, children: '>' }),
      el('span', { style: { color: OG_COLORS.text }, children: 'daxho' }),
      el('div', {
        style: {
          backgroundColor: OG_COLORS.accent,
          width: fontSize * 0.5,
          height: fontSize * 0.9,
          marginLeft: fontSize * 0.1,
        },
      }),
    ],
  });
}

export interface OgOptions {
  /** Título grande. Ausente en la genérica, que enseña solo la marca. */
  title?: string;
  /** Línea secundaria: stack del proyecto o subtítulo del sitio. */
  subtitle?: string;
  /** Esquina inferior derecha: el año del proyecto. */
  note?: string;
  /** Esquina inferior izquierda: el dominio, sin protocolo. */
  host: string;
}

function ogTree({ title, subtitle, note, host }: OgOptions): Node {
  // Un título largo con el mismo cuerpo que uno corto se sale de la tarjeta.
  const titleSize = title && title.length > 34 ? 56 : 72;

  return el('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      backgroundColor: OG_COLORS.base,
      borderBottom: `14px solid ${OG_COLORS.accentSurface}`,
      padding: '64px',
      fontFamily: FONT_FAMILY,
    },
    children: [
      brand(title ? 36 : 96),
      el('div', {
        style: { display: 'flex', flexDirection: 'column' },
        children: [
          title
            ? el('div', {
                style: {
                  color: OG_COLORS.text,
                  fontSize: titleSize,
                  fontWeight: 700,
                  lineHeight: 1.15,
                },
                children: title,
              })
            : null,
          subtitle
            ? el('div', {
                style: {
                  color: OG_COLORS.muted,
                  fontSize: 30,
                  marginTop: title ? 24 : 0,
                },
                children: subtitle,
              })
            : null,
        ].filter(Boolean),
      }),
      el('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          color: OG_COLORS.muted,
          fontSize: 26,
        },
        children: [el('span', { children: host }), el('span', { children: note ?? '' })],
      }),
    ],
  });
}

/** Devuelve el PNG de 1200×630 listo para servir. */
export async function renderOgImage(options: OgOptions): Promise<Buffer> {
  const svg = await satori(ogTree(options) as never, {
    ...OG_SIZE,
    fonts: [
      {
        name: FONT_FAMILY,
        data: loadFont('JetBrainsMono-Regular.ttf'),
        weight: 400,
        style: 'normal',
      },
      { name: FONT_FAMILY, data: loadFont('JetBrainsMono-Bold.ttf'), weight: 700, style: 'normal' },
    ],
  });

  return sharp(Buffer.from(svg)).png().toBuffer();
}
