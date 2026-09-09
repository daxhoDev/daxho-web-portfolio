import { describe, expect, it } from 'vitest';
import {
  contrastRatio,
  hexToRgb,
  relativeLuminance,
  wcagLevel,
} from '@/lib/contrast';

describe('hexToRgb', () => {
  it('acepta la forma larga', () => {
    expect(hexToRgb('#8A0303')).toEqual([138, 3, 3]);
  });

  it('acepta la forma corta y la expande', () => {
    expect(hexToRgb('#fff')).toEqual([255, 255, 255]);
  });

  it('acepta valores sin almohadilla', () => {
    expect(hexToRgb('08090b')).toEqual([8, 9, 11]);
  });

  it('rechaza valores inválidos', () => {
    expect(() => hexToRgb('#zzz')).toThrow();
    expect(() => hexToRgb('#12345')).toThrow();
  });
});

describe('relativeLuminance', () => {
  it('devuelve 0 para el negro y 1 para el blanco', () => {
    expect(relativeLuminance([0, 0, 0])).toBe(0);
    expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1, 5);
  });
});

describe('contrastRatio', () => {
  it('da 21:1 entre negro y blanco', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 2);
  });

  it('da 1:1 entre un color y sí mismo', () => {
    expect(contrastRatio('#8A0303', '#8A0303')).toBeCloseTo(1, 5);
  });

  it('es simétrico', () => {
    expect(contrastRatio('#8A0303', '#ffffff')).toBeCloseTo(
      contrastRatio('#ffffff', '#8A0303'),
      5,
    );
  });
});

/**
 * Estos son los tests que protegen la decisión de ADR-0012: el acento no puede
 * ser el mismo tono en ambos temas.
 */
describe('ADR-0012 — el acento debe cumplir AA en ambos temas', () => {
  const BLOOD_800 = '#8a0303';
  const BLOOD_400 = '#f04747';
  const LIGHT_SURFACE = '#ffffff';
  const DARK_BASE = '#08090b';

  it('blood-800 cumple AA para texto sobre superficie clara', () => {
    const ratio = contrastRatio(BLOOD_800, LIGHT_SURFACE);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    expect(wcagLevel(ratio)).not.toBe('fail');
  });

  it('blood-800 NO cumple AA sobre fondo oscuro: por eso existe la rampa', () => {
    const ratio = contrastRatio(BLOOD_800, DARK_BASE);
    expect(ratio).toBeLessThan(4.5);
  });

  it('blood-400 cumple AA para texto sobre fondo oscuro', () => {
    const ratio = contrastRatio(BLOOD_400, DARK_BASE);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

describe('wcagLevel', () => {
  it('clasifica texto normal', () => {
    expect(wcagLevel(7.5)).toBe('AAA');
    expect(wcagLevel(5)).toBe('AA');
    expect(wcagLevel(3)).toBe('fail');
  });

  it('aplica el umbral rebajado a texto grande', () => {
    expect(wcagLevel(3.2, true)).toBe('AA');
    expect(wcagLevel(2.9, true)).toBe('fail');
  });
});
