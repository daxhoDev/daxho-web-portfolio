import { describe, expect, it } from 'vitest';

import { isDraft, tsHasDrafts } from '../../scripts/check-drafts.mjs';

/**
 * Guarda de CI de la regla de drafts (04-content-model.md, DEVIATIONS.md).
 * El caso que justifica el script en vez de un grep es el campo AUSENTE.
 */
describe('isDraft', () => {
  const doc = (frontmatter: string) => `---\ntitle: X\n${frontmatter}\n---\nCuerpo`;

  it('draft: true es draft', () => {
    expect(isDraft(doc('draft: true'))).toBe(true);
  });

  it('draft: false publica', () => {
    expect(isDraft(doc('draft: false'))).toBe(false);
  });

  it('SIN el campo es draft, porque el esquema lo pone a true por defecto', () => {
    expect(isDraft(doc('order: 1'))).toBe(true);
  });

  it('tolera un comentario al final de la línea', () => {
    expect(isDraft(doc('draft: false # revisado'))).toBe(false);
  });

  it('solo mira el frontmatter, no el cuerpo', () => {
    expect(isDraft('---\ndraft: false\n---\ndraft: true en el texto')).toBe(false);
  });

  it('un archivo sin frontmatter se bloquea', () => {
    expect(isDraft('Solo cuerpo')).toBe(true);
  });
});

/**
 * Archivos TS de contenido (education.ts, languages.ts, social.ts): sin esquema
 * con valor por defecto, cada entrada de relleno lleva `draft: true` explícito.
 */
describe('tsHasDrafts', () => {
  it('detecta una entrada de relleno', () => {
    expect(tsHasDrafts("{ name: 'GitHub', href: '#', draft: true },")).toBe(true);
  });

  it('pasa un archivo con todo publicado', () => {
    expect(tsHasDrafts("{ name: 'GitHub', href: 'https://github.com/x', draft: false },")).toBe(false);
  });

  it('pasa un archivo sin el campo, como tech.ts', () => {
    expect(tsHasDrafts("{ key: 'react', label: 'React' },")).toBe(false);
  });
});
