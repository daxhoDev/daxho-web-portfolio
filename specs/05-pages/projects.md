# Página: Projects (`/projects`, `/es/projects`)

**Estado:** APROBADA · 2026-09-14 · se construye en la fase 4

## Objetivo
Galería completa de los **6** proyectos, incluidos los 3 destacados del home.

## Estructura
- `<h1>` + entradilla breve.
- Rejilla de `ProjectCard`: 1 columna en móvil, 2 en `md`, 3 en `xl`.
- Orden: campo `order` de la colección.

## Filtros
**Decidido (Q-C): sin filtros.** Con 6 proyectos, un filtro añade interfaz y una
isla React sin resolver ningún problema real: los 6 caben en una pantalla de
escritorio. Reevaluar solo si se superan ~12 proyectos.

## Anatomía de `ProjectCard`
Definida en `06-components.md`. Resumen:
1. Captura del proyecto ocupando el mayor espacio posible.
2. Nombre del proyecto.
3. Fila de iconos de tecnologías.
4. Dos botones: **"View details"** y **"Open project"**.

## Interacción (requisito explícito del usuario)
Hacer clic en la card **fuera de los botones** equivale a "View details".

Restricción de accesibilidad vinculante: esto **no** se implementa con un
`onClick` sobre un `<div>`. Se usa el patrón de *enlace principal con área
extendida*: el título es un `<a>` real hacia el detalle, y un pseudo-elemento
`::after` posicionado cubre la card para captar el clic. Los botones se elevan por
encima con `position: relative` y `z-index`.

Ventajas frente al `div` clicable: la card es navegable con teclado sin trucos, el
enlace se puede abrir en pestaña nueva y copiar su URL, y los lectores de pantalla
la anuncian como lo que es. Un `div` con `onClick` incumpliría WCAG AA.

## SEO

**Se construye en la fase 8.** La fase 4 entregó `<title>` y `hreflang`.

- `<title>`: en "Projects — Daxho" · es "Proyectos — Daxho"
- `description` (aprobada el 2026-09-17). Sustituye al uso de la entradilla, que
  hasta la fase 8 servía de `description` con su texto de relleno:
  - en: "Selected work: what each project solves, what it is built with and how
    it turned out."
  - es: "Trabajos seleccionados: qué resuelve cada proyecto, con qué está
    construido y en qué quedó."
- JSON-LD `BreadcrumbList`.
- OG: imagen genérica del sitio. Las dinámicas son solo del detalle (ADR-0016).

## Criterios de aceptación
- [ ] Tabulación: título → "View details" → "Open project", en ese orden.
- [ ] El clic en la card lleva al detalle; el clic en un botón hace lo suyo y no
      dispara el del contenedor.
- [ ] "Open project" abre en pestaña nueva con `rel="noopener noreferrer"`.
- [ ] Si un proyecto no tiene `liveUrl`, el botón "Open project" se oculta (no se
      muestra deshabilitado sin explicación).
- [ ] Las capturas no provocan CLS: dimensiones explícitas y `aspect-ratio` fijo.
