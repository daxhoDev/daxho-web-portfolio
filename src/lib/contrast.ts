/**
 * Cálculo de contraste WCAG 2.2.
 *
 * La spec (02-design-system.md §2.4) exige verificar los ratios con una
 * herramienta real en lugar de dar por buenas las estimaciones de la fase de
 * diseño. Esto ES esa herramienta: /styleguide muestra los valores calculados
 * aquí, en el build, a partir de los tokens reales.
 *
 * Fórmulas: https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
 */

export type Rgb = readonly [number, number, number];

export function hexToRgb(hex: string): Rgb {
  const normalized = hex.trim().replace(/^#/, '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Color hexadecimal inválido: ${hex}`);
  }

  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ] as const;
}

/** Linealiza un canal sRGB (0-255) al espacio lineal que usa WCAG. */
function linearize(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(rgb: Rgb): number {
  const [r, g, b] = rgb;
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** Ratio de contraste entre dos colores. Va de 1 (idénticos) a 21 (negro/blanco). */
export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(hexToRgb(foreground));
  const l2 = relativeLuminance(hexToRgb(background));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export type WcagLevel = 'AAA' | 'AA' | 'fail';

/**
 * Nivel alcanzado.
 * Texto normal: AA 4.5, AAA 7. Texto grande (>=24px o >=18.66px negrita) y
 * componentes de UI: AA 3, AAA 4.5.
 */
export function wcagLevel(ratio: number, large = false): WcagLevel {
  const aa = large ? 3 : 4.5;
  const aaa = large ? 4.5 : 7;
  if (ratio >= aaa) return 'AAA';
  if (ratio >= aa) return 'AA';
  return 'fail';
}

export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}
