import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio, wcagLevel } from '@/lib/contrast';
import { BLOOD, CONTRAST_CHECKS, DARK, INK, LIGHT } from '@/lib/palette';

const TOKENS_CSS = readFileSync(
  resolve(process.cwd(), 'src/styles/tokens.css'),
  'utf-8',
).toLowerCase();

/**
 * src/lib/palette.ts es un espejo de tokens.css. Si alguien cambia un color en
 * el CSS y olvida el TS, /styleguide mostraría ratios de contraste falsos: los
 * de una paleta que ya no existe. Este test lo impide.
 */
describe('palette.ts sincronizada con tokens.css', () => {
  it('todos los valores de la rampa Blood aparecen en el CSS', () => {
    for (const [step, hex] of Object.entries(BLOOD)) {
      expect(TOKENS_CSS, `blood-${step} (${hex}) falta en tokens.css`).toContain(hex);
    }
  });

  it('todos los valores de la rampa Ink aparecen en el CSS', () => {
    for (const [step, hex] of Object.entries(INK)) {
      expect(TOKENS_CSS, `ink-${step} (${hex}) falta en tokens.css`).toContain(hex);
    }
  });
});

/**
 * Criterio de aceptación de 11-styleguide.md: todos los ratios cumplen AA en
 * AMBOS temas. Este test convierte ese criterio en algo que falla solo.
 */
describe('todas las combinaciones cumplen WCAG AA', () => {
  for (const [themeName, tokens] of [
    ['claro', LIGHT],
    ['oscuro', DARK],
  ] as const) {
    describe(`tema ${themeName}`, () => {
      for (const check of CONTRAST_CHECKS) {
        it(`${check.label}`, () => {
          const ratio = contrastRatio(tokens[check.fg], tokens[check.bg]);
          const level = wcagLevel(ratio, check.large);
          expect(level, `ratio ${ratio.toFixed(2)}:1`).not.toBe('fail');
        });
      }
    });
  }
});
