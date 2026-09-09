/**
 * Espejo en TypeScript de los tokens de src/styles/tokens.css.
 *
 * Existe SOLO para que /styleguide pueda calcular y mostrar los ratios de
 * contraste reales en el build. La fuente de verdad para los estilos sigue
 * siendo el CSS; este archivo debe mantenerse sincronizado con él, y un test
 * unitario comprueba que no se desincronizan.
 */

export const BLOOD = {
  50: '#fff0f0',
  100: '#ffdcdc',
  200: '#ffbdbd',
  300: '#ff8f8f',
  400: '#f04747',
  500: '#d41f1f',
  600: '#b31212',
  700: '#9c0808',
  800: '#8a0303',
  900: '#6e0404',
  950: '#3a0202',
} as const;

export const INK = {
  0: '#fafbfc',
  50: '#f0f2f5',
  100: '#dfe3e8',
  200: '#bfc5ce',
  300: '#949ba6',
  400: '#6b7280',
  500: '#4a505b',
  600: '#333841',
  700: '#24282f',
  800: '#1a1d22',
  850: '#14171b',
  900: '#0e1013',
  950: '#08090b',
} as const;

export interface SemanticTokens {
  bgBase: string;
  bgSurface: string;
  bgElevated: string;
  bgInset: string;
  fgPrimary: string;
  fgSecondary: string;
  fgMuted: string;
  borderSubtle: string;
  borderDefault: string;
  borderStrong: string;
  borderInteractive: string;
  accentText: string;
  accentTextHover: string;
  accentSurface: string;
  accentOnSurface: string;
  accentBorder: string;
  focusRing: string;
  stateError: string;
  stateSuccess: string;
}

export const LIGHT: SemanticTokens = {
  bgBase: INK[0],
  bgSurface: '#ffffff',
  bgElevated: INK[50],
  bgInset: INK[100],
  fgPrimary: INK[900],
  fgSecondary: INK[600],
  fgMuted: INK[400],
  borderSubtle: INK[100],
  borderDefault: INK[200],
  borderStrong: INK[300],
  borderInteractive: INK[400],
  accentText: BLOOD[800],
  accentTextHover: BLOOD[600],
  accentSurface: BLOOD[800],
  accentOnSurface: '#ffffff',
  accentBorder: BLOOD[800],
  focusRing: BLOOD[600],
  stateError: BLOOD[600],
  stateSuccess: '#1f7a4d',
};

export const DARK: SemanticTokens = {
  bgBase: INK[950],
  bgSurface: INK[900],
  bgElevated: INK[850],
  bgInset: INK[800],
  fgPrimary: INK[50],
  fgSecondary: INK[300],
  fgMuted: INK[400],
  borderSubtle: INK[800],
  borderDefault: INK[700],
  borderStrong: INK[600],
  borderInteractive: INK[400],
  accentText: BLOOD[400],
  accentTextHover: BLOOD[300],
  accentSurface: BLOOD[900],
  accentOnSurface: INK[50],
  accentBorder: BLOOD[700],
  focusRing: BLOOD[400],
  stateError: BLOOD[400],
  stateSuccess: '#3fbf85',
};

/** Combinaciones que DEBEN cumplir AA. Se auditan en /styleguide y en tests. */
export const CONTRAST_CHECKS = [
  { label: 'fg-primary / bg-base', fg: 'fgPrimary', bg: 'bgBase', large: false },
  { label: 'fg-primary / bg-surface', fg: 'fgPrimary', bg: 'bgSurface', large: false },
  { label: 'fg-secondary / bg-base', fg: 'fgSecondary', bg: 'bgBase', large: false },
  { label: 'fg-muted / bg-base', fg: 'fgMuted', bg: 'bgBase', large: true },
  { label: 'accent-text / bg-base', fg: 'accentText', bg: 'bgBase', large: false },
  { label: 'accent-text / bg-surface', fg: 'accentText', bg: 'bgSurface', large: false },
  { label: 'accent-on-surface / accent-surface', fg: 'accentOnSurface', bg: 'accentSurface', large: false },
  { label: 'state-error / bg-base', fg: 'stateError', bg: 'bgBase', large: false },
  { label: 'state-success / bg-base', fg: 'stateSuccess', bg: 'bgBase', large: false },
  { label: 'focus-ring / bg-base', fg: 'focusRing', bg: 'bgBase', large: true },
  { label: 'border-interactive / bg-base', fg: 'borderInteractive', bg: 'bgBase', large: true },
  { label: 'border-interactive / bg-surface', fg: 'borderInteractive', bg: 'bgSurface', large: true },
] as const satisfies readonly {
  label: string;
  fg: keyof SemanticTokens;
  bg: keyof SemanticTokens;
  large: boolean;
}[];
