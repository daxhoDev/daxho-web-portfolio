# ADR-0003 — TypeScript strict + alias de importación

**Estado:** APROBADA · 2026-09-09

## Decisión
- `extends: "astro/tsconfigs/strict"`.
- Alias `@/*` → `src/*`, declarado en `tsconfig.json`.
- Ningún `any` implícito. Un `any` explícito requiere comentario justificándolo.

## Razones
- `strict` detecta en compilación los errores de `undefined`/`null` que de otro
  modo aparecen en runtime en el navegador del visitante.
- El alias evita rutas relativas frágiles del tipo `../../../components/`.

## Consecuencias
- `astro check` forma parte del pipeline de CI (ver ADR-0017).
- El alias debe replicarse en la configuración de Vitest para que los tests
  resuelvan las mismas rutas.
