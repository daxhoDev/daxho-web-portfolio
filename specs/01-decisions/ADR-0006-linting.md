# ADR-0006 — Linting y formato

**Estado:** APROBADA · 2026-09-09

## Contexto
El usuario preguntó por la diferencia entre Biome y ESLint + Prettier.

## Alternativas
**Biome** — binario único en Rust, lint + formato, 10-25× más rápido, un solo
archivo de configuración.
Limitación decisiva aquí: su soporte de `.astro` cubre el frontmatter y los
bloques `<script>`, **no el template**, que es justo donde vivirá la mayor parte
del markup de este proyecto. Su conjunto de reglas de accesibilidad es menor que
el de `jsx-a11y`, y el ordenado de clases de Tailwind sigue siendo experimental.

**ESLint + Prettier** — dos herramientas, más paquetes, más lento; a cambio,
`eslint-plugin-astro` y `prettier-plugin-astro` cubren el archivo completo,
`eslint-plugin-jsx-a11y` da la cobertura de accesibilidad que exige el objetivo
WCAG AA, y `prettier-plugin-tailwindcss` es el ordenador oficial de clases.

## Decisión (aprobada)
**ESLint + Prettier.** La ventaja de velocidad de Biome es irrelevante en un
proyecto de este tamaño; la pérdida de cobertura en `.astro` y accesibilidad, no.

Paquetes previstos: `eslint`, `typescript-eslint`, `eslint-plugin-astro`,
`eslint-plugin-jsx-a11y`, `prettier`, `prettier-plugin-astro`,
`prettier-plugin-tailwindcss`.

## Revisión futura
Reevaluar Biome cuando su soporte de templates `.astro` sea completo.
