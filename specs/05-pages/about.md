# Página: About (`/about`, `/es/about`)

**Estado:** APROBADA · 2026-09-16 · se construye en la fase 6; SEO en la fase 8
Añadida por decisión del usuario (Q30).

## Objetivo
Contar quién es Daxho con más profundidad que el home: trayectoria, capacidades y
una cara.

## Secciones, en orden

### 1. Encabezado
- `<h1>` de la página con efecto de tecleo (disparado, ver ADR-0014).
- Entradilla de una o dos frases. Relleno hasta la fase 10 (Q32).

### 2. Biografía + fotografía
- Texto largo (2-4 párrafos), ancho de lectura máximo 65ch. Relleno hasta la fase
  10 (Q32).
- Fotografía de Daxho. Pendiente de la imagen real (Q33); mientras tanto,
  placeholder marcado.

### 3. Skills
- Agrupadas con los **seis grupos de `10-tech-catalog.md`**: Lenguajes, Frontend,
  Backend, Datos, Infraestructura y Herramientas. Las 25 tecnologías del
  catálogo, sin selección (`src/content/skills.ts`).
- Icono de tecnología (silueta sólida, ver `02-design-system.md` §6) + etiqueta.
- **Sin nivel de dominio** (Q-D decidida): solo agrupación por categoría. Los
  niveles autoasignados no son verificables y un entrevistador técnico los lee con
  escepticismo. La prueba del nivel son los proyectos.

### 4. Experiencia
- Línea de tiempo vertical alimentada por la colección `experience`.
- Cada entrada: empresa, rol, rango de fechas, hitos, stack.
- Marcado semántico con `<ol>`: es una secuencia ordenada, no decoración.
- **De más reciente a más antigua** (`startDate` descendente).
- Relleno marcado hasta la fase 10.

### 5. CTA
- Enlace a `/resume` y a `/contact`, con los textos de la navegación.

## SEO

La fase 6 entrega `<title>` y `hreflang`; el JSON-LD llega en la fase 8.

- `<title>`: "About — Daxho"
- JSON-LD `Person` ampliado (`alumniOf`, `knowsAbout`, `worksFor`).

## Criterios de aceptación
- [ ] La línea de tiempo es legible como lista por un lector de pantalla.
- [ ] La fotografía tiene `alt` descriptivo y dimensiones explícitas.
- [ ] Contenido completo en ambos idiomas.
