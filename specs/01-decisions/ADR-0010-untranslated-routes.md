# ADR-0010 — Rutas sin traducir

**Estado:** APROBADA · 2026-09-09

## Contexto
Pregunta del usuario: ¿conviene traducir los segmentos de ruta
(`/es/proyectos`) o mantenerlos en inglés (`/es/projects`)?

## Análisis

**A favor de traducir:** la palabra clave en la URL es una señal SEO menor pero
real en español; el enlace se percibe más nativo al compartirlo.

**En contra:**
- Obliga a mantener una tabla de equivalencias entre rutas para que el selector de
  idioma lleve a la página homóloga y no al home.
- Cada ruta nueva puede olvidarse de traducir, y el fallo es silencioso.
- Incoherencia inevitable en los proyectos: el slug de un proyecto es un nombre
  propio y no se traduce, así que la URL queda mezclada
  (`/es/proyectos/task-manager-app`).

**Dato relevante:** las palabras de la URL son una señal muy débil para Google. Lo
que resuelve el multiidioma es `hreflang` + `<html lang>` + contenido realmente
traducido, todo ello ya cubierto por ADR-0008. Vercel, Stripe y MDN mantienen las
rutas en inglés con solo el prefijo de locale.

## Decisión (aprobada)
Mantener las rutas en inglés; solo el prefijo `/es` distingue el idioma. El coste
SEO es despreciable y se elimina una clase entera de bugs.
