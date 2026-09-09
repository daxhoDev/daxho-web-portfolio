# ADR-0007 — Testing: Vitest + Playwright

**Estado:** APROBADA · 2026-09-09

## Decisión
- **Vitest** para lógica pura: utilidades de i18n, helpers de tema, validación de
  esquemas de contenido, validación del formulario.
- **Playwright** para flujos de extremo a extremo en navegador real.
- **Regla de proceso (instrucción explícita del usuario):** toda nueva
  funcionalidad se entrega con sus tests, y todo fix importante con un test de
  regresión.

## Razones
- Vitest comparte pipeline con Vite (el que ya usa Astro): sin configuración
  duplicada.
- Los comportamientos más frágiles de este sitio (persistencia de tema, detección
  de idioma, hidratación de islas React) solo se pueden verificar de verdad en un
  navegador; ahí Playwright es insustituible.

## Consecuencias
- CI ejecuta ambas suites (ver ADR-0017).
- El detalle de qué se testea está en `09-testing.md` y es vinculante.
