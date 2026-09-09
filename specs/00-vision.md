# 00 — Visión

**Estado:** APROBADA (base) · 2026-09-09

## Sujeto

- **Nombre:** Dayron Alexis Díaz Rodríguez
- **Alias:** Daxho
- **Profesión:** Ingeniero de Software
- **Experiencia:** +2 años

## Objetivo del sitio

Portafolio web personal que sirva como carta de presentación profesional. El
visitante objetivo es alguien que evalúa a Daxho para una oportunidad laboral o un
encargo: reclutador técnico, CTO, cliente potencial.

## Éxito

El sitio cumple su función si un visitante, en menos de 30 segundos, entiende:

1. Quién es Daxho y a qué se dedica.
2. Que sabe construir cosas (proyectos visibles y verificables).
3. Cómo contactarlo.

## Principios de producto

1. **La legibilidad gana a la estética.** El sitio es visualmente agresivo por
   diseño (glitch, typing, acento rojo sangre), pero ningún efecto puede impedir
   leer un nombre, un título o una descripción.
2. **El rendimiento es una funcionalidad.** Ver `09-testing.md`: Lighthouse ≥95 es
   criterio de aceptación, no un objetivo aspiracional.
3. **Accesible por defecto.** WCAG 2.2 AA. `prefers-reduced-motion` desactiva todo
   el movimiento no esencial.
4. **Bilingüe de verdad.** El español no es una traducción de segunda: mismo
   contenido, mismo SEO, misma calidad.
5. **Sin decisiones ocultas.** Todo lo que se ve en pantalla tiene una razón escrita
   en `specs/`.

## Fuera de alcance (por ahora)

- Blog.
- CMS o panel de administración.
- Testimonios.
- Autenticación / área privada.
- Dominio propio (se usa la URL de Vercel; ver ADR-0004).
