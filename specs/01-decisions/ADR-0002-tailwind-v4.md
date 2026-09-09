# ADR-0002 — Tailwind CSS v4

**Estado:** APROBADA · 2026-09-09

## Decisión
Tailwind CSS v4, con configuración CSS-first mediante `@theme` en lugar de
`tailwind.config.js`.

## Razones
- Es la versión actual; empezar en v3 sería nacer con deuda de migración.
- El bloque `@theme` es el lugar natural para los design tokens de
  `02-design-system.md`: los tokens se declaran una vez como custom properties de
  CSS y Tailwind genera las utilidades a partir de ellos.
- Motor nuevo, builds notablemente más rápidos y sin `postcss.config` adicional.

## Consecuencias
- Los tokens viven en un único archivo CSS global, no en JS.
- Las custom properties están disponibles también fuera de Tailwind (animaciones
  con CSS puro, SVG con `currentColor`).
- Cuidado con librerías de terceros que asuman v3.

## Riesgo aceptado
Menos ejemplos y respuestas de comunidad para v4 que para v3.
