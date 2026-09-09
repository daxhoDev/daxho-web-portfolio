# ADR-0005 — Contenido con Content Collections + MDX

**Estado:** APROBADA · 2026-09-09

## Decisión
Los proyectos, la experiencia y las skills se modelan como Content Collections de
Astro, con esquemas validados por Zod. El cuerpo largo (detalle de proyecto) en
MDX; los datos estructurados (skills, experiencia) en archivos de datos.

## Razones
- Zod valida el contenido **en el build**: si a un proyecto le falta el stack o la
  captura, el build falla en lugar de publicarse roto.
- Los tipos se generan solos, así que las plantillas están tipadas.
- MDX permite insertar componentes (galería, callout, bloque de código) dentro de
  la descripción de un proyecto sin inventar un mini-lenguaje propio.
- Añadir un proyecto = añadir un archivo. Sin CMS, sin base de datos.

## Consecuencias
- Requiere `@astrojs/mdx`.
- El esquema exacto se define en `04-content-model.md` y es vinculante.
